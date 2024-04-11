const mongoose = require('mongoose');

const referenceShema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    end_datetime: {
        type: Date,
        required: false,
        default: () => {
            // * Define a data e hora atual
            const now = new Date();
            // Adiciona 24 horas (24 * 60 * 60 * 1000 milissegundos)
            const nextDay = new Date(now.getTime() + (24 * 60 * 60 * 1000));
            return nextDay;
        }
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entity',
        required: true
    }
    
},{timestamps: true}
);

const Reference = mongoose.model('Reference', referenceShema);


module.exports = Reference;