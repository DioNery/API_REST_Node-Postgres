require('dotenv').config();
const express = require('express');
const pg = require('pg');
const app = express();
const port = 3000;

// // Configuração do banco de dados (substitua com suas próprias credenciais)
const pool = new pg.Pool({
  user: process.env.USUARIO_BD,
  host: 'https://' + process.env.BANCO_URL,
  database: process.env.DATABASE_BD,
  password: process.env.SENHA_BD,
  port: 5432,
});

// Middleware para análise de corpo JSON
app.use(express.json());

// Rota para listar todos os currículos
app.get('/curriculos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM curriculos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar currículos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar um novo currículo
app.post('/curriculos', async (req, res) => {
  const { nome, experiencia } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO curriculos (nome, experiencia) VALUES ($1, $2) RETURNING *', [nome, experiencia]);
    res.status(201).json(rows[0]);
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
    const { rowCount } = await pool.query('UPDATE curriculos SET nome = $1, experiencia = $2 WHERE id = $3', [nome, experiencia, id]);
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
    const { rowCount } = await pool.query('DELETE FROM curriculos WHERE id = $1', [id]);
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

