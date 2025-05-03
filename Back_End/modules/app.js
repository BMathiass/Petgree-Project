const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

module.exports = app;