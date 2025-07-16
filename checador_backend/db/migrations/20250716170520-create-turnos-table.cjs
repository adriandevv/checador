'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('turnos', {
      id_turno: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hora_inicio: {
        allowNull: false,
        type: Sequelize.TIME
      },
      hora_fin: {
        allowNull: false,
        type: Sequelize.TIME
      },
      tolerancia: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dia: {
        allowNull: false,
        type: Sequelize.STRING(45)
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
    await queryInterface.dropTable('turnos');
  }
};
