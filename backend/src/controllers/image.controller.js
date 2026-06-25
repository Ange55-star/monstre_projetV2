/**
 * =====================================================
 * Controller Upload Image
 * =====================================================
 * ✔ Vérifie fichier reçu
 * ✔ Retourne URL exploitable par mobile
 */

exports.uploadImage = async (req, res) => {
  try {
    // Vérifie si fichier envoyé
    if (!req.file) {
      return res.status(400).json({
        message: 'Aucune image envoyée',
      });
    }

    /**
     * 📌 IMPORTANT MOBILE :
     * On retourne une URL complète accessible par téléphone
     */
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;

    return res.status(200).json({
      message: 'Image uploadée avec succès',
      filename: req.file.filename,
      path: req.file.path,
      url: imageUrl,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erreur serveur upload',
      error: error.message,
    });
  }
};