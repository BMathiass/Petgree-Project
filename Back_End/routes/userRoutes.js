const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/perfil', authMiddleware, (req, res) => {
  res.json({
    message: 'Acesso autorizado.',
    user: req.user
  });
});

// Nova rota para verificação de token
router.get('/check-token', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

module.exports = router;
