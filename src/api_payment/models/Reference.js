const mongoose = require('mongoose');

const referenceShema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    end_datetime: {
        type: Date,
        required: true
    },
    reference_code: {
        type: String,
        required: true,
        unique: true
    },
    
});

const Reference = mongoose.model('Reference', referenceShema);

module.exports = Reference;