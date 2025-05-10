const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('../middlewares/rateLimit');
const logRequest = require('../middlewares/logRequest');

const app = express();

// Segurança
app.use(helmet());
app.use(cors());
app.use(rateLimit);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs de requisições
app.use(logRequest);

module.exports = app;