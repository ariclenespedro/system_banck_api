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

  //validation
  if (!fullName) {
    return res
      .status(422)
      .json({ mgs: "O nome completo do cliente é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ mgs: "O email do cliente é obrigatório!" });
  }

  if (!phone) {
    return res
      .status(422)
      .json({ mgs: "O número de telefone do cliente é obrigatório!" });
  }
  if (!password) {
    return res
      .status(422)
      .json({ mgs: "A palavra-passe do cliente é obrigatório!" });
  }
  if (!age) {
    return res.status(422).json({ mgs: "A idade do cliente é obrigatório!" });
  }
  if (!n_acession) {
    return res
      .status(422)
      .json({ mgs: "O número de adesão do cliente é obrigatório!" });
  }
  if (confirmPassword !== password) {
    return res.status(422).json({ mgs: "As senhas são diferentes!" });
  }

  //Check email address Client
  const ClientExists = await Client.findOne({ email: email });
  if (ClientExists) {
    return res.status(422).json({ mgs: "Por favor, utilize outro email !" });
  }

  //create password 
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //create Client
  const client = new Client({
    fullName,
    email,
    password,
    phone,
    age,
    n_acession,
  })
});
