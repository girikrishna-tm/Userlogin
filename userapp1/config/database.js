const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres:postgres:System@localhost:5432/userdb');

module.exports = sequelize;
