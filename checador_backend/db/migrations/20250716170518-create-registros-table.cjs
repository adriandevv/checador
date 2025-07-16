'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('registros', {
      id_registro: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      hora: {
        allowNull: false,
        type: Sequelize.TIME
      },
      tipo: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      retardo: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      zona: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'zonas',
          key: 'id_zona'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      imagen: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'imagenes',
          key: 'id_imagen'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      dispositivo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'dispositivos',
          key: 'id_dispositivo'
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
    await queryInterface.dropTable('registros');
  }
};
