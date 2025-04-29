const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register',
    [
        body('nome').notEmpty().withMessage('Nome é obrigatório'),
        body('cpf').notEmpty().withMessage('CPF é obrigatório'),
        body('email').isEmail().withMessage('E-mail inválido'),
        body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
        body('confirmaSenha').custom((value, { req }) => {
            if (value !== req.body.senha) {
                throw new Error('As senhas não conferem');
            }
            return true;
        }),
        body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
        body('politicas').equals('true').withMessage('Você deve aceitar as políticas para continuar.')
    ],
    authController.register
);

router.post('/login', authController.login);

module.exports = router;