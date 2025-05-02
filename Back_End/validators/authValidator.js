const { body } = require('express-validator');

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório.')
    .isEmail().withMessage('Formato de email inválido.'),
  
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.')
];
