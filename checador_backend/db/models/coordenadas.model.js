import { Model, DataTypes } from "sequelize";

const COORDENADAS_TABLE = "coordenadas";

const CoordenadasSchema = {
    id_coordenada: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    longitud: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    latitud: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    altitud: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    radio: {
        allowNull: false,
        type: DataTypes.DOUBLE,
    }
};

class Coordenadas extends Model {
    static associate(models) {
        // Una coordenada puede tener muchas zonas
        this.hasMany(models.Zonas, {
            as: 'zonas',
            foreignKey: 'coordenadas'
        });
        
        // Una coordenada puede tener muchas direcciones
        this.hasMany(models.Direccion, {
            as: 'direcciones',
            foreignKey: 'coordenadas'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: COORDENADAS_TABLE,
            modelName: "Coordenadas",
            timestamps: false,
        };
    }
}

export { COORDENADAS_TABLE, CoordenadasSchema, Coordenadas };
