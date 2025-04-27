const db = require('../config/database');

exports.findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // pega o primeiro usuário encontrado
        });
    });
};

exports.createUser = (nome, email, senha) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
        `;
        db.query(query, [nome, email, senha], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};