const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const entityShema = new Shema({
    name: {
        type: String,
        required: true,
    },
    n_entity: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    }
    
});

const Entity = mongoose.model('Entity',entityShema);

module.exports = Entity;