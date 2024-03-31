const router = require("express").Router();
const auth = require('../middleware/auth');

const authController = require("../controllers/authController");
const clentController = require("../controllers/clientController");

//registrar client router
router.route("/auth/register").post(auth, (req, res) => clentController.create(req, res));

//login do client router
router.route("/auth/login").post((req, res) => authController.login(req, res));

//Change password router
router.route("/auth/changePassword").post( auth ,(req, res) => authController.changePassword(req, res));

//get data client router
router.route("/cliente/:clientId").get(auth,(req, res) => clentController.getClient(req, res)
);

module.exports = router;
