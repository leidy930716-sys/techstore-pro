// 1. importar las dependencias
require('dotenv').config()
const express =require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

// 2. crear  la aplicación y definir el puerto
const app = express();
const PORT = process.env.PORT || 3000;

// 3. activar middlewares
app.use(cors());
app.use(express.json());

// conectar a mongoDB atlas  - nuevo en S12
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ conectado a MongoDB Atlas'))
    .catch((err) => console.error('error de conexion:',err));

    // 5. ruta  GET  /api/productos -ahora lee de MongoDB Atlas
    app.get('/api/productos',async (req, res) => {
        try {
            const productos = await Producto-Producto.find(); // trae todos los docs al Atlas
            res.json(productos);
        }   catch (err) {
            res.status(500).json({error: 'error al obtenor productos'});
        }
});

// 6. ruta de prueba
app.get('/',(req, res) => {
    res.json({mensaje: 'servidor techstore pro ✅'});
});

// 6. arrancar el servidor
app.listen(PORT, ()=>{
    console.log(`servidor en http://localhost:${PORT}`);
});