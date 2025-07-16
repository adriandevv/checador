import { Model, DataTypes } from "sequelize";

const EMPLEADOS_TABLE = "empleados";

const EmpleadosSchema = {
    id_empleado: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    nombre: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    apep: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    apem: {
        allowNull: false,
        type: DataTypes.STRING(45),
    },
    estatus: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
};

class Empleados extends Model {
    static associate(models) {
        // Un empleado puede tener un usuario
        this.hasOne(models.Usuarios, {
            as: 'usuario',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchas zonas asignadas
        this.hasMany(models.Zonas, {
            as: 'zonas',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchas imágenes
        this.hasMany(models.Imagenes, {
            as: 'imagenes',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchas huellas
        this.hasMany(models.Huellas, {
            as: 'huellas',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchos dispositivos
        this.hasMany(models.Dispositivos, {
            as: 'dispositivos',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchos registros
        this.hasMany(models.Registros, {
            as: 'registros',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchos turnos
        this.hasMany(models.Turnos, {
            as: 'turnos',
            foreignKey: 'empleado'
        });
        
        // Un empleado puede tener muchas alertas específicas
        this.hasMany(models.AlertasEspecificas, {
            as: 'alertas_especificas',
            foreignKey: 'empleado'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: EMPLEADOS_TABLE,
            modelName: "Empleados",
            timestamps: false,
        };
    }
}

export { EMPLEADOS_TABLE, EmpleadosSchema, Empleados };
