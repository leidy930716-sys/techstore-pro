//1. Importar dependencias
const express = require('express');
const Producto = require('../models/Producto');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const router = express.Router();

// 2. GET / - Publico, sin token
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

//2B GET /:id - un solo producto por su _id (publico, no requiere token)
// Ejemplo de URL: GET http://localhost:3000/api/productos/64a1b2c3d4e5f6a7b8c9d0e1
router.get('/:id', async (req, res) => {
    try {
        //req.params id lee el valor que llega en la URL despues de /api/productos/
        const producto = await Producto.findById(req.params.id);

        // Si MongoDB no encontro nada con ese _id, producto es null - 404
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        res.json(producto); // 200 OK - Devuelve el objeto producto

    } catch (err) {
        // El catch atrapa el CastError de Mongoose cuando el _id tiene formato invalido
        // (Cualquier texto que no sea un ObjectId de 24 caracteres hexadeimales)
        res.status(404).json({ error: 'Producto no encontrado' })
    }
});

// 3. POST / - Solo admin (verificarToken + verificarAdmin)
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const nuevo = await Producto.create(req.body);
        res.status(201).json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. PUT /:id - solo admin
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const actualizado = await Producto.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. DELETE /:id - solo admin
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const eliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
        res.json({ mensaje: 'Eliminado', eliminado });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 6. Exportar
module.exports = router;