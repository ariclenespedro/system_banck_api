const router = require('express').Router();

//Client routes
const clientRouter = require('./clients');
const accountRouter = require('./accounts');
const transitionRouter = require('./transitions');

router.use("/",clientRouter);
router.use("/",accountRouter);
router.use("/",transitionRouter);

module.exports = router;