const app = require('./module/app');
const routes = require('./module/api');

app.use('/', routes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
