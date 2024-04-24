const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    n_reference: {
        type:String, 
        required: true, 
        unique: true
    },
    balance_after: {
        type:Number, 
        required: true,
    },
    amount: { 
        type: Number, 
        required: true 
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    entity_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }


},{timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;