const router = require('express').Router();

const entityRouter = require('./entitys');
const referenceRouter = require('./references');
const paymentRouter = require('./payment');

router.use("/", entityRouter);
router.use("/", referenceRouter);
router.use("/",paymentRouter);


module.exports = router;