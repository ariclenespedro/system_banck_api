const router = require('express').Router();

const authController = require('../controllers/authController');
const clentController = require('../controllers/clientController');

router.route('/auth/register').post((req, res) => clentController.create(req, res));
router.route('/auth/login').post((req, res) => authController.login(req, res));

module.exports = router;