require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const route = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/routes', route);
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/HEAP', {
    useNewUrlParser: true
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
