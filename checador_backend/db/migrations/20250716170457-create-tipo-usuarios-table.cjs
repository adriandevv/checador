'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tipo_usuarios', {
      id_tipousuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_nom: {
        allowNull: false,
        type: Sequelize.STRING(45)
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tipo_usuarios');
  }
};
