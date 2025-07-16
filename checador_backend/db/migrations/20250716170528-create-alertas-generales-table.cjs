'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('alertas_generales', {
      id_alerta_gen: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cuerpo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'cuerpo_alertas',
          key: 'id_cuerpo'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('alertas_generales');
  }
};
