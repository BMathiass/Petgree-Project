const formModel = require('../models/formModel');

exports.salvarContato = async (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: "Nome, e-mail e mensagem são obrigatórios." });
    }

    try {
        await formModel.salvarContato(nome, email, telefone, mensagem);
        res.status(200).json({ message: "Contato salvo com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao salvar o contato." });
    }
};