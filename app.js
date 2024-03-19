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

const Client = require("./models/Client");

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
    res.status(200).json({msg: 'Login efectuado com sucesso!', token});
    
  } catch (error) {
    console.log(error);
    res.status({msg:"Erro do servidor, tente novamente!"});
  }

});
