'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('permisos', {
      id_permiso: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tabla: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      permiso: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      usuario: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('permisos');
  }
};
