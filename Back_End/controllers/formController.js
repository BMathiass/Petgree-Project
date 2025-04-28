const formModel = require('../models/formModel');

exports.salvarContato = async (req, res) => {
    console.log('Body recebido:', req.body);
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ success: false, message: "Nome, e-mail e mensagem são obrigatórios." });
    }

    try {
        const resultado = await formModel.salvarContato(nome, email, telefone, mensagem);

        const requestId = resultado.id_solicitacao;

        res.status(200).json({
            success: true,
            requestId: requestId,
            message: "Contato salvo com sucesso!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao salvar o contato." });
    }
};