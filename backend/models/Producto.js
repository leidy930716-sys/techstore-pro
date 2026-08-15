// Importar Mongoosepara usar Schema y model
const mongoose = require('mongoose');

// Schema: define los campos de cada documento en Atlas
const productoSchema = new mongoose.Schema({
    id:            { type: Number, required: true}, // Número (1, 2, 3...)
    icono:         { type: String, required: true},
    nombre:         { type: String, required: true},
    descripcion: { type: String, required: true},
    descripcion:  { type: String, required: true},
    descripcion: { type: String, required: true},
    precio:{ type: String, required: true},
    imagen:{ type: String, required: true},
});

// crea el mode - mongoose busca la coleccion 'productos' en atlas
const Producto =mongoose.model('Producto', productoSchema);

// exportar para poder usarlo en server.js
module.exports =Producto