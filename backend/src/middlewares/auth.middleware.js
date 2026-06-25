/**
 * =====================================================
 * Middleware JWT
 * Vérifie qu'un utilisateur possède un token valide
 * =====================================================
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification
 */
const authenticateToken = (req, res, next) => {
  try {

    // Header attendu :
    // Authorization: Bearer TOKEN

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Token manquant'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token invalide'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(403).json({
      message: 'Token expiré ou invalide'
    });

  }
};

module.exports = authenticateToken;