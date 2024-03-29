const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    n_account: Number,
    type_account: String,
    currency: String,
    description: {type: String, required: false},
    balance: String, // Armazenar como string para manter a precisão
    iban: String,
    client_id: mongoose.Schema.Types.ObjectId, // Associar a um cliente pelo ID
},{timestamps: true});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
