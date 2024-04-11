const ReferencePayment = require('../models/Reference');
const Entity = require('../models/Entity');
const helper = require('../../helpers/generateReference');

const referencePayment = {
    generate: async (req, res) =>{
        try {

            const { amount, n_entity, service } = req.body;
            //? Gerar código aleatório de 15 dígitos
            let referenceCode = helper.generateRandomReferenceCode();
            console.log(referenceCode);
    
            // Verificar se o código gerado já existe na base de dados
            let existingReference = await ReferencePayment.findOne({ reference_code: referenceCode });
            while (existingReference) {
                referenceCode = helper.generateRandomReferenceCode();
                existingReference = await ReferencePayment.findOne({ newReferenceCode: referenceCode });
            }
            
            // ? Verificar se a entidade que solicita a referência existe
            const existsEntity = await Entity.findOne({ n_entity: n_entity});
            if (!existsEntity) {
                return res.status(404).send({ message: 'Entidade inválida!' }); 

            }
            // ? Verificar se o montante foi enviado.
            if(!amount){
                res.status(404).send({ message: 'O campo montante é obrigatório.'});
            }

            // Aqui você deve implementar a lógica para verificar se a entidade existe no banco de dados
    
            // Criar uma nova referência
            const newReference = new ReferencePayment({
                reference_code: referenceCode,
                entity: existsEntity._id,
                service,
                amount,
            });
    
            // * Salvar a nova referência no banco de dados
            await newReference.save();
    
            res.status(201).send({message:"Referência gerada com sucesso", data : newReference});
        } catch (error) {
            res.status(500).send({ message: 'Erro ao gerar a referência.', data: error });
        }
    }, 
}

module.exports = referencePayment