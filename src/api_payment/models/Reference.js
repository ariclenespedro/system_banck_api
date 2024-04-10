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
    service : {
        type: String,
        required: true
    },
    entity: {
        type: Schema.Types.ObjectId,
        ref: 'Entity',
        required: true
    }
    
},{timestamps: true}
);

const Reference = mongoose.model('Reference', referenceShema);

module.exports = Reference;