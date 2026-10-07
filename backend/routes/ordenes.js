const express         = require('express');
const Orden           = require('../models/Orden');
const verificarToken  = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const router          = express.Router();

// POST /api/ordenes - crear una orden
// El usuario Logueado crea su propia orden
router.post('/', verificarToken, async (req, res) => {
    try {
        const { productos, total } = req.body;
        const nuevaOrden = await Orden.create({
            usuario: req.usuario.id,   // viene del token
            productos,
            total
        });
        res.status(201).json(nuevaOrden);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/ordenes - mis ordenes
// cada usuario ve solo sus propias ordenes
router.get('/', verificarToken, async (req, res) => {
    try {
        const ordenes = await Orden
            .find({ usuario: req.usuario.id })
            .populate('usuario', 'nombre email')
            .populate('productos.producto', 'nombre precio');
        res.json(ordenes);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

// GET /api/ordenes/admin/todas — el admin ve TODAS las órdenes de todos los usuarios
// Declarada antes de "GET /" para no chocar con futuras rutas GET /:id
router.get('/admin/todas', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const ordenes = await Orden
            .find({})
            .populate('usuario', 'nombre email')
            .populate('productos.producto', 'nombre precio')
            .sort({ createdAt: -1 });
        res.json(ordenes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/ordenes/:id/estado — el admin cambia el estado de una orden
const ESTADOS_VALIDOS = ['PAGO_CONFIRMADO', 'procesando', 'enviado', 'entregado', 'pendiente'];

router.patch('/:id/estado', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.body;

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }

        const orden = await Orden.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );

        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        res.json(orden);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/ordenes - mis órdenes
// Cada usuario ve solo sus propias órdenes
router.get('/', verificarToken, async (req, res) => {
    try {
        const ordenes = await Orden
            .find({ usuario: req.usuario.id })
            .populate('usuario', 'nombre email')
            .populate('productos.producto', 'nombre precio');
        res.json(ordenes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;