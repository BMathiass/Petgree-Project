const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta." });
        }

        res.status(200).json({ message: "Login bem-sucedido!", user: { id: user.id, nome: user.nome, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no login." });
    }
};

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    try {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10); // 10 rounds
        await userModel.createUser(nome, email, hashedPassword);

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no cadastro." });
    }
};