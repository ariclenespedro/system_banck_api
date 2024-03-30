/* IMPORTS */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const app = express();
const PORT = process.env.PORT || 3000;

//config JSON response
app.use(express.json());

const Account = require("./src/models/Account");

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


/* Routes Private */

//Buscar dados do cliente
app.get("/cliente/:clientId", checkToken, async (req, res) => {
  const id = req.params.clientId;

  try {
    // Verificar se o cliente existe
    const client = await Client.findById(id, '-password');

    if (!client) {
      return res.status(404).json({ msg: "Utilizador não encontrado!" });
    }

    // Cliente encontrado, retornar os detalhes do cliente
    return res.status(200).json(client);
  } catch (error) {
    // Se ocorrer algum erro ao buscar o cliente
    console.error("Erro ao buscar o cliente:", error);
    return res.status(500).json({ msg: "Erro do servidor ao buscar o cliente!" });
  }
});

function checkToken(req,res,next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({msg:'Acesso negado'});
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({msg:'Token Inválido!'});
  }
  
}






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

