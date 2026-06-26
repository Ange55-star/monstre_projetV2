const express = require('express');

const router = express.Router();

const authenticateToken =
require('../middlewares/auth.middleware');

const memeController =
require('../controllers/meme.controller');

router.post(
  '/',
  authenticateToken,
  memeController.createMeme
);

router.get(
  '/history',
  authenticateToken,
  memeController.getHistory
);

router.delete(
  '/:id',
  authenticateToken,
  memeController.deleteMeme
);

module.exports = router;