import { Model, DataTypes } from "sequelize";

const REGISTROS_TABLE = "registros";

const RegistrosSchema = {
    id_registro: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    fecha: {
        allowNull: false,
        type: DataTypes.DATEONLY,
    },
    hora: {
        allowNull: false,
        type: DataTypes.TIME,
    },
    tipo: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
    },
    retardo: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    zona: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    imagen: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    dispositivo: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Registros extends Model {
    static associate(models) {
        // Un registro pertenece a una zona
        this.belongsTo(models.Zonas, {
            as: 'zona_registro',
            foreignKey: 'zona'
        });
        
        // Un registro pertenece a una imagen
        this.belongsTo(models.Imagenes, {
            as: 'imagen_registro',
            foreignKey: 'imagen'
        });
        
        // Un registro pertenece a un dispositivo
        this.belongsTo(models.Dispositivos, {
            as: 'dispositivo_registro',
            foreignKey: 'dispositivo'
        });
        
        // Un registro pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_registro',
            foreignKey: 'empleado'
        });
        
        // Un registro puede tener muchas alertas específicas
        this.hasMany(models.AlertasEspecificas, {
            as: 'alertas_especificas',
            foreignKey: 'registro'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: REGISTROS_TABLE,
            modelName: "Registros",
            timestamps: false,
        };
    }
}

export { REGISTROS_TABLE, RegistrosSchema, Registros };
