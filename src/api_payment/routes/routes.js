const routerApiPayment = require('express').Router();

const entityRouter = require('./entitys');
/* const referenceRouter = require('./references');
const paymentRouter = require('./payment'); */

routerApiPayment.use("/", entityRouter);
/* router.use("/", referenceRouter);
router.use("/",paymentRouter); */


module.exports = routerApiPayment;