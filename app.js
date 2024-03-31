/* IMPORTS */
require("dotenv").config();
const express = require("express");


const app = express();
const PORT = process.env.PORT || 3000;

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


// Definindo uma rota Pública.
app.get("/", (req, res) => {
  res.status(200).json({ mgs: "Bem-vindo à API System Bank" });
});







//Payment references route
app.post('/cliente/payments/references', async (req, res) => {
  try {
    const {n_reference,amount,clientID,entity_id} = req.body;

    // Verificar se os dados necessários foram fornecidos
    if (!clientID || !amount) {
      return res.status(400).json({ message: 'É necessário fornecer o ID do cliente e o valor da transação' });
    }
    if (!n_reference) {
      return res.status(422).json({ msg: "O número de referência é obrigatório!" });
    }
    if (!entity_id) {
      return res.status(422).json({ msg: "O ID da Entidade é obrigatório!" });
    }

    if(entity_id === 1140223){
      return res.status(422).json({ msg: "O ID da Entidade desconhecida!" });
    }
  } catch (error) {
    
  }
})

