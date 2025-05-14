const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        logger.warn(`Tentativa de login com campos vazios | IP: ${req.ip} | User-Agent: ${req.headers['user-agent']}`);
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        const emailNormalizado = email.trim().toLowerCase();
        const user = await userModel.findUserByEmail(emailNormalizado);

        if (!user) {
            logger.warn(`Login falhou - usuário não encontrado: ${emailNormalizado} | IP: ${req.ip} | User-Agent: ${req.headers['user-agent']}`);
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            logger.warn(`Login falhou - senha incorreta para: ${emailNormalizado} | IP: ${req.ip} | User-Agent: ${req.headers['user-agent']}`);
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const token = jwt.sign({
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info(`Login bem-sucedido para ${emailNormalizado} | IP: ${req.ip} | User-Agent: ${req.headers['user-agent']}`);

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        logger.error(`Erro no login para ${email} | IP: ${req.ip} | Erro: ${error.message}`);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

exports.register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.warn('Erro de validação no cadastro', { errors: errors.array() });
        return res.status(400).json({ message: "Erro de validação.", errors: errors.array() });
    }

    const { nome, cpf, email, senha, confirmaSenha, telefone, ofertas, politicas } = req.body;
    const emailNormalizado = email.trim().toLowerCase();

    if (senha !== confirmaSenha) {
        logger.warn(`Senhas não conferem para o email: ${emailNormalizado}`);
        return res.status(400).json({ message: "As senhas não conferem." });
    }

    if (!politicas) {
        logger.warn(`Tentativa de cadastro sem aceitar políticas - email: ${emailNormalizado}`);
        return res.status(400).json({ message: "Você deve aceitar as políticas para continuar." });
    }

    try {
        const existingEmail = await userModel.findUserByEmail(emailNormalizado);
        const existingCpf = await userModel.findUserByCpf(cpf);

        if (existingEmail || existingCpf) {
            logger.warn(`Tentativa de cadastro com dados já existentes: ${emailNormalizado}, ${cpf}`);
            return res.status(400).json({
                message: "Email ou CPF já cadastrado. Faça login."
            });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        const ofertasFinal = ofertas ? 'S' : 'N';

        const newUser = await userModel.createUser(nome, cpf, emailNormalizado, hashedPassword, telefone, ofertasFinal);

        logger.info(`Novo usuário cadastrado com sucesso: ${emailNormalizado}`);

        res.status(200).json({
            message: "Usuário cadastrado com sucesso!",
            nome: newUser.nome
        });
    } catch (error) {
        logger.error(`Erro ao cadastrar usuário ${emailNormalizado}: ${error.message}`);
        res.status(500).json({ message: "Erro no cadastro." });
    }
};