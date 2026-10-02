// 1. Importar dependencias
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const authRoutes = require('./routes/auth');        
const verificarToken = require('./middleware/auth');       
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');
const pagoRoutes      = require('./routes/pago');

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

// 9. Ruta de prueba
app.get('/api/productos/:id', (req, res) => {
  res.json({ mensaje: 'Servidor TechStore Pro ✅' });
});

// 10. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

// 11. Rutas de autenticación ← NUEVO S14
app.use('/api/auth', authRoutes);

// 12. Rutas de productos  
app.use('/api/productos', productosRoutes);

// 13. Rutas de órdenes  
app.use('/api/ordenes', ordenesRoutes);

// 14. El webhook queda expuesto en /api/pagos/webhook dentro del mismo router
app.use('/api/pagos', pagoRoutes);  // ← AGREGAR S18A
