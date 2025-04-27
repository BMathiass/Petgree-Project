const db = require('../config/database');

exports.salvarContato = (nome, email, telefone, mensagem) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO contatos_clientes (nome, email, telefone, mensagem)
            VALUES (?, ?, ?, ?)
        `;
        db.query(query, [nome, email, telefone, mensagem], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};