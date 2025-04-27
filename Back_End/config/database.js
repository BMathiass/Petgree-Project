const { Client } = require('pg');

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao PostgreSQL:", err);
        return;
    }
    console.log("Conectado ao PostgreSQL com sucesso.");
});

module.exports = db;