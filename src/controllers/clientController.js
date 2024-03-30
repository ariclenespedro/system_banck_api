const Client = require("../models/Client");

const bcrypt = require("bcrypt");

const clientController = {
  create: async (req, res, next) => {
    try {
      const {
        fullName,
        email,
        phone,
        password,
        confirmPassword,
        age,
        n_acession,
      } = req.body;

      // Validations
      if (!fullName) {
        return res
          .status(422)
          .json({ msg: "O nome completo do cliente é obrigatório!" });
      }
      if (!email) {
        return res
          .status(422)
          .json({ msg: "O email do cliente é obrigatório!" });
      }
      if (!phone || !/^\d{9}$/.test(phone)) {
        return res
          .status(422)
          .json({
            msg: "O número de telefone do cliente é obrigatório e deve ter 9 dígitos!",
          });
      }
      if (!password) {
        return res
          .status(422)
          .json({ msg: "A palavra-passe do cliente é obrigatório!" });
      }
      if (!age || age < 18) {
        return res
          .status(422)
          .json({ msg: "A idade mínima do cliente deve ser 18 anos!" });
      }
      if (!n_acession || !/^\d{8}$/.test(n_acession)) {
        return res
          .status(422)
          .json({
            msg: "O número de adesão do cliente é obrigatório e deve ter 8 dígitos!",
          });
      }
      if (confirmPassword !== password) {
        return res.status(422).json({ msg: "As senhas são diferentes!" });
      }

      //Check email address Client
      const ClientExists = await Client.findOne({ email: email });
      if (ClientExists) {
        return res
          .status(422)
          .json({ mgs: "Por favor, utilize outro email !" });
      }

      //check n_acession exist
      const n_acessionExist = await Client.findOne({ n_acession: n_acession });
      if (n_acessionExist) {
        return res.status(422).json({ msg: "Este número de Adesão já existe" });
      }

      //create password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      //create Client
      const client = new Client({
        fullName,
        email,
        password: passwordHash,
        phone,
        age,
        n_acession,
      });

      await client.save();
      res.status(201).json({client, msg: "Cliente registrado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status({ msg: "Erro do servidor, tente novamente!" });
    }
  },
  getClient: async (req, res, next) =>{

    try {
      const id = req.params.clientId;
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

  },
};

module.exports = clientController;
