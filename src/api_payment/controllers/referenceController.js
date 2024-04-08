const Reference = require('../models/Reference');

const reference = {
    generate: async (req, res) =>{
        try {
            // Gerar código aleatório de 15 dígitos
            const referenceCode = generateRandomReferenceCode();
    
            // Verificar se o código gerado já existe na base de dados
            const existingReference = await ReferencePayment.findOne({ reference_code: referenceCode });
            while (existingReference) {
                const newReferenceCode = generateRandomReferenceCode();
                const existingReference = await ReferencePayment.findOne({ newReferenceCode: referenceCode });   
            }
            /* if (existingReference) {
                // Se o código já existe, gerar um novo
                return res.status(409).send({ error: 'Código de referência já existe. Tente novamente.' });
            } */
    
            // Verificar se a entidade que solicita a referência existe
            // Aqui você deve implementar a lógica para verificar se a entidade existe no banco de dados
    
            // Criar uma nova referência
            const newReference = new ReferencePayment({
                reference_code: referenceCode,
                entity_id: req.body.entity_id,
                service: req.body.service,
                amount: req.body.amount
            });
    
            // Salvar a nova referência no banco de dados
            await newReference.save();
    
            res.status(201).send(newReference);
        } catch (error) {
            res.status(500).send({ error: 'Erro ao gerar a referência.' });
        }
    }, 
}