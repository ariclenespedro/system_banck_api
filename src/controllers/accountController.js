const Account = require("../models/Account");
const Client = require("../models/Client");

const account = {
  create: async (req, res) => {
    try {
      const {
        clientId,
        n_account,
        currency,
        type_account,
        description,
        balance,
        iban,
      } = req.body;

      if (!clientId) {
        return res.status(422).json({ msg: "O Id do cliente é obrigatório!" });
      }

      if (!n_account) {
        return res
          .status(422)
          .json({ msg: "O número da conta do cliente é obrigatório!" });
      }

      if (!iban) {
        return res.status(422).json({ msg: "A numéro de IBAN é obrigatório!" });
      }

      // Verifique se o cliente existe
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      // Verifique se o cliente já possui uma conta bancária
      const existingAccount = await Account.findOne({ clientId: client._id });
      if (existingAccount) {
        return res
          .status(400)
          .json({
            message: "O cliente já possui uma conta bancária associada",
          });
      }

      //check n_account exist
      const n_accountExists = await Account.findOne({ n_account: n_account });
      if (n_accountExists) {
        return res.status(422).json({ msg: "Este número de Conta já existe" });
      }
      //check Iban exists
      const n_ibanExists = await Account.findOne({ iban: iban });
      if (n_ibanExists) {
        return res
          .status(422)
          .json({ msg: "Este IBAN já está a ser utilizado." });
      }

      // Crie uma nova conta bancária
      const newAccount = new Account({
        client_id: clientId,
        type_account: "Conta à Ordem",
        n_account,
        currency: "KZS",
        description,
        balance,
        iban,
      });

      // Salve a conta bancária no banco de dados
      await newAccount.save();

      res
        .status(201)
        .json({
          message: "Conta bancária aberta com sucesso",
          account: newAccount,
        });
    } catch (error) {
      console.error("Erro ao abrir conta bancária:", error);
      res.status(500).json({ message: "Erro ao abrir conta bancária" });
    }
  },
};

module.exports = account;
