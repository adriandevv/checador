'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('empleados', {
      id_empleado: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      apep: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      apem: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      estatus: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('empleados');
  }
};
