const db = require('../config/database');

exports.salvarContato = (nome, email, telefone, mensagem) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO mensagens_clientes (nome, email, telefone, mensagem)
            VALUES ($1, $2, $3, $4)
            RETURNING id_mensagem
        `;
        db.query(query, [nome, email, telefone, mensagem], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.rows[0]);
        });
    });
};