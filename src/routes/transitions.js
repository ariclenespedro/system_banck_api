const router = require('express').Router();
const auth = require('../middleware/auth');

const transictionController = require('../controllers/transactionController');

//register transiction
router.route("/:client_id/payments/references").post(auth, (req, res) => transictionController.paymentForReferences(req, res));

//? Get all transictions 
router.route("/:client_id/transictions").get(auth, (req, res) => transictionController.listTransictions(req, res));

module.exports = router;