const mongoose = require('mongoose');

const clientShema = mongoose.Schema({
    fullName: String,
    email: String,
    age: Number,
    phone: String,
    n_acession: Number,
    password: String
},{timestamps: true});

const Client = mongoose.model('Client', clientShema);

module.exports = Client;
