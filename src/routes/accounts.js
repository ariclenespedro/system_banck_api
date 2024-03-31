const router = require("express").Router();

const accountController = require("../controllers/accountController");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.route("/cliente/account/register").post(auth,(req, res) => accountController.create(req, res));

router.route("/client/:clientId/account").get(auth,(req, res) => accountController.getDataAccount(req, res));

module.exports = router;