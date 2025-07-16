import { Model, DataTypes } from "sequelize";

const TURNOS_TABLE = "turnos";

const TurnosSchema = {
    id_turno: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    hora_inicio: {
        allowNull: false,
        type: DataTypes.TIME,
    },
    hora_fin: {
        allowNull: false,
        type: DataTypes.TIME,
    },
    tolerancia: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    dia: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Turnos extends Model {
    static associate(models) {
        // Un turno pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_turno',
            foreignKey: 'empleado'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TURNOS_TABLE,
            modelName: "Turnos",
            timestamps: false,
        };
    }
}

export { TURNOS_TABLE, TurnosSchema, Turnos };
