const mongoose = require('mongoose');
const { Schema } = mongoose;

const ordenSchema = new Schema({
    // ¿Quién hizo la orden? - referencia al _id de un Usuario
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    // Arreglo de productos con cantidad
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Producto'
        },
        cantidad: { type: Number, required: true, min: 1 }
    }],

    // Total calculado en el frontend (o en una ruta)
    total: { type: Number, required: true },

    // Estado del ciclo de vida de la orden
    estado: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'procesando', 'enviado', 'entregado']
    }
}, { timestamps: true }); // agrega createdAt y updatedAt

const Orden = mongoose.model('Orden', ordenSchema);
module.exports = Orden;