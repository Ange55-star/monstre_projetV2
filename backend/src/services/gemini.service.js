/**
 * =====================================================
 * GEMINI AI SERVICE
 * =====================================================
 * ✔ Génération de captions pour memes
 * ✔ Analyse d'image (Vision)
 * ✔ Génération de texte humoristique
 * ✔ Compatible Google Gemini API gratuite
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Initialisation client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * =====================================================
 * 1. GÉNÉRER CAPTION DEPUIS TEXTE
 * =====================================================
 * @param {string} text - texte décrivant le contexte
 * @returns {string} - caption humoristique pour meme
 */
const generateCaptionFromText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Tu es un générateur de memes humoristiques.
À partir du texte suivant, génère UNE SEULE caption courte et drôle (max 15 mots) pour un meme.
La caption doit être en français, fun et adaptée aux réseaux sociaux.

Texte : "${text}"

Réponds UNIQUEMENT avec la caption, sans guillemets, sans explication.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const caption = response.text().trim();

    return caption;
  } catch (error) {
    console.log('Gemini text error:', error.message);
    throw new Error('Erreur génération caption: ' + error.message);
  }
};

/**
 * =====================================================
 * 2. ANALYSER IMAGE ET GÉNÉRER CAPTION (VISION)
 * =====================================================
 * @param {string} imagePath - chemin local de l'image
 * @returns {string} - caption humoristique basée sur l'image
 */
const generateCaptionFromImage = async (imagePath) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Lire l'image en base64
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // Détecter le type MIME
    const ext = imagePath.split('.').pop().toLowerCase();
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';

    const prompt = `
Tu es un générateur de memes humoristiques.
Analyse cette image et génère UNE SEULE caption courte et drôle (max 15 mots) pour un meme.
La caption doit être en français, fun et adaptée aux réseaux sociaux.
Sois créatif et humoristique !

Réponds UNIQUEMENT avec la caption, sans guillemets, sans explication.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const caption = response.text().trim();

    return caption;
  } catch (error) {
    console.log('Gemini vision error:', error.message);
    throw new Error('Erreur analyse image: ' + error.message);
  }
};

/**
 * =====================================================
 * 3. GÉNÉRER PLUSIEURS CAPTIONS (CHOIX)
 * =====================================================
 * @param {string} text - contexte
 * @returns {string[]} - liste de 3 captions
 */
const generateMultipleCaptions = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Tu es un générateur de memes humoristiques.
À partir du texte suivant, génère EXACTEMENT 3 captions courtes et drôles (max 15 mots chacune).
Les captions doivent être en français, fun et adaptées aux réseaux sociaux.

Texte : "${text}"

Réponds UNIQUEMENT avec les 3 captions séparées par des sauts de ligne, sans numérotation, sans guillemets.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text_result = response.text().trim();

    // Sépare les captions par ligne
    const captions = text_result
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0)
      .slice(0, 3);

    return captions;
  } catch (error) {
    console.log('Gemini multiple error:', error.message);
    throw new Error('Erreur génération captions: ' + error.message);
  }
};

module.exports = {
  generateCaptionFromText,
  generateCaptionFromImage,
  generateMultipleCaptions,
};
