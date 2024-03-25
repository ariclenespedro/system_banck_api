const mongoose = require('mongoose');

const Transition = new mongoose.Schema({
    n_reference: {
        type:Number, 
        required: true, 
        unique: true
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
        type: Number,
        required: true,
        unique: true,
    }

});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;