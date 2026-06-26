const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Meme = sequelize.define('Meme', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'image',
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  audioUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Meme;