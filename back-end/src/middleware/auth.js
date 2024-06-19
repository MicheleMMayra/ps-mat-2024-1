import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  // Lista de rotas que não requerem autenticação
  const bypassRoutes = [
    { url: '/users/login', method: 'POST' },
    { url: '/about', method: 'POST' } // Adiciona a rota /about para POST requests
  ];

  // Verifica se a rota atual é uma das exceções
  for (let route of bypassRoutes) {
    if (route.url === req.url && route.method === req.method) {
      return next();
    }
  }

  // Processo de verificação do token de autenticação
  let token = null;

  // 1. Procura o token em um cookie
  token = req.cookies ? req.cookies[process.env.AUTH_COOKIE_NAME] : null;

  // 2. Se o token não for encontrado no cookie, procura no header de autorização
  if (!token) {
    const authHeader = req.headers['authorization'];
    
    // Token não foi passado ~> HTTP 403: Forbidden
    if (!authHeader) {
      console.error('ERRO: Acesso negado por falta de token');
      return res.status(403).end();
    }

    // Extrai o token do cabeçalho 'authorization'
    const authHeaderParts = authHeader.split(' ');
    token = authHeaderParts[1];
  }

  // Validando o token
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
    if (error) {
      // Token inválido ou expirado ~> HTTP 403: Forbidden
      console.error('ERRO: Token inválido ou expirado');
      return res.status(403).end();
    }

    // Token está OK, guardar informações do usuário no req
    req.authUser = user;
    // Continua para a rota normal
    next();
  });
}
