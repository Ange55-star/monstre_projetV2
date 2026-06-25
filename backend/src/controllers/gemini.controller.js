/**
 * =====================================================
 * GEMINI CONTROLLER
 * =====================================================
 * ✔ Route génération caption depuis texte
 * ✔ Route génération caption depuis image uploadée
 * ✔ Route génération multiple captions
 */

const path = require('path');
const geminiService = require('../services/gemini.service');

/**
 * =====================================================
 * POST /api/gemini/caption-text
 * =====================================================
 * Body : { text: "mon texte" }
 * Retourne : { caption: "..." }
 */
const generateCaptionFromText = async (req, res) => {
  try {
    const { text } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: 'Le texte est obligatoire',
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        message: 'Texte trop long (max 500 caractères)',
      });
    }

    // Génération caption via Gemini
    const caption = await geminiService.generateCaptionFromText(text);

    return res.status(200).json({
      message: 'Caption générée avec succès',
      caption,
      text,
    });

  } catch (error) {
    console.log('Caption text error:', error.message);
    return res.status(500).json({
      message: 'Erreur serveur Gemini',
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * POST /api/gemini/caption-image
 * =====================================================
 * Body : { filename: "1234.jpg" } (fichier déjà uploadé)
 * Retourne : { caption: "..." }
 */
const generateCaptionFromImage = async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        message: 'Filename obligatoire',
      });
    }

    // Chemin local de l'image uploadée
    const imagePath = path.join(__dirname, '../../uploads/images', filename);

    // Génération caption via Gemini Vision
    const caption = await geminiService.generateCaptionFromImage(imagePath);

    return res.status(200).json({
      message: 'Caption image générée avec succès',
      caption,
      filename,
    });

  } catch (error) {
    console.log('Caption image error:', error.message);
    return res.status(500).json({
      message: 'Erreur analyse image Gemini',
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * POST /api/gemini/captions-multiple
 * =====================================================
 * Body : { text: "mon texte" }
 * Retourne : { captions: ["...", "...", "..."] }
 */
const generateMultipleCaptions = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: 'Le texte est obligatoire',
      });
    }

    // Génération 3 captions
    const captions = await geminiService.generateMultipleCaptions(text);

    return res.status(200).json({
      message: 'Captions générées avec succès',
      captions,
    });

  } catch (error) {
    console.log('Multiple captions error:', error.message);
    return res.status(500).json({
      message: 'Erreur génération captions',
      error: error.message,
    });
  }
};

module.exports = {
  generateCaptionFromText,
  generateCaptionFromImage,
  generateMultipleCaptions,
};
