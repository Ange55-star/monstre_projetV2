/**
 * =====================================================
 * SERVER EXPRESS STABLE REACT NATIVE
 * =====================================================
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const sequelize = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const imageRoutes = require('./routes/image.routes');
const groqRoutes = require('./routes/groq.routes');
const memeRoutes = require('./routes/meme.routes');

const app = express();

/**
 * =====================================================
 * MIDDLEWARES
 * =====================================================
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/memes', memeRoutes);

// 🔥 ICI TU AJOUTES LE PING
app.get('/ping', (req, res) => {
  console.log('PING OK');
  res.json({ ok: true });
});

console.log("JWT_SECRET =", process.env.JWT_SECRET);

/**
 * =====================================================
 * FICHIERS STATIQUES (UPLOADS)
 * =====================================================
 */
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

/**
 * =====================================================
 * ROUTES
 * =====================================================
 */
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/memes', memeRoutes);

/**
 * =====================================================
 * BASE DE DONNÉES
 * =====================================================
 */
sequelize
  .sync({ force: false })
  .then(() => console.log('✔ DB OK'))
  .catch((err) => console.log('❌ DB ERROR:', err));

/**
 * =====================================================
 * START SERVER
 * =====================================================
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});