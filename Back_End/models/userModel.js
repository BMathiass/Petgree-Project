const db = require('../config/database');

// Busca usuário pelo e-mail
exports.findUserByEmail = (email) => {
    email = email.trim().toLowerCase(); 
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Erro ao buscar usuário por email:', err);
                return reject(err);
            }
            resolve(results.rows[0]);
        });
    });
};

// Busca usuário pelo CPF
exports.findUserByCpf = (cpf) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE cpf = $1';
        db.query(query, [cpf], (err, results) => {
            if (err) {
                console.error('Erro ao buscar usuário por CPF:', err);
                return reject(err);
            }
            resolve(results.rows[0]);
        });
    });
};

// Cria novo usuário
exports.createUser = (nome, cpf, email, senha, telefone, ofertas) => {
    return new Promise(async (resolve, reject) => {
        email = email.trim().toLowerCase(); 
        try {
            // Verificar se o e-mail ou CPF já estão cadastrados
            const existingUserByEmail = await this.findUserByEmail(email);
            if (existingUserByEmail) {
                return reject('Este e-mail já está cadastrado.');
            }

            const existingUserByCpf = await this.findUserByCpf(cpf);
            if (existingUserByCpf) {
                return reject('Este CPF já está cadastrado.');
            }

            // Criação do novo usuário com role fixo como 'user'
            const query = `
                INSERT INTO usuarios (nome, cpf, email, senha, telefone, ofertas, role)
                VALUES ($1, $2, $3, $4, $5, $6, 'user')
                RETURNING nome
            `;
            db.query(query, [nome, cpf, email, senha, telefone, ofertas], (err, results) => {
                if (err) {
                    console.error('Erro ao criar usuário:', err);
                    return reject(err);
                }
                resolve(results.rows[0]);
            });
        } catch (err) {
            console.error('Erro ao verificar dados de cadastro:', err);
            reject(err);
        }
    });
};