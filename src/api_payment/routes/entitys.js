const router = require("express").Router();

const entityController = require('../controllers/entityController');

const auth = require("../../middleware/auth");

router.route('/entity/create').post(auth,(req,res) => entityController.create(req,res));
/* router.get('/entitys/:id', entityController.getEntitytById); */
/* router.put('/entitys/:id', entityController.updateEntity);
router.delete('/entitys/:id', entityController.deleteEntity); */

module.exports = router;