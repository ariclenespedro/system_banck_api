const router = require("express").Router();

const accountController = require("../controllers/accountController");
const authController = require("../controllers/authController");

router.route("/cliente/account/register").post(
  (req, res, next) => authController.checkToken(req, res, next),
  (req, res) => accountController.create(req, res)
);

router.route("/client/:clientId/account").get(
  (req, res, next) => authController.checkToken(req, res, next),
  (req, res) => accountController.getDataAccount(req, res)
);

module.exports = router;