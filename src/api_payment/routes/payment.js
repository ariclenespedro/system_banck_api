const router = require("express").Router();

const paymentController = require("../controllers/paymentController");

const auth = require("../../middleware/auth");

//? Efectua um pagamento por referencia
router.route('/payment/paymentReference').post(auth, (req, res) => paymentController.validatePayment(req, res));

//? Busca todos os pagamentos
router.route('/payments').get(auth, (req, res) => paymentController.listPayments(req, res));

module.exports = router;
