require('dotenv').config();
const express = require('express');
const moment = require('moment');
const route = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

app.use('/routes', route);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
