const router = require('express').Router();

//Client routes
const servicesRouter = require('./clients');

router.use("/",servicesRouter);

module.exports = router;