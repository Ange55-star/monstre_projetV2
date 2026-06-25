/**
 * =====================================================
 * ROUTES GEMINI AI
 * =====================================================
 * ✔ Toutes les routes protégées par JWT
 * ✔ 3 endpoints : text, image, multiple
 */

const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const geminiController = require('../controllers/gemini.controller');

/**
 * POST /api/gemini/caption-text
 * Génère caption depuis texte
 */
router.post(
  '/caption-text',
  authenticateToken,
  geminiController.generateCaptionFromText
);

/**
 * POST /api/gemini/caption-image
 * Génère caption depuis image déjà uploadée
 */
router.post(
  '/caption-image',
  authenticateToken,
  geminiController.generateCaptionFromImage
);

/**
 * POST /api/gemini/captions-multiple
 * Génère 3 captions depuis texte
 */
router.post(
  '/captions-multiple',
  authenticateToken,
  geminiController.generateMultipleCaptions
);

module.exports = router;
