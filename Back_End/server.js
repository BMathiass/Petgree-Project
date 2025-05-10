require('dotenv').config();
const app = require('./modules/app');

// Rotas
const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Uso das rotas
app.use('/api/user', userRoutes);
app.use('/api/form', formRoutes);
app.use('/api/auth', authRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
    console.error('Erro não tratado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promessa rejeitada não tratada:', reason);
});

// Start do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} em ${process.env.NODE_ENV || 'desenvolvimento'}`);
});