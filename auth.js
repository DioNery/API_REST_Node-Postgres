const admin = require('firebase-admin');

function isAuthenticated(req, res, next) {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    return res.status(403).json({ error: 'Token de autenticação ausente' });
  }

  // Divida o cabeçalho para obter o token
  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(403).json({ error: 'Token de autenticação inválido' });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error('Erro ao verificar token:', error);
      res.status(403).json({ error: 'Token de autenticação inválido' });
    });
    console.log('Authorization Header:', authorizationHeader);
}

module.exports = isAuthenticated;
