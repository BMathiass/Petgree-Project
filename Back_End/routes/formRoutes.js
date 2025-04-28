const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/submit-contato', formController.salvarContato);

module.exports = router;