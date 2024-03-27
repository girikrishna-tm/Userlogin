const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: {
          msg: 'Username must contain only letters and numbers'
      },
      len: {
          args: [3, 20],
          msg: 'Username length must be between 3 and 20 characters'
      }
  }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
          msg: 'Invalid email format'
      }
  }
  },
  profilephoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true // By default, profile is public
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['admin', 'user']] // Only accept 'admin' or 'user' as valid roles
    }
  }
});

module.exports = User;
