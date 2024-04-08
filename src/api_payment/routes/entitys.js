const router = require("express").Router();

const entityController = require('../controllers/entityController');

router.post('/entity', entityController.create);
router.get('/entitys/:id', entityController.getEntitytById);
/* router.put('/entitys/:id', entityController.updateEntity);
router.delete('/entitys/:id', entityController.deleteEntity); */