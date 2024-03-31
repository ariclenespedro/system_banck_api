const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

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
  changePassword: async (req, res) =>{
    try {
      const { clientId, currentPassword, newPassword } = req.body;
  
      // Verificar se o cliente existe
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
  
      // Verificar se a senha atual fornecida está correta
      const isPasswordCorrect = await bcrypt.compare(currentPassword, client.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Senha atual incorreta.' });
      }

      if(!newPassword){
        return res.status(400).json({ message: 'O campo nova palavra-passe é obrigatório!' });
      }
  
      // Gerar hash para a nova senha
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  
      // Atualizar a senha do cliente no banco de dados
      await Client.findByIdAndUpdate(clientId, { password: hashedNewPassword });
  
      return res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      return res.status(500).json({ message: 'Erro ao alterar a senha.' });
    }
  }
};

module.exports = authController;
