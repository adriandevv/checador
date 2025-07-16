'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('coordenadas', {
      id_coordenada: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      longitud: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      latitud: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      altitud: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      radio: {
        allowNull: false,
        type: Sequelize.DOUBLE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('coordenadas');
  }
};
