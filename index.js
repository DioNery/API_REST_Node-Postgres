const admin = require('firebase-admin');
const { Sequelize } = require('sequelize');
const express = require('express');
const isAuthenticated = require('./auth');
const port = process.env.PORT || 3001;
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.BANCO_URL,
  username: process.env.USUARIO_BD,
  password: process.env.SENHA_BD,
  database: process.env.DATABASE_BD,
  port: 5432,
});

const UserCurriculo = require('./models/userCurriculos')(sequelize);

const app = express();

app.use(express.json());

app.get('/', isAuthenticated, (req, res) => {
  res.redirect('/users');
});

app.get('/users', isAuthenticated, async (req, res) => {
  try {
    const curriculos = await UserCurriculo.findAllUsers();
    res.json(curriculos);
  } catch (error) {
    console.error('Erro ao listar currículos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/users', isAuthenticated, async (req, res) => {
  try {
    const { username, TextoCurriculo } = req.body;
    if (!username || !TextoCurriculo) {
      return res.status(400).json({ error: 'Campos username e TextoCurriculo são obrigatórios.' });
    }

    const newUser = await UserCurriculo.createUser({ username, TextoCurriculo, userId: req.user.uid });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/users/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, TextoCurriculo } = req.body;

    const user = await UserCurriculo.findOne({ where: { id, userId: req.user.uid } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.username = username;
    user.TextoCurriculo = TextoCurriculo;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/users/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserCurriculo.findOne({ where: { id, userId: req.user.uid } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.destroy();

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
