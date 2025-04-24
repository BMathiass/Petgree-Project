const express = require('express');
const router = express.Router();
const { salvarEmail } = require('./formHandler');

router.post('/submit-email', salvarEmail);

module.exports = router;
