const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


db.connect(err => {
    if (err) {
        console.error("Erro ao conectar no MySQL:", err);
        return;
    }
    console.log("Conectado ao MySQL com sucesso.");
});

function salvarContato(req, res) {
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: "Nome, e-mail e mensagem são obrigatórios." });
    }

    const query = `
        INSERT INTO contatos_clientes (nome, email, telefone, mensagem)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [nome, email, telefone, mensagem], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao salvar o contato." });
        }

        res.status(200).json({ message: "Contato salvo com sucesso!" });
    });
}

module.exports = { salvarContato };
