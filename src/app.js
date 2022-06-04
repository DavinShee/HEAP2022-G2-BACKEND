require('dotenv').config();
const express = require('express');
const moment = require('moment');
const route = require('./routes/index');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use('/routes', route);
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/HEAP', {
    useNewUrlParser: true
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
