const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

  console.log('Token recibido:', token); // Verificar si el token está presente

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Verificar qué contiene el token decodificado

    req.user = decoded; // Agregar los datos del usuario a la solicitud
    next(); // Continuar con la siguiente función de middleware
  } catch (err) {
    console.error('Error al verificar token:', err.message);
    res.status(401).json({ message: 'Token inválido', error: err.message });
  }
};

module.exports = authMiddleware;
