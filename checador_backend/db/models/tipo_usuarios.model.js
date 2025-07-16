import { Model, DataTypes } from "sequelize";

const TIPO_USUARIOS_TABLE = "tipo_usuarios";

const TipoUsuariosSchema = {
    id_tipousuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    tipo_nom: {
        allowNull: false,
        type: DataTypes.STRING(45),
    }
};

class TipoUsuarios extends Model {
    static associate(models) {
        // Un tipo de usuario puede tener muchos usuarios
        this.hasMany(models.Usuarios, {
            as: 'usuarios',
            foreignKey: 'tipo_usuario'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TIPO_USUARIOS_TABLE,
            modelName: "TipoUsuarios",
            timestamps: false,
        };
    }
}

export { TIPO_USUARIOS_TABLE, TipoUsuariosSchema, TipoUsuarios };
