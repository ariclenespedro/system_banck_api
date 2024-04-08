const router = require("express").Router();

const entityController = require('../controllers/entityController');

const auth = require("../../middleware/auth");

router.route('/entity/create').post(auth,(req,res) => entityController.create(req,res));
router.route('/entitys/:id').get(auth, (req,res) => entityController.getEntitytById(req,res));
/* router.put('/entitys/:id', entityController.updateEntity);
router.delete('/entitys/:id', entityController.deleteEntity); */

module.exports = router;