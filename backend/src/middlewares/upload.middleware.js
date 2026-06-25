/**
 * =====================================================
 * Middleware Multer - Upload d'images
 * =====================================================
 * ✔ Compatible React Native
 * ✔ Stockage local serveur
 * ✔ Nom unique pour éviter conflits
 */

const multer = require('multer');
const path = require('path');

/**
 * 📁 Configuration stockage disque
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // dossier où les images seront stockées
    cb(null, 'uploads/images');
  },

  filename: (req, file, cb) => {
    // nom unique basé sur timestamp
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

/**
 * 📦 Middleware upload
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max (important pour mobile)
  },
});

module.exports = upload;