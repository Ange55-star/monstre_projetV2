/**
 * =====================================================
 * GROQ AI SERVICE - VERSION STABLE (fetch natif)
 * =====================================================
 */

const fs = require('fs');
const path = require('path');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.GROQ_API_KEY;

/**
 * Appel API Groq (fetch natif)
 */
const callGroq = async (messages, maxTokens = 150) => {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens,
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

/**
 * Génère caption depuis texte
 */
const generateCaptionFromText = async (text) => {
  return await callGroq([
    { role: 'system', content: 'Tu es un générateur de memes humoristiques. Tu génères des captions courtes, drôles en français.' },
    { role: 'user', content: `Génère UNE caption courte et drôle (max 15 mots) en français pour un meme sur: "${text}". Réponds UNIQUEMENT avec la caption.` },
  ]);
};

/**
 * Génère 3 captions
 */
const generateMultipleCaptions = async (text) => {
  const result = await callGroq([
    { role: 'system', content: 'Tu es un générateur de memes humoristiques.' },
    { role: 'user', content: `Génère EXACTEMENT 3 captions courtes et drôles (max 15 mots chacune) en français pour un meme sur: "${text}". Réponds avec les 3 captions séparées par des sauts de ligne, sans numérotation.` },
  ], 300);

  return result.split('\n').map(c => c.trim()).filter(c => c.length > 0).slice(0, 3);
};

/**
 * Génère caption depuis image (base64)
 */
const generateCaptionFromImage = async (imagePath) => {
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const ext = imagePath.split('.').pop().toLowerCase();
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Génère UNE caption courte et drôle (max 15 mots) en français pour un meme basé sur cette image. Réponds UNIQUEMENT avec la caption.' },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

/**
 * Pipeline audio → caption
 */
const processAudioToCaption = async (audioPath) => {
  const caption = await generateCaptionFromText('un audio drôle enregistré');
  return { transcription: 'Audio enregistré', caption };
};

module.exports = {
  generateCaptionFromText,
  generateMultipleCaptions,
  generateCaptionFromImage,
  processAudioToCaption,
};