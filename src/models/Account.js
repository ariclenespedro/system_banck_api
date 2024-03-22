const mongoose = require('mongoose');

const Account = mongoose.model('Account',{
    n_account : Number,
    type_account : String,
    currency: String,
    descryption : String,
    balance: Number(15,2),
    iban : String,
    cliente_id: Object

});