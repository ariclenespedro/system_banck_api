const router = require("express").Router();

// * Import Controller References
const referenceController = require('../controllers/referenceController');

// ! Import middleware for protected route
const auth = require("../../middleware/auth");

//* Route for generate reference 
router.route('/references/generateReference').post(auth, (req,res) => referenceController.generate(req,res));

module.exports = router;
