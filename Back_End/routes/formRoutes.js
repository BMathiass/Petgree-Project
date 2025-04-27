const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/salvarContato', formController.salvarContato);

module.exports = router;