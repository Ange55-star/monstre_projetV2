/**
 * =====================================================
 * AI SERVICE - Gemini + captions locales fallback
 * =====================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Captions de secours (si Gemini quota épuisé)
 */
const FALLBACK_CAPTIONS = [
  'Quand tu comprends enfin après 3 heures 😅',
  'Moi chaque lundi matin sans exception 💀',
  'Le Wi-Fi coupe exactement au mauvais moment',
  'Quand le prof dit "c\'est simple" mais non',
  'Mon cerveau à 3h du matin vs à 8h du matin',
  'Quand quelqu\'un touche à mes affaires 👀',
  'La vie en Cameroun résumée en une image 🇨🇲',
  'Moi qui fais semblant de comprendre en cours',
  'Quand le courant revient après 6 heures 🕯️',
  'Mon portefeuille vs mes envies ce weekend',
];

const getRandomFallback = () => {
  return FALLBACK_CAPTIONS[
    Math.floor(Math.random() * FALLBACK_CAPTIONS.length)
  ];
};

const get3RandomFallbacks = () => {
  const shuffled = [...FALLBACK_CAPTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

/**
 * Génère caption depuis texte
 */
const generateCaptionFromText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Génère UNE caption courte et drôle (max 15 mots) en français pour un meme sur: "${text}". Réponds UNIQUEMENT avec la caption, sans guillemets.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.log('Gemini indisponible, caption locale utilisée');
    return getRandomFallback();
  }
};

/**
 * Génère caption depuis image
 */
const generateCaptionFromImage = async (imagePath) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    const ext = imagePath.split('.').pop().toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const result = await model.generateContent([
      'Génère UNE caption courte et drôle (max 15 mots) en français pour un meme. Réponds UNIQUEMENT avec la caption.',
      { inlineData: { data: base64Image, mimeType } },
    ]);
    return result.response.text().trim();
  } catch (error) {
    console.log('Gemini vision indisponible, caption locale utilisée');
    return getRandomFallback();
  }
};

/**
 * Génère 3 captions
 */
const generateMultipleCaptions = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Génère EXACTEMENT 3 captions courtes et drôles (max 15 mots chacune) en français pour un meme sur: "${text}". Réponds avec les 3 captions séparées par des sauts de ligne, sans numérotation.`;
    const result = await model.generateContent(prompt);
    const text_result = result.response.text().trim();
    return text_result
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0)
      .slice(0, 3);
  } catch (error) {
    console.log('Gemini indisponible, captions locales utilisées');
    return get3RandomFallbacks();
  }
};

module.exports = {
  generateCaptionFromText,
  generateCaptionFromImage,
  generateMultipleCaptions,
};