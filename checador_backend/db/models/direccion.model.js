import { Model, DataTypes } from "sequelize";

const DIRECCION_TABLE = "dirección";

const DireccionSchema = {
    id_direccion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    coordenadas: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Direccion extends Model {
    static associate(models) {
        // Una dirección pertenece a una coordenada
        this.belongsTo(models.Coordenadas, {
            as: 'coordenada',
            foreignKey: 'coordenadas'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: DIRECCION_TABLE,
            modelName: "Direccion",
            timestamps: false,
        };
    }
}

export { DIRECCION_TABLE, DireccionSchema, Direccion };
