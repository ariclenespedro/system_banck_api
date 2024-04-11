const routerApiPayment = require('express').Router();

const entityRouter = require('./entitys');
const referenceRouter = require('./references');
const paymentRouter = require('./payment');

routerApiPayment.use("/", entityRouter);
routerApiPayment.use("/",referenceRouter);
/* router.use("/", referenceRouter); */
routerApiPayment.use("/",paymentRouter);


module.exports = routerApiPayment;