import { Model, DataTypes } from "sequelize";

const IMAGENES_TABLE = "imagenes";

const ImagenesSchema = {
    id_imagen: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    imagen: {
        allowNull: false,
        type: DataTypes.BLOB('long'),
    },
    empleado: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
};

class Imagenes extends Model {
    static associate(models) {
        // Una imagen pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_imagen',
            foreignKey: 'empleado'
        });
        
        // Una imagen puede tener muchos registros
        this.hasMany(models.Registros, {
            as: 'registros',
            foreignKey: 'imagen'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: IMAGENES_TABLE,
            modelName: "Imagenes",
            timestamps: false,
        };
    }
}

export { IMAGENES_TABLE, ImagenesSchema, Imagenes };
