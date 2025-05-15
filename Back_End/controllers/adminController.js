const db = require('../config/database');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const getMessages = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    const query = `
      SELECT * FROM contatos_clientes
      WHERE nome ILIKE $1 OR email ILIKE $1 OR mensagem ILIKE $1
      ORDER BY data_insercao DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [`%${search}%`, limit, offset];
    const result = await db.query(query, values);

    // Count total
    const countResult = await db.query(`
      SELECT COUNT(*) FROM contatos_clientes
      WHERE nome ILIKE $1 OR email ILIKE $1 OR mensagem ILIKE $1
    `, [`%${search}%`]);

    res.json({
      total: parseInt(countResult.rows[0].count),
      results: result.rows,
      currentPage: page,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM contatos_clientes WHERE id_solicitacao = $1', [id]);
  res.status(200).json({ message: 'Mensagem apagada.' });
  logger.info(`Admin ${req.user.email} deletou a mensagem ID ${id}`);
};

const getUsers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    const query = `
      SELECT id_usuario, nome, email, telefone, cpf, role, criado_em
      FROM usuarios
      WHERE nome ILIKE $1 OR email ILIKE $1 OR cpf ILIKE $1
      ORDER BY criado_em DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [`%${search}%`, limit, offset];
    const result = await db.query(query, values);

    const countResult = await db.query(`
      SELECT COUNT(*) FROM usuarios
      WHERE nome ILIKE $1 OR email ILIKE $1 OR cpf ILIKE $1
    `, [`%${search}%`]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      total,
      results: result.rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
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

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
    res.status(200).json({ message: 'Usuário apagado.' });
    logger.info(`Admin ${req.user.email} deletou o usuário ID ${id}`);
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

module.exports = {
  getMessages,
  deleteMessage,
  getUsers,
  updateUser,
  createUser,
  deleteUser
};