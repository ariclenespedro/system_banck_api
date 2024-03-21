const mongoose = require('mongoose');

const Client = mongoose.model('Client',{
    fullName: String,
    email: String,
    age: Number,
    phone: String,
    n_acession: Number,
    password: String
});

module.exports = Client;
