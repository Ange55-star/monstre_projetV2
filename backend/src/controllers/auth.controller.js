/**
 * =====================================================
 * AUTH CONTROLLER
 * =====================================================
 * ✔ Register avec hash bcrypt
 * ✔ Login avec token 30 jours
 * ✔ Profile utilisateur connecté
 */

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * 📝 INSCRIPTION
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation champs
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérifie si email déjà utilisé
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet email existe déjà' });
    }

    // Crée l'utilisateur (le hash est fait dans le model)
    await User.create({ username, email, password });

    res.status(201).json({ message: 'Compte créé avec succès' });

  } catch (error) {
    console.log('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔐 CONNEXION
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
    }

    // Cherche l'utilisateur
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    /**
     * ✅ IMPORTANT : token valide 30 jours
     * Évite les déconnexions fréquentes
     */
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 👤 PROFIL UTILISATEUR CONNECTÉ
 * GET /api/auth/profile
 */
exports.profile = async (req, res) => {
  try {
    // req.user est rempli par le middleware JWT
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.log('Profile error:', error);
    res.status(500).json({ error: error.message });
  }
};
