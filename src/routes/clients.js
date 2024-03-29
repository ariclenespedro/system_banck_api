const router = require('express').Router();

const clentController = require('../controllers/clientController');

router.route('/auth/register').post((req, res) => clentController.create(req, res));

module.exports = router;