const Transaction = require('../models/Transaction');
const Client = require('../models/Client');
const { default: axios } = require('axios');

const router = require('express').Router();
require("dotenv").config();

const transactionController = {
    paymentForReferences: async (req,res, next) => {
        try {
          const client_id = req.params.client_id;
            const { token, n_reference, amount, entity_id, description } = req.body;

            // Verifique se o cliente existe
            const client = await Client.findById(client_id);
            if (!client) {
              return res.status(404).json({ message: "Cliente não encontrado" });
            }
            if (client.balance < amount) {
            return res.status(400).json({ message: 'Saldo insuficiente para realizar a transação.' });
            }

            if(!n_reference){
                return res.status(400).send({message:"O número de referência é obrigatório."});
            }

            if(!entity_id){
                return res.status(400).send({message:"O código da Entidade é obrigatório."});
            }

            if(!description){
              return res.status(400).send({message:"A descrição da transação é obrigatória."});
          }

        
            // Criar uma nova transação
            const newTransaction = new Transaction({
              n_reference,
              amount,
              client: client.id, // Associar a transação ao cliente autenticado
              status: 'completed',
              entity_id,
              description: description,
            });
        
            // Salvar a transação no banco de dados
            await newTransaction.save();

            const BaseUrl = process.env.BASEURL;

          const config = {
            baseURL: baseURL,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };

          const resApiPaymentReference = await axios.post(`${BaseUrl}/apiPayments/payment/paymentReference`,
          {
            reference_code: n_reference,
            entity_id: entity_id,
            amount:amount,
            terminal_type: 'Internet Banking',
            transaction_id: newTransaction._id 
          },
           config
           );
        
            return res.status(201).json({ message: 'Transação registrada com sucesso.' });
          } catch (error) {
            console.error('Erro ao registrar a transação:', error);
            return res.status(500).json({ message: 'Erro ao registrar a transação.' });
          }
    }
};

module.exports = transactionController;

