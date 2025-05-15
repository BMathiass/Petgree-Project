require('dotenv').config();

console.log('Variáveis de ambiente:', process.env.PORT, process.env.NODE_ENV);

console.log('Iniciando a aplicação...');

const app = require('./modules/app');

// Rotas
const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Uso das rotas
app.use('/api/user', userRoutes);
app.use('/api/form', formRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

// Início do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} em ${process.env.NODE_ENV || 'desenvolvimento'}`);
});