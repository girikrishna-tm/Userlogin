'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'profilephoto', {
      type: Sequelize.STRING, // Adjust the data type as needed
      allowNull: true // Or set to false if it's required
    });

    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.STRING, // Adjust the data type as needed
      allowNull: true // Or set to false if it's required
    });

    await queryInterface.addColumn('Users', 'isPublic',{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'profilephoto');
    await queryInterface.removeColumn('Users', 'bio');
  }
};

