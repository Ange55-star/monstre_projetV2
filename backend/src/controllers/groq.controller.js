const path = require('path');
const groqService = require('../services/groq.service');

const generateCaptionFromText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Le texte est obligatoire' });
    }
    const caption = await groqService.generateCaptionFromText(text);
    return res.status(200).json({ message: 'Caption générée', caption, text });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur Groq', error: error.message });
  }
};

const generateCaptionFromImage = async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: 'Filename obligatoire' });
    }
    const imagePath = path.join(__dirname, '../../uploads/images', filename);
    const caption = await groqService.generateCaptionFromImage(imagePath);
    return res.status(200).json({ message: 'Caption image générée', caption, filename });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur analyse image', error: error.message });
  }
};

const generateMultipleCaptions = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Le texte est obligatoire' });
    }
    const captions = await groqService.generateMultipleCaptions(text);
    return res.status(200).json({ message: 'Captions générées', captions });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur captions', error: error.message });
  }
};

const audioToCaption = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun audio envoyé' });
    }
    const result = await groqService.processAudioToCaption(req.file.path);
    return res.status(200).json({
      message: 'Audio traité avec succès',
      transcription: result.transcription,
      caption: result.caption,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur audio', error: error.message });
  }
};

module.exports = {
  generateCaptionFromText,
  generateCaptionFromImage,
  generateMultipleCaptions,
  audioToCaption,
};