const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Client = require("../models/Client");
const { default: axios } = require("axios");

/* 
? API IMPORTS
  */
const Payment = require('../api_payment/models/Payment');
const ReferencePayment = require('../api_payment/models/Reference');
const Entity = require('../api_payment/models/Entity');

require("dotenv").config();

const transactionController = {
  paymentForReferences: async (req, res, next) => {
    let account;
    let newTransaction;
    let amountControl = 0;
    let newBalance; 
    let session

    try {
      
      const client_id = req.params.client_id;
      const { token, n_reference, amount, entity_id, description } = req.body;

      //!validations
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
      
      //? Verificar se a referência existe e corresponde à entidade correta
      const reference = await ReferencePayment.findOne({ reference_code : n_reference });
      if (!reference) {
          return res.status(404).send({ message: 'Referência inválida ou não encontrada.' });
      }

      //? verificar se a referencia já foi usada
      const referenceUsed = await Transaction.findOne({n_reference: n_reference});
      if (referenceUsed) {
        return res.status(404).send({ message: 'Referência já utilizada' });
      }

      // ? Buscar os dados da Entidade e verificar se corresponde à referência.
      const entity = await Entity.findById(reference.entity._id);
      if(entity.n_entity !== entity_id) {
          return res.status(404).send({ message: 'Número de entidade não corresponde à referência!' });
      } 

      //? Verificar existencia do valor do campo amount
      if(!amount){
        return res.status(404).send({ message: 'O montante é um campo obrigatório!' });
      }

      //? Verificar se o montante do pagamento corresponde ao montante da referência
      if (amount < reference.amount) {
        return res.status(400).send({ message: 'Montante do pagamento inválido.' });
      }

      //* Iniciar a transação
      session = await Transaction.startSession();
      session.startTransaction();

      
      account = await Account.findOne({ client_id: client_id });
      newBalance = parseFloat(account.balance) - amount;
      amountControl = amount;

      //? Verificar se o saldo é sufuciente
      if (newBalance < 0) {
        return res
          .status(402)
          .send({ message: "Saldo insuficiente para realizar a transação." });
      }

      await account.updateOne({ balance: newBalance });

      //? Criar uma nova transação
      newTransaction = new Transaction({
        n_reference,
        amount,
        client: client.id,
        status: "completed",
        entity_id,
        description: description,
        balance_after: newBalance,
      });

      //* Salvar a transação no banco de dados
      await newTransaction.save();

      //* Commit da transação se não houver erro na chamada Axios
      await session.commitTransaction();

      //? ---------API------------- Salvar o pagamento no banco de dados
      const newPayment = new Payment({
        reference_id: n_reference,
        transaction_id: newTransaction._id,
        terminal_type: "Internet Banking",
        terminal_transaction_id: null,
        terminal_location: null,
        terminal_id: null,
        amount:amount,
        entity_id:entity_id,
        fee: 0,
        datetime: new Date()
    });

    await newPayment.save();

    // Commit da transação se não houver erro na chamada Axios
    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ message: 'Pagamento validado e registrado com sucesso.', data: newTransaction });
        
    } catch (error) {

      //? Reverter o saldo da conta se a transação de atualização tiver ocorrido
      if (account && newBalance < account.balance)  {
        await Account.updateOne({
          balance: parseFloat(account.balance) + amountControl,
        });
      }
      // Rollback da transação em caso de erro
      await session.abortTransaction();
      session.endSession();
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
