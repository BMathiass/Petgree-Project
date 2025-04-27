require('dotenv').config();
const app = require('./modules/app');

const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');

// Rotas
app.use('/api/form', formRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
