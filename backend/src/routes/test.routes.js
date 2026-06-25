const express = require('express');
const router = express.Router();

const authenticateToken =
  require('../middlewares/auth.middleware');

router.get(
  '/',
  authenticateToken,
  (req, res) => {

    res.json({
      message: 'Route protégée',
      user: req.user
    });

  }
);

module.exports = router;