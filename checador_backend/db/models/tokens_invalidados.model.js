import { Model, DataTypes } from "sequelize";

const TOKENS_INVALIDADOS_TABLE = "tokens_invalidados";

const TokensInvalidadosSchema = {
    id_token: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    jti: {
        allowNull: false,
        type: DataTypes.STRING(255),
        unique: true,
        comment: 'JWT ID - identificador único del token'
    },
    token_hash: {
        allowNull: false,
        type: DataTypes.STRING(255),
        unique: true,
        comment: 'Hash del token para verificación'
    },
    usuario_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        comment: 'ID del usuario que poseía el token'
    },
    fecha_invalidacion: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    razon: {
        allowNull: true,
        type: DataTypes.STRING(100),
        comment: 'Razón de la invalidación: logout, cambio_password, admin_revoke, etc.'
    },
    expira_en: {
        allowNull: false,
        type: DataTypes.DATE,
        comment: 'Fecha de expiración original del token'
    }
};

class TokensInvalidados extends Model {
    static associate(models) {
        // Un token invalidado pertenece a un usuario
        this.belongsTo(models.Usuarios, {
            as: 'usuario',
            foreignKey: 'usuario_id'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TOKENS_INVALIDADOS_TABLE,
            modelName: "TokensInvalidados",
            timestamps: false,
            indexes: [
                {
                    fields: ['jti']
                },
                {
                    fields: ['token_hash']
                },
                {
                    fields: ['usuario_id']
                },
                {
                    fields: ['fecha_invalidacion']
                }
            ]
        };
    }
}

export { TOKENS_INVALIDADOS_TABLE, TokensInvalidadosSchema, TokensInvalidados };
