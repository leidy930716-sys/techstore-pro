//1 . Importar las dependencias

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const authRoutes = require('./routes/auth');
const verificarToken = require('./middleware/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');
const pagoRoutes = require('./routes/pago');

//2 . crear la aplicacion y definir el puerto

const app = express();
const PORT = process.env.PORT || 3000;

//3 . Activar middleawares

app.use(cors());
app.use(express.json());

//4. Conectar a MongoDB atlas NUEVO..

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error de conexión:', err))


//9 . ruta de prueba

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor TechStore Pro ✅' });
});

//10 . Arrancar el servidor 

app.listen(PORT, () => {
    console.log(`Servidor en https://localhost:${PORT}`);
});

//11. Rutas de autenticacion <- NUEVO S14
app.use('/api/auth', authRoutes);
// 12. Rutas de productos <- sin cambios
app.use('/api/productos', productosRoutes);
// 13. Rutas de ordenes <- 
app.use('/api/ordenes', ordenesRoutes);
// El webhnook queda expuesto en /api/pagos/webhook dentro del mismo router
app.use('/api/pagos', pagoRoutes);