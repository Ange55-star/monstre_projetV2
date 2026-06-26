/**
 * =====================================================
 * AUTH ROUTES
 * =====================================================
 * ✔ Register
 * ✔ Login
 * ✔ Profile (protégé JWT)
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profile (protégé)
router.get('/profile', authenticateToken, authController.profile);

module.exports = router;
