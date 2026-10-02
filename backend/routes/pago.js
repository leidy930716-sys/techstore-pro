const express = require('express');
const crypto = require('crypto');   // nativo de Node
const Orden = require('../models/Orden');
const Transaccion = require('../models/Transaccion');
const verificarToken = require('../middleware/auth');
const router = express.Router();

// POST /api/pagos/firma — generar firma de integridad para el Widget de Wompi
// Valida el carrito, genera una referencia única, calcula la firma SHA256
// y guarda los datos del pedido en Transaccion con estado PENDING.
router.post('/firma', verificarToken, async (req, res) => {
    const { productos, total } = req.body;

    if (!productos?.length || !total) {
        return res.status(400).json({ error: 'Carrito vacío o total inválido' });
    }

    try {
        // 1. Referencia única para esta transacción
        const reference = `TS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const amountInCents = Math.round(total * 100);
        const currency = 'COP';

        // 2. Calcular firma de integridad — fórmula oficial Wompi
        const raw = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
        const signature = crypto.createHash('sha256').update(raw).digest('hex');

        // 3. Guardar datos del carrito en la Transaccion con estado PENDING
        // ⚠️ req.usuario.id (no ._id) — así lo expone el middleware real de este proyecto
        await Transaccion.create({
            wompiReference: reference, amountInCents, currency,
            status: 'PENDING',
            pendingOrderData: { usuario: req.usuario.id, productos, total }
        });

        // 4. Devolver datos al Widget de Wompi en el frontend
        res.json({
            reference, amountInCents, currency, signature,
            publicKey: process.env.WOMPI_PUBLIC_KEY
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al generar la firma' });
    }
});

// [PASO 3 — NUEVO] Crea la Orden cuando Wompi confirma un pago APPROVED
// (usada por el polling y por el webhook, para no duplicar lógica)
async function confirmarAprobado(transaccion, wompiTx) {
    transaccion.status = wompiTx.status;
    transaccion.wompiTransactionId = wompiTx.id;

    if (wompiTx.status === 'APPROVED' && !transaccion.orden) {
        const pod = transaccion.pendingOrderData;
        const orden = await Orden.create({
            usuario: pod.usuario, productos: pod.productos, total: pod.total,
            wompiTransactionId: wompiTx.id, wompiReference: wompiTx.reference,
            estado: 'PAGO_CONFIRMADO'
        });
        transaccion.orden = orden._id;
    }

    await transaccion.save();
}

// ── GET /api/pagos/estado/:reference ─────────────────────
// El frontend hace polling a esta ruta cada 3 segundos para saber si el
// pago fue aprobado. No necesita webhook ni ngrok en desarrollo.
router.get('/estado/:reference', verificarToken, async (req, res) => {
    try {
        const tx = await Transaccion.findOne({ wompiReference: req.params.reference });
        if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' });

        // [PASO 3 — NUEVO] Sin webhook (no hay ngrok), preguntamos directamente a Wompi.
        // ⚠️ Requiere la llave PRIVADA (WOMPI_PRIVATE_KEY), no la pública.
        if (tx.status === 'PENDING') {
            const wompiRes = await fetch(
                `https://sandbox.wompi.co/v1/transactions?reference=${tx.wompiReference}`,
                { headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` } }
            );

            if (!wompiRes.ok) {
                console.error('Error consultando Wompi:', wompiRes.status, await wompiRes.text());
            } else {
                const wompiJson = await wompiRes.json();
                const wompiTx = wompiJson.data?.[0];

                if (wompiTx && wompiTx.status !== 'PENDING') {
                    await confirmarAprobado(tx, wompiTx);
                }
            }
        }
        res.json({ status: tx.status, ordenId: tx.orden ?? null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno' });
    }
});

// ── POST /webhook/wompi ───────────────────────────────────
// Wompi llama a esta ruta en producción (cuando hay servidor público).
// En desarrollo local el polling del frontend cubre esta función.
router.post('/webhook', async (req, res) => {
    const { signature, timestamp, data } = req.body;
    const secret = process.env.WOMPI_EVENTS_SECRET;
    if (!secret) return res.status(200).json({ ok: true }); // sin secreto → modo dev, ignorar

    // Verificar firma del webhook (fórmula oficial Wompi)
    const tx = data?.transaction;
    if (!tx) return res.status(400).json({ error: 'Payload inválido' });

    const props = (signature?.properties || []).map((prop) => {
        const path = prop.split('.').slice(1);
        let v = tx; for (const k of path) v = v?.[k]; return v;
    }).join('');

    const computed = crypto.createHash('sha256')
        .update(`${props}${timestamp}${secret}`).digest('hex');
    if (computed !== signature?.checksum) return res.status(400).json({ error: 'Firma inválida' });

    const transaccion = await Transaccion.findOne({ wompiReference: tx.reference });
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });

    transaccion.status = tx.status;
    transaccion.wompiTransactionId = tx.id;

    if (tx.status === 'APPROVED' && !transaccion.orden) {
        const pod = transaccion.pendingOrderData;
        const orden = await Orden.create({
            usuario: pod.usuario, productos: pod.productos, total: pod.total,
            wompiTransactionId: tx.id, wompiReference: tx.reference,
            estado: 'PAGO_CONFIRMADO'
        });
        transaccion.orden = orden._id;
    }

    await confirmarAprobado(transaccion, tx);
    res.json({ ok: true });
});

module.exports = router;