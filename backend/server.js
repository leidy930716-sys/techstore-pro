// 1. Importar dependencias
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const authRoutes     = require('./routes/auth');          // ← AGREGAR S14
const verificarToken = require('./middleware/auth');       // ← AGREGAR S14

// 2. Crear la app y leer el puerto del .env
const app  = express();
const PORT = process.env.PORT || 3000;

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error:', err));

// 5. GET /api/productos — leer todos (S12)
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 6. POST /api/productos — crear producto (NUEVO S13)
app.post('/api/productos', verificarToken, async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. PUT /api/productos/:id — actualizar producto (NUEVO S13)
app.put('/api/productos/:id', verificarToken, async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. DELETE /api/productos/:id — eliminar producto (NUEVO S13)
app.delete('/api/productos/:id', verificarToken, async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente', eliminado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor TechStore Pro ✅' });
});

// 10. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

// 11. Rutas de autenticación ← NUEVO S14
app.use('/api/auth', authRoutes);