import { Model, DataTypes } from "sequelize";

const CUERPO_ALERTAS_TABLE = "cuerpo_alertas";

const CuerpoAlertasSchema = {
    id_cuerpo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    texto: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    fecha: {
        allowNull: false,
        type: DataTypes.DATEONLY,
    },
    hora: {
        allowNull: false,
        type: DataTypes.TIME,
    }
};

class CuerpoAlertas extends Model {
    static associate(models) {
        // Un cuerpo de alerta puede tener muchas alertas específicas
        this.hasMany(models.AlertasEspecificas, {
            as: 'alertas_especificas',
            foreignKey: 'cuerpo'
        });
        
        // Un cuerpo de alerta puede tener muchas alertas generales
        this.hasMany(models.AlertasGenerales, {
            as: 'alertas_generales',
            foreignKey: 'cuerpo'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: CUERPO_ALERTAS_TABLE,
            modelName: "CuerpoAlertas",
            timestamps: false,
        };
    }
}

export { CUERPO_ALERTAS_TABLE, CuerpoAlertasSchema, CuerpoAlertas };
