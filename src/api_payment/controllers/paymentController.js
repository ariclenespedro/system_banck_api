const Payment = require('../models/Payment');
const ReferencePayment = require('../models/Reference');
const Entity = require('../models/Entity');

const paymentController = {
    validatePayment: async (req, res) => {
        try {
            //? Extrair os dados do corpo da requisição
            const { terminal_type, reference_code, entity_id, amount, transaction_id } = req.body;

            //? Verificar se a referência existe e corresponde à entidade correta
            const reference = await ReferencePayment.findOne({ reference_code : reference_code });
            if (!reference) {
                return res.status(404).send({ message: 'Referência inválida ou não encontrada.' });
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
            if (amount !== reference.amount) {
                return res.status(400).send({ message: 'Montante do pagamento inválido.' });
            }

            //? Verificar se existe o tipo do terminal usado para oo pagamento  'ATM', 'POS', 'IB' (Internet Banking) etc. É uma string e obrigatório.
            if (! terminal_type) {
                return res.status(404).send({ message: 'O campo do terminal usado para oo pagamento é obrigatório.' });
            }

            // Salvar o pagamento no banco de dados
            const newPayment = new Payment({
                reference_id: reference._id,
                transaction_id,
                terminal_type,
                terminal_transaction_id: req.body.terminal_transaction_id,
                terminal_location: req.body.terminal_location,
                terminal_id: req.body.terminal_id,
                amount,
                fee: 0,
                datetime: new Date()
            });

            await newPayment.save();

            res.status(201).send({ message: 'Pagamento validado e registrado com sucesso.', status: 201, data: newPayment });
        } catch (error) {
            res.status(500).send({ message: 'Erro ao validar o pagamento.', error });
        }
    },
    listPayments: async (req, res) => {

        try {
            // Consulta todos os pagamentos no banco de dados
            const payments = await Payment.find();

            // Retorna a lista de pagamentos
            res.status(200).json({ message: 'Lista de pagamentos obtida com sucesso.', data: payments });
        } catch (error) {
            // Se houver algum erro durante a consulta ao banco de dados
            res.status(500).json({ message: 'Erro ao obter a lista de pagamentos.', error });
        }
    },
};

module.exports = paymentController;