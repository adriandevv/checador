'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('alertas_especificas', {
      id_alerta_esp: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      estatus: {
        allowNull: false,
        type: Sequelize.TINYINT
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
      },
      registro: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'registros',
          key: 'id_registro'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('alertas_especificas');
  }
};
