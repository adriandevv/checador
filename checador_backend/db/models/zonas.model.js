import { Model, DataTypes } from "sequelize";

const ZONAS_TABLE = "zonas";

const ZonasSchema = {
    id_zona: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    nombre: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    estatus: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    coordenadas: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Zonas extends Model {
    static associate(models) {
        // Una zona pertenece a una coordenada
        this.belongsTo(models.Coordenadas, {
            as: 'coordenada',
            foreignKey: 'coordenadas'
        });
        
        // Una zona pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_zona',
            foreignKey: 'empleado'
        });
        
        // Una zona puede tener muchos registros
        this.hasMany(models.Registros, {
            as: 'registros',
            foreignKey: 'zona'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: ZONAS_TABLE,
            modelName: "Zonas",
            timestamps: false,
        };
    }
}

export { ZONAS_TABLE, ZonasSchema, Zonas };
