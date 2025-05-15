const db = require('../config/database');
const bcrypt = require('bcrypt');

const getMessages = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
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
      results: result.rows
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
  const offset = parseInt(req.query.offset) || 0;
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

    res.json({
      total: parseInt(countResult.rows[0].count),
      results: result.rows
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

module.exports = {
  getMessages,
  deleteMessage,
  getUsers,
  updateUser,
  createUser
};