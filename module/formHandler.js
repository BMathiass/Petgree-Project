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

function salvarEmail(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "E-mail é obrigatório." });

    const query = "INSERT INTO form_table (email) VALUES (?)";
    db.query(query, [email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao salvar e-mail." });
        }
        res.status(200).json({ message: "E-mail salvo com sucesso!" });
    });
}

module.exports = { salvarEmail };
