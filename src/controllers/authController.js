const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      //validadion
      if (!email) {
        return res
          .status(422)
          .json({ msg: "O email do cliente é obrigatório!" });
      }
      if (!password) {
        return res
          .status(422)
          .json({ msg: "A palavra-passe do cliente é obrigatório!" });
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

      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          id: client._id,
        },
        secret
      );
      res
        .status(200)
        .json({ msg: "Login efectuado com sucesso!", token, client });
    } catch (error) {
      console.log(error);
      res.status({ msg: "Erro do servidor, tente novamente!" });
    }
  },

  checkToken: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
      }

      const secret = process.env.SECRET;
      jwt.verify(token, secret);
      next();
    } catch (error) {
      res.status(400).json({ msg: "Token Inválido!" });
    }
  },
};

module.exports = authController;
