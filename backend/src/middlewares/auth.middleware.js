/**
 * =====================================================
 * MIDDLEWARE JWT - AUTH
 * =====================================================
 * ✔ Vérifie token JWT dans chaque requête protégée
 * ✔ Messages d'erreur clairs
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Pas de header Authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // Format incorrect
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Format Bearer invalide' });
    }

    // Extrait le token
    const token = authHeader.split(' ')[1];

    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attache l'utilisateur à la requête
    req.user = decoded;

    next();

  } catch (error) {
    // Token expiré
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }

    // Token invalide
    return res.status(403).json({ message: 'Token invalide' });
  }
};

module.exports = authenticateToken;
