const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const corsOptions = {
    origin: 'https://petgree.onrender.com',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
};

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


module.exports = app;