import { Model, DataTypes } from "sequelize";

const ALERTAS_ESPECIFICAS_TABLE = "alertas_especificas";

const AlertasEspecificasSchema = {
    id_alerta_esp: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    estatus: {
        allowNull: false,
        type: DataTypes.TINYINT,
    },
    cuerpo: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    registro: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class AlertasEspecificas extends Model {
    static associate(models) {
        // Una alerta específica pertenece a un cuerpo de alerta
        this.belongsTo(models.CuerpoAlertas, {
            as: 'cuerpo_alerta',
            foreignKey: 'cuerpo'
        });
        
        // Una alerta específica pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_alerta',
            foreignKey: 'empleado'
        });
        
        // Una alerta específica pertenece a un registro
        this.belongsTo(models.Registros, {
            as: 'registro_alerta',
            foreignKey: 'registro'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: ALERTAS_ESPECIFICAS_TABLE,
            modelName: "AlertasEspecificas",
            timestamps: false,
        };
    }
}

export { ALERTAS_ESPECIFICAS_TABLE, AlertasEspecificasSchema, AlertasEspecificas };
