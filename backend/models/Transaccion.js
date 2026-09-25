const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
    wompiReference: { type: String, unique: true, required: true },
    amountInCents: { type: Number, required: true },
    currency: { type: String, default: 'COP' },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'],
        default: 'PENDING'
    },
    wompiTransactionId: { type: String },
    orden: { type: mongoose.Schema.Types.ObjectId, ref: 'Orden' },
    // Datos del carrito guardados temporalmente hasta que Wompi confirme
    pendingOrderData: {
        usuario: mongoose.Schema.Types.ObjectId,
        productos: Array,
        total: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaccion', TransaccionSchema);