/* IMPORTS */
require("dotenv").config();
const express = require("express");
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 
 *  
 * ? This is my coment */

app.use(cors()); 

//config JSON response
app.use(express.json());


// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Conexão com o MongoDB
const db = require('./src/config/database');
db();

//Routers
const routes = require('./src/routes/router');
app.use('/api', routes);

// Routes for api payments: entitys, references and payments
const routesApipayment = require('./src/api_payment/routes/routes');
app.use('/apiPayments', routesApipayment);


// Definindo uma rota Pública.
app.get("/", (req, res) => {
  res.status(200).json({ mgs: "Bem-vindo à API System Bank" }); // * Endpoint PUBLIC
});