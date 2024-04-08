const Entity = require('../models/Entity');

const entity = {
    create : async (req, res) => {
        try {
            const {description,name, n_entity} = req.body;
    
            if (!name || !n_entity) {
                return res.status(404).send({message:'Os campos nome e código da entidade são obrigatórios.'});
            }
            const newEntity = new Entity({
                description,
                name,
                n_entity,
            });
            await newEntity.save();
            res.status(201).send({message:'Entidade criada com sucesso', data:newEntity });
        } catch (error) {
            res.status(400).send({message:error});
        }
    },
    getEntitytById : async (req, res) => {
        try {
            const entity = await Entity.findById(req.params.id);
            if (!entity) {
                return res.status(404).send({message: 'Entidade não encotrada!'});
            }
            res.send({message: 'Dados da entidade encontrados!', data: entity});
        } catch (error) {
            res.status(500).send({message:error});
        }
    }

};

module.exports = entity;


// Implemente os outros métodos do controlador (updateArtist, deleteArtist) de maneira semelhante
