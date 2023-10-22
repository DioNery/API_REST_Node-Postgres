const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
require('dotenv').config();

// Configuração do Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.BANCO_URL,
  username: process.env.USUARIO_BD,
  password: process.env.SENHA_BD,
  database: process.env.DATABASE_BD,
  port: 5432,
});

// Importar o modelo após criar a instância do sequelize
const UserCurriculo = require('./models/userCurriculos')(sequelize);

// Middleware para análise de corpo JSON
app.use(express.json());

// Sincronize o modelo com o banco de dados e inicie o servidor depois
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    startServer();
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
  }
})();

function startServer() {
  // Rota para listar todos os currículos
  app.get('/', async (req, res) => {
    try {
      const curriculos = await UserCurriculo.findAllUsers();

      // Verifique o cabeçalho "Accept" da solicitação
      const acceptHeader = req.get('Accept');

      if (acceptHeader && acceptHeader.includes('application/json')) {
        // Se o cliente aceitar JSON, envie os dados como JSON
        res.json(curriculos);
      } else {
        // Caso contrário, envie o arquivo HTML
        res.sendFile(__dirname + '/index.html');
      }
    } catch (error) {
      console.error('Erro ao listar currículos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
}

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
