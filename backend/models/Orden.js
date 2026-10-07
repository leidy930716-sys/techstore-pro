const mongoose = require('mongoose');
const Usuario = require('./Usuario');
const Producto = require('./Producto');
const { Schema } = mongoose;

const ordenSchema = new Schema({


    //¿Quien hizo la orden? -> referencia al _id de un usuario
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

    //Total calculado en el frontend (o en una ruta)
    total: { type: Number, required: true},

    // Estado del ciclo de vida de la orden
    estado: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'PAGO_CONFIRMADO'] //Valor Agregado
    },

    //Datos de Wompi - se llenan solo c uando el pago fue aprobado
    wompiTransactionId: { type: String },
    wompiReference:     { type: String }

    }, { timestamps: true}); //agrega createdAT y updatedAT

    const Orden = mongoose.model('Orden', ordenSchema);
    module.exports = Orden;