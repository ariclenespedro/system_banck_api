const router = require('express').Router();

//Client routes
const clientRouter = require('./clients');
const accountRouter = require('./accounts');

router.use("/",clientRouter);
router.use("/",accountRouter);

module.exports = router;