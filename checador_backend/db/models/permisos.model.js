import { Model, DataTypes } from "sequelize";

const PERMISOS_TABLE = "permisos";

const PermisosSchema = {
    id_permiso: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    tabla: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    permiso: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    usuario: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Permisos extends Model {
    static associate(models) {
        // Un permiso pertenece a un usuario
        this.belongsTo(models.Usuarios, {
            as: 'usuario_permiso',
            foreignKey: 'usuario'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PERMISOS_TABLE,
            modelName: "Permisos",
            timestamps: false,
        };
    }
}

export { PERMISOS_TABLE, PermisosSchema, Permisos };
