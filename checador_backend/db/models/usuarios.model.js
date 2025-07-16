import { Model, DataTypes } from "sequelize";

const USUARIOS_TABLE = "usuarios";


const UsuariosSchema = {
    id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    correo: {
        allowNull: false,
        type: DataTypes.STRING(100),
    },
    contraseña:{
        allowNull: false,
        type: DataTypes.STRING(100),

    },
    estado: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    tipo_usuario: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    empleado:{
        allowNull: false,
        type: DataTypes.INTEGER,
    }
    

}



class Usuarios extends Model {

    static associate(models) {
        // Un usuario pertenece a un tipo de usuario
        this.belongsTo(models.TipoUsuarios, {
            as: 'tipo_usuario_info',
            foreignKey: 'tipo_usuario'
        });
        
        // Un usuario pertenece a un empleado
        this.belongsTo(models.Empleados, {
            as: 'empleado_info',
            foreignKey: 'empleado'
        });
        
        // Un usuario puede tener muchos permisos
        this.hasMany(models.Permisos, {
            as: 'permisos',
            foreignKey: 'usuario'
        });
    }

 static config(sequelize) {
        return {
            sequelize,
            tableName: USUARIOS_TABLE,
            modelName: "Usuarios",
            timestamps: false,
        };
    }

}

export { USUARIOS_TABLE, UsuariosSchema, Usuarios };