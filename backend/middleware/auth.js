const jwt = require('jsonwebtoken');

/**
 * Sprawdza, czy nagłówek Authorization zawiera poprawny token JWT.
 * Jeśli tak – dekoduje go i przypisuje payload do req.user.
 * Jeśli nie – zwraca 401 Unauthorized.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = { id: decoded.id };                      
    next();                                             
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
