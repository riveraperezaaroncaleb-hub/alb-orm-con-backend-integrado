const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [tipo, token] = authorization.trim().split(/\s+/);

  if (!token || tipo.toLowerCase() !== 'bearer') {
    return res.status(401).json({
      mensaje: 'Token no proporcionado. Envía el encabezado Authorization: Bearer <token>.'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado.'
    });
  }
};

module.exports = authMiddleware;
