'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('zonas', {
      id_zona: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      estatus: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      coordenadas: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'coordenadas',
          key: 'id_coordenada'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      empleado: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'empleados',
          key: 'id_empleado'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('zonas');
  }
};
