const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

// Todas protegidas por role "admin"
router.get('/messages', authMiddleware(['admin']), adminController.getMessages);
router.delete('/message/:id', authMiddleware(['admin']), adminController.deleteMessage);
router.get('/users', authMiddleware(['admin']), adminController.getUsers);
router.put('/user/:id', authMiddleware(['admin']), adminController.updateUser);
router.post('/user', authMiddleware(['admin']), adminController.createUser);
router.delete('/user/:id', authMiddleware(['admin']), adminController.deleteUser);

module.exports = router;