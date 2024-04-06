const Transaction = require('../models/Transaction');
const Client = require('../models/Client');

const transactionController = {
    paymentForReferences: async (req,res) => {
        try {
          const client_id = req.params.client_id;
            const { n_reference, amount, entity_id, description } = req.body;

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

            if(entity_id === 1140223){
                return res.status(422).json({ msg: "O código da Entidade é desconhecida!" });
              }

            // Verificar se o número de referência já existe
            const existingTransaction = await Transaction.findOne({ n_reference });
            if (existingTransaction) {
              return res.status(400).json({ message: 'Número de referência já existe.' });
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
        
            return res.status(201).json({ message: 'Transação registrada com sucesso.' });
          } catch (error) {
            console.error('Erro ao registrar a transação:', error);
            return res.status(500).json({ message: 'Erro ao registrar a transação.' });
          }
    }
};

module.exports = transactionController;

