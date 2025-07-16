import { Model, DataTypes } from "sequelize";

const DISPOSITIVOS_TABLE = "dispositivos";

const DispositivosSchema = {
    id_dispositivo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    mac: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    num_tel: {
        allowNull: false,
        type: DataTypes.STRING(10),
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Dispositivos extends Model {
    static associate(models) {
        // Un dispositivo pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_dispositivo',
            foreignKey: 'empleado'
        });
        
        // Un dispositivo puede tener muchos registros
        this.hasMany(models.Registros, {
            as: 'registros',
            foreignKey: 'dispositivo'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: DISPOSITIVOS_TABLE,
            modelName: "Dispositivos",
            timestamps: false,
        };
    }
}

export { DISPOSITIVOS_TABLE, DispositivosSchema, Dispositivos };
