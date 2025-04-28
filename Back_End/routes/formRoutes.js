const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/submit-contato', formController.salvarContato);
router.post('/confirmar', formController.confirmar);

module.exports = router;