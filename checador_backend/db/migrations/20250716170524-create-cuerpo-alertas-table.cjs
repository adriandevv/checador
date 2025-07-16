'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cuerpo_alertas', {
      id_cuerpo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      texto: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      fecha: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      hora: {
        allowNull: false,
        type: Sequelize.TIME
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cuerpo_alertas');
  }
};
