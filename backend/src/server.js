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
const geminiRoutes = require('./routes/gemini.routes');

const app = express();

/**
 * =====================================================
 * MIDDLEWARES
 * =====================================================
 */

// JSON parser
app.use(express.json());

// CORS (React Native mobile = open)
app.use(cors());

// IMPORTANT: permet upload multipart/form-data
app.use(express.urlencoded({ extended: true }));

/**
 * =====================================================
 * STATIC FILES (IMAGES UPLOADS)
 * =====================================================
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * =====================================================
 * ROUTES
 * =====================================================
 */
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/images', imageRoutes);

app.use('/api/gemini', geminiRoutes);
/**
 * =====================================================
 * DB SYNC
 * =====================================================
 */
sequelize
  .sync({ force: false })
  .then(() => console.log('✔ DB OK'))
  .catch(err => console.log('❌ DB ERROR:', err));

/**
 * =====================================================
 * START SERVER (IMPORTANT IP BINDING)
 * =====================================================
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});