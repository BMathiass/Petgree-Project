const express = require('express');
const router = express.Router();
const { salvarContato } = require('./formHandler');

router.post('/submit-contato', salvarContato);

module.exports = router;
