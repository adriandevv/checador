'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tokens_invalidados', {
      id_token: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jti: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
        comment: 'JWT ID - identificador único del token'
      },
      token_hash: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
        comment: 'Hash del token para verificación'
      },
      usuario_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        comment: 'ID del usuario que poseía el token',
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_invalidacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      razon: {
        allowNull: true,
        type: Sequelize.STRING(100),
        comment: 'Razón de la invalidación: logout, cambio_password, admin_revoke, etc.'
      },
      expira_en: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: 'Fecha de expiración original del token'
      }
    });

    // Crear índices para optimizar consultas
    await queryInterface.addIndex('tokens_invalidados', ['jti']);
    await queryInterface.addIndex('tokens_invalidados', ['token_hash']);
    await queryInterface.addIndex('tokens_invalidados', ['usuario_id']);
    await queryInterface.addIndex('tokens_invalidados', ['fecha_invalidacion']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens_invalidados');
  }
};
