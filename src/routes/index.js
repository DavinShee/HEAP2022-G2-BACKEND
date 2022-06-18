const express = require('express');
const buyerRoute = require('./buyer/index');
const accountRoute = require('./account/index');

const router = express.Router();

// basic structure: app.METHOD(PATH, HANDLER)
router.use('/buyer', buyerRoute);
router.use('/account', accountRoute);
module.exports = router;
