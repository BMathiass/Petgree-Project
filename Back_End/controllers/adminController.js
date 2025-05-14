const db = require('../config/database');

const bcrypt = require('bcrypt');

const getMessages = async (req, res) => {
  const result = await db.query('SELECT * FROM contatos_clientes ORDER BY id_solicitacao DESC');
  res.json(result.rows);
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM contatos_clientes WHERE id_solicitacao = $1', [id]);
  res.status(200).json({ message: 'Mensagem apagada.' });
};

const getUsers = async (req, res) => {
  const result = await db.query('SELECT id_usuario, nome, email, role FROM usuarios');
  res.json(result.rows);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, role } = req.body;
  await db.query('UPDATE usuarios SET nome = $1, email = $2, role = $3 WHERE id_usuario = $4', [nome, email, role, id]);
  res.json({ message: 'Usuário atualizado.' });
};

const createUser = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);
  await db.query(
    'INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4)',
    [nome, email.toLowerCase(), senhaHash, role]
  );
  res.status(201).json({ message: 'Usuário criado.' });
};

module.exports = {
  getMessages,
  deleteMessage,
  getUsers,
  updateUser,
  createUser
};