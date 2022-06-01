const express = require('express');
const buyerRoute = require('./buyer/index');

const router = express.Router();

router.use('/buyer', buyerRoute);
module.exports = router;
