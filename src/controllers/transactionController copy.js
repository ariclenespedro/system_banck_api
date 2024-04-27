const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Client = require("../models/Client");
const { default: axios } = require("axios");

require("dotenv").config();

const transactionController = {
  paymentForReferences: async (req, res, next) => {
    let account;
    let newTransaction;

    try {
      const client_id = req.params.client_id;
      const { token, n_reference, amount, entity_id, description } = req.body;

      const client = await Client.findById(client_id);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      if (client.balance < amount) {
        return res
          .status(400)
          .json({ message: "Saldo insuficiente para realizar a transação." });
      }

      if (!n_reference || !entity_id || !description) {
        return res.status(400).send({ message: "Parâmetros inválidos." });
      }

      // Iniciar a transação
      const session = await Transaction.startSession();
      session.startTransaction();

      try {
        account = await Account.findOne({ client_id: client_id });
        const newBalance = parseFloat(account.balance) - amount;
        if (newBalance < 0) {
          return res
            .status(402)
            .send({ message: "Saldo insuficiente para realizar a transação." });
        }
        const balanceAfter = await account.updateOne({ balance: newBalance });
        console.log(newBalance);

        // Criar uma nova transação
        newTransaction = new Transaction({
          n_reference,
          amount,
          client: client.id,
          status: "completed",
          entity_id,
          description: description,
          balance_after: newBalance,
        });

        // Salvar a transação no banco de dados
        await newTransaction.save();

        const BaseUrl = process.env.BASEURL;
        const config = {
          baseURL: BaseUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Fazer a chamada Axios
        axios
          .post(
            `${BaseUrl}/apiPayments/payment/paymentReference`,
            {
              reference_code: n_reference,
              entity_id: entity_id,
              amount: amount,
              terminal_type: "Internet Banking",
              transaction_id: newTransaction._id,
            },
            config
          )
          .then(async (response) => {
            if (response.status === 201) {
              // Commit da transação se não houver erro na chamada Axios
              await session.commitTransaction();
              session.endSession();
              return res
                .status(201)
                .json({ message: response.message, data: response.data });
            } else {
              return res
                .status(response.status)
                .json({ message: response.message, error: response.error });
            }
          });
      } catch (error) {
        // Rollback da transação em caso de erro
        await session.abortTransaction();
        session.endSession();

        // Reverter o saldo da conta se a transação de atualização tiver ocorrido
        if (account) {
          await Account.updateOne({
            balance: parseFloat(account.balance) + amount,
          });
        }

        return res
          .status(500)
          .json({ message: "Erro ao registrar a transação.", error });
      }
    } catch (error) {
      console.error("Erro ao iniciar a transação:", error);
      return res
        .status(500)
        .json({ message: "Erro ao iniciar a transação.", error });
    }
  },

  //? Lista todas as transações de um determinado cliente
  listTransictions: async (req, res) => {
    try {
      const client_id = req.params.client_id;

      
  
      // Consulta todas as transações para o cliente com o ID fornecido
      const transactions = await Transaction.find( { client  : client_id } );
  
      return res.status(200).json({
        message: "Lista de Movimentos bancários retornada!",
        data: transactions,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar os movimentos do cliente", error });
    }
  },

  //? Pega uma determinada transação!
  getTransition: async (req, res) =>{
    try {

      const transition = await Transaction.findById(req.params.transiction_id);
      if(!transition){
        return res.status(404).send({message:'Movimento bancário não encontrado!'});
      }

      return res.status(200).json({message:"Transação retornada com sucesso", data:transition })
    } catch (error) {
      return res.status(500).json({message: "Erro ao buscar movimento especificado", error: error});
    }
  },

};

module.exports = transactionController;
