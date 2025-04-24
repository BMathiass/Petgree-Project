require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
})); // permite requisições do seu front

const db = mysql.createConnection({
    host: 'centerbeam.proxy.rlwy.net',
    user: 'root',
    password: 'SLdQuSpjozNLGiXRabInUEHqBNjnOCap',
    database: 'railway',
    port: 37902
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar no MySQL:", err);
        return;
    }
    console.log("Conectado ao MySQL com sucesso.");
});

app.post("/submit-email", (req, res) => {
    console.log("Recebi um POST em /submit-email");
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "E-mail é obrigatório." });

    const query = "INSERT INTO form_table (email) VALUES (?)";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao salvar e-mail." });
        }
        res.json({ message: "E-mail salvo com sucesso!" });
    });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
