import { Model, DataTypes } from "sequelize";

const ALERTAS_GENERALES_TABLE = "alertas_generales";

const AlertasGeneralesSchema = {
    id_alerta_gen: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    cuerpo: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class AlertasGenerales extends Model {
    static associate(models) {
        // Una alerta general pertenece a un cuerpo de alerta
        this.belongsTo(models.CuerpoAlertas, {
            as: 'cuerpo_alerta',
            foreignKey: 'cuerpo'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: ALERTAS_GENERALES_TABLE,
            modelName: "AlertasGenerales",
            timestamps: false,
        };
    }
}

export { ALERTAS_GENERALES_TABLE, AlertasGeneralesSchema, AlertasGenerales };
