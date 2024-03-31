const router = require("express").Router();

const authController = require("../controllers/authController");
const clentController = require("../controllers/clientController");

//registrar client router
router
  .route("/auth/register")
  .post((req, res, next) => authController.checkToken(req, res, next),  
  (req, res) => clentController.create(req, res));

//login do client router
router.route("/auth/login").post((req, res) => authController.login(req, res));

//get data client router
router.route("/cliente/:clientId").get(
  (req, res, next) => authController.checkToken(req, res, next),
  (req, res) => clentController.getClient(req, res)
);

module.exports = router;
