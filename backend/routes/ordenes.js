const express         = require('express');
const Orden           = require('../models/Orden');
const verificarToken  = require('../middleware/auth');
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