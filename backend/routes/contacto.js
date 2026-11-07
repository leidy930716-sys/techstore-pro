// 1. importar dependencias
const express = require('express');
const Mensaje = require('../models/Mensaje');
const router = express.Router();

// 2. POST /api/contacto -publico: cualquier visitante puede escribir
router.post('/', async (req, res) => {
    try {
        // solo se toman los 5 campos esperados; cualquier otro campo se ignora
        const { nombre, email, telefono, asunto, mensaje } = req.body;

        await Mensaje.create({ nombre, email, telefono, asunto, mensaje });

        res.status(201).json({ message: 'Mensaje recibido' });
    } catch (error) {
        // Si falló una regla del modelo,se devuelve el primer error en español
        if (error.name === 'validationError') {
            const firstError = Object.values(error.errors)[0].message;
            return res.status(400).json({ error: primero });
        }
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
});

// 3. exportar router
module.exports = router;