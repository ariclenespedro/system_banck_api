const Payment = require('../models/Payment');
const ReferencePayment = require('../models/Reference');

const paymentController = {
    validatePayment: async (req, res) => {
        try {
            //? Extrair os dados do corpo da requisição
            const { terminal_type, reference_code, entity_id, amount, transaction_id } = req.body;

            //? Verificar se a referência existe e corresponde à entidade correta
            const reference = await ReferencePayment.findOne({ reference_code, entity: entity_id });
            if (!reference) {
                return res.status(404).send({ message: 'Referência inválida ou não encontrada.' });
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
                fee: req.body.fee,
                datetime: req.body.datetime
            });

            await newPayment.save();

            res.status(200).send({ message: 'Pagamento validado com sucesso.', data: newPayment });
        } catch (error) {
            res.status(500).send({ message: 'Erro ao validar o pagamento.', error });
        }
    }
};

module.exports = paymentController;