/* IMPORTS */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

//config JSON response
app.use(express.json());

const Client = require("./src/models/Client");
const Account = require("./src/models/Account");

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Conexão com o MongoDB
mongoose
  .connect("mongodb://localhost:27017/system_bank_db")
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
});

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

//Registrar Conta do Cliente
app.post('/cliente/account/register', checkToken,async (req, res) => {
  try {
    const { clientId, n_account, currency, type_account, description, balance, iban } = req.body;

    if (!clientId) {
      return res.status(422).json({ msg: "O Id do cliente é obrigatório!" });
    }

    if (!n_account) {
      return res.status(422).json({ msg: "O número da conta do cliente é obrigatório!" });
    }

    if (!iban) {
      return res.status(422).json({ msg: "A numéro de IBAN é obrigatório!" });
    }

    // Verifique se o cliente existe
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Verifique se o cliente já possui uma conta bancária
    const existingAccount = await Account.findOne({ clientId: client._id });
    if (existingAccount) {
      return res.status(400).json({ message: 'O cliente já possui uma conta bancária associada' });
    }

    //check n_account exist
  const n_accountExists = await Account.findOne({ n_account:n_account});
  if (n_accountExists) {
    return res.status(422).json({msg:"Este número de Conta já existe"})
  }
  //check Iban exists
  const n_ibanExists = await Account.findOne({ iban:iban});
  if (n_ibanExists) {
    return res.status(422).json({msg:"Este IBAN já está a ser utilizado."})
  }

    // Crie uma nova conta bancária
    const newAccount = new Account({
      client_id: clientId,
      type_account:"Conta à Ordem",
      n_account,
      currency:"KZS",
      description,
      balance,
      iban
    });

    // Salve a conta bancária no banco de dados
    await newAccount.save();

    res.status(201).json({ message: 'Conta bancária aberta com sucesso', account: newAccount });
  } catch (error) {
    console.error('Erro ao abrir conta bancária:', error);
    res.status(500).json({ message: 'Erro ao abrir conta bancária' });
  }
});


// Registar Cliente.

//Register user
app.post("/auth/register", async (req, res) => {
  const { fullName, email, phone, password, confirmPassword, age, n_acession } =
    req.body;

  // Validations
  if (!fullName) {
    return res.status(422).json({ msg: "O nome completo do cliente é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email do cliente é obrigatório!" });
  }
  if (!phone || !/^\d{9}$/.test(phone)) {
    return res.status(422).json({ msg: "O número de telefone do cliente é obrigatório e deve ter 9 dígitos!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A palavra-passe do cliente é obrigatório!" });
  }
  if (!age || age < 18) {
    return res.status(422).json({ msg: "A idade mínima do cliente deve ser 18 anos!" });
  }
  if (!n_acession || !/^\d{8}$/.test(n_acession)) {
    return res.status(422).json({ msg: "O número de adesão do cliente é obrigatório e deve ter 8 dígitos!" });
  }
  if (confirmPassword !== password) {
    return res.status(422).json({ msg: "As senhas são diferentes!" });
  }


  //Check email address Client
  const ClientExists = await Client.findOne({ email: email });
  if (ClientExists) {
    return res.status(422).json({ mgs: "Por favor, utilize outro email !" });
  }

  //check n_acession exist
  const n_acessionExist = await Client.findOne({ n_acession:n_acession});
  if (n_acessionExist) {
    return res.status(422).json({msg:"Este número de Adesão já existe"})
  }

  //create password 
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //create Client
  const client = new Client({
    fullName,
    email,
    password:passwordHash,
    phone,
    age,
    n_acession,
  })

  try {

    await client.save();
    res.status(201).json({msg: 'Cliente registrado com sucesso!'});
    
  } catch (error) {
    console.log(error);
    res.status({msg:"Erro do servidor, tente novamente!"});
  }
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

//Login User
app.post('/auth/login', async(req, res) => {
  const {email, password} = req.body;

  //validadion
  if (!email) {
    return res.status(422).json({ msg: "O email do cliente é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A palavra-passe do cliente é obrigatório!" });
  }

  //Check email address Client
  const client = await Client.findOne({ email: email });
  if (!client) {
    return res.status(404).json({ mgs: "Cliente não existe!" });
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, client.password);

  if (!checkPassword) {
    return res.status(422).json({ mgs: "Senha incorrecta!" });
  }

  try {

    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: client._id,
      },
      secret,
    )
    res.status(200).json({msg: 'Login efectuado com sucesso!', token, client});
    
  } catch (error) {
    console.log(error);
    res.status({msg:"Erro do servidor, tente novamente!"});
  }

});
