const router = require("express").Router();

const paymentController = require("../controllers/paymentController");

const auth = require("../../middleware/auth");

router.route('/payment/paymentReference').post(auth, (req, res) => paymentController.validatePayment(req, res));

module.exports = router;
