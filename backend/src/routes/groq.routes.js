/**
 * =====================================================
 * ROUTES GROQ AI
 * =====================================================
 * ✔ Toutes les routes protégées par JWT
 * ✔ Caption texte, image, multiple
 * ✔ Pipeline audio → transcription → caption
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const authenticateToken = require('../middlewares/auth.middleware');
const groqController = require('../controllers/groq.controller');

/**
 * Config Multer pour audio
 */
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/audio');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max (limite Groq Whisper)
});

/**
 * POST /api/groq/caption-text
 * Génère caption depuis texte
 */
router.post(
  '/caption-text',
  authenticateToken,
  groqController.generateCaptionFromText
);

/**
 * POST /api/groq/caption-image
 * Génère caption depuis image uploadée
 */
router.post(
  '/caption-image',
  authenticateToken,
  groqController.generateCaptionFromImage
);

/**
 * POST /api/groq/captions-multiple
 * Génère 3 captions
 */
router.post(
  '/captions-multiple',
  authenticateToken,
  groqController.generateMultipleCaptions
);

/**
 * POST /api/groq/audio-to-caption
 * Pipeline complet : audio → Whisper → LLaMA → caption
 */
router.post(
  '/audio-to-caption',
  authenticateToken,
  uploadAudio.single('audio'),
  groqController.audioToCaption
);

module.exports = router;
