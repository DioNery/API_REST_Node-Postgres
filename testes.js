const express = require('express');
const app = express();
const port = 3000;

// Objeto JavaScript simples
const meuObjeto = {
  nome: 'John Doe',
  idade: 30,
  cidade: 'Exemploville',
};

// Rota para exibir o objeto
app.get('/', (req, res) => {
  res.json(meuObjeto);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
