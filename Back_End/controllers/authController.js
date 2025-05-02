const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        const emailNormalizado = email.trim().toLowerCase();
        const user = await userModel.findUserByEmail(emailNormalizado);

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const token = jwt.sign({
            id: user.id,
            nome: user.nome,
            email: user.email
          }, process.env.JWT_SECRET, { expiresIn: '1h' });
          

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

exports.register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Erro de validação.", errors: errors.array() });
    }

    const { nome, cpf, email, senha, confirmaSenha, telefone, ofertas, politicas } = req.body;

    if (senha !== confirmaSenha) {
        return res.status(400).json({ message: "As senhas não conferem." });
    }

    if (!politicas) {
        return res.status(400).json({ message: "Você deve aceitar as políticas para continuar." });
    }

    try {
        const existingEmail = await userModel.findUserByEmail(email);
        const existingCpf = await userModel.findUserByCpf(cpf);

        if (existingEmail || existingCpf) {
            return res.status(400).json({
                message: "Email ou CPF já cadastrado. Faça login."
            });
        }


        const hashedPassword = await bcrypt.hash(senha, 10);
        const ofertasFinal = ofertas ? 'S' : 'N';

        const newUser = await userModel.createUser(nome, cpf, email, hashedPassword, telefone, ofertasFinal);

        res.status(200).json({
            message: "Usuário cadastrado com sucesso!",
            nome: newUser.nome
        });
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).json({ message: "Erro no cadastro." });
    }
};