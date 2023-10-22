const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const app = express();
const port = 3001;
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
  const apiURL = process.env.API_URL;
  app.get(apiURL, async (req, res) => {
    try {
      const curriculos = await UserCurriculo.findAllUsers();
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        // Se a solicitação for uma solicitação AJAX (JSON), retorne a resposta da API como JSON
        res.json(curriculos);
      } else {
        // Se a solicitação não for uma solicitação AJAX, sirva o arquivo HTML
        res.sendFile(__dirname + '/index.html');
      }
    } catch (error) {
      console.error('Erro ao listar currículos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
}

// Outras rotas e configurações

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
