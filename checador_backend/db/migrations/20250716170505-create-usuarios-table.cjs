'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      correo: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      contraseña: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT
      },
      tipo_usuario: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tipo_usuarios',
          key: 'id_tipousuario'
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
    await queryInterface.dropTable('usuarios');
  }
};
