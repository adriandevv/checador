import { Model, DataTypes } from "sequelize";

const HUELLAS_TABLE = "huellas";

const HuellasSchema = {
    id_huella: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    huella: {
        allowNull: false,
        type: DataTypes.BLOB,
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Huellas extends Model {
    static associate(models) {
        // Una huella pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_huella',
            foreignKey: 'empleado'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: HUELLAS_TABLE,
            modelName: "Huellas",
            timestamps: false,
        };
    }
}

export { HUELLAS_TABLE, HuellasSchema, Huellas };
