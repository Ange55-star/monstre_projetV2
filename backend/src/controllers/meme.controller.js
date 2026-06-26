const Meme = require('../models/meme.model');

exports.createMeme = async (req, res) => {
  try {
    const {
      title,
      caption,
      imageUrl,
      audioUrl,
      type,
    } = req.body;

    const meme = await Meme.create({
      title,
      caption,
      imageUrl,
      audioUrl,
      type,
    });

    res.status(201).json(meme);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const memes = await Meme.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json(memes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteMeme = async (req, res) => {
  try {
    const meme = await Meme.findByPk(
      req.params.id
    );

    if (!meme) {
      return res.status(404).json({
        message: 'Meme introuvable',
      });
    }

    await meme.destroy();

    res.json({
      message: 'Meme supprimé',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};