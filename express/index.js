const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const app = express();
const port = 3000;
const UserCurriculo = require('./models/userCurriculos'); 
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

const userData = {
    username: 'Usuario1',
    TextoCurriculo: 'Texto de exemplo do currículo',
  };
  
  UserCurriculo.createUser(userData)
    .then((user) => {
      console.log('Novo usuário criado:', user);
    })
    .catch((error) => {
      console.error('Erro ao criar usuário:', error);
    });
  

// Sincronize o modelo com o banco de dados
sequelize.sync();

// Middleware para análise de corpo JSON
app.use(express.json());

// Rota para listar todos os currículos
app.get('/curriculos', async (req, res) => {
  try {
    const curriculos = await UserCurriculo.findAllUsers()
    .then((users) => {
      console.log('Todos os usuários:', users);
    })
    .catch((error) => {
      console.error('Erro ao encontrar todos os usuários:', error);
    });
    res.json(curriculos);
  } catch (error) {
    console.error('Erro ao listar currículos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar um novo currículo
app.post('/curriculos', async (req, res) => {
  const { nome, experiencia } = req.body;
  try {
    const curriculo = await Curriculo.create({ nome, experiencia });
    res.status(201).json(curriculo);
  } catch (error) {
    console.error('Erro ao criar currículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar um currículo
app.put('/curriculos/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, experiencia } = req.body;
  try {
    const [rowCount] = await Curriculo.update(
      { nome, experiencia },
      { where: { id } }
    );
    if (rowCount === 0) {
      res.status(404).json({ error: 'Currículo não encontrado' });
    } else {
      res.json({ message: 'Currículo atualizado com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao atualizar currículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para excluir um currículo
app.delete('/curriculos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const rowCount = await Curriculo.destroy({ where: { id } });
    if (rowCount === 0) {
      res.status(404).json({ error: 'Currículo não encontrado' });
    } else {
      res.json({ message: 'Currículo excluído com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao excluir currículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
