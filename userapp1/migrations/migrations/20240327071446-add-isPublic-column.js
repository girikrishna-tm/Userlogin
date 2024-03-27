'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'isPublic', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true // Adjust the default value as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isPublic');
  }
};
