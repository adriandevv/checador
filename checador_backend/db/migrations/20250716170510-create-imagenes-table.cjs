'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('imagenes', {
      id_imagen: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imagen: {
        allowNull: false,
        type: Sequelize.BLOB('long')
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
    await queryInterface.dropTable('imagenes');
  }
};
