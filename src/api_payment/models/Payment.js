const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    reference_id: {
        id:{
            type: Object,
            required:true,
        },
        amount: {
            type: Number,
            required:true,
        },
        reference_code: {
            type: String,
            required: true,
            unique: true
        },
        service : {
            type: String,
            required: true
        },
        entity : {
            type: String,
            required: true
        },
    },
    transaction_id: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true
    },
    terminal_type: {
        type: String,
        required: true
    },
    terminal_transaction_id: {
        type: Number
    },
    terminal_location: {
        type: String
    },
    terminal_id: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    fee: {
        type: Number
    },
    datetime: {
        type: Date,
        default: Date.now
    },
},{timestamps: true}
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
