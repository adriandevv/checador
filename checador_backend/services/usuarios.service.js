import { sequelize } from "../db/config.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

const models = sequelize.models;

class UsuariosService {
    constructor() {}

    async getAllUsuarios() {
        try {
            const usuarios = await models.Usuarios.findAll({
                where: {
                    estado: true
                },
                attributes: ['id_usuario', 'correo', 'estado', 'tipo_usuario', 'empleado'],
                include: [
                    {
                        model: models.TipoUsuarios,
                        as: 'tipo_usuario_info',
                        attributes: ['id_tipo_usuario', 'nombre']
                    },
                    {
                        model: models.Empleados,
                        as: 'empleado_info',
                        attributes: ['id_empleado', 'nombre', 'apep', 'apem']
                    }
                ]
            });

            return usuarios;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw new Error("Error al obtener usuarios");
        }
    }

    async getUsuarioById(id) {
        try {
            const usuario = await models.Usuarios.findOne({
                where: { id_usuario: id },
                attributes: ['id_usuario', 'correo', 'estado', 'tipo_usuario', 'empleado'],
                include: [
                    {
                        model: models.TipoUsuarios,
                        as: 'tipo_usuario_info',
                        attributes: ['id_tipo_usuario', 'nombre']
                    },
                    {
                        model: models.Empleados,
                        as: 'empleado_info',
                        attributes: ['id_empleado', 'nombre', 'apep', 'apem']
                    },
                    {
                        model: models.Permisos,
                        as: 'permisos',
                        attributes: ['id_permiso', 'nombre', 'descripcion']
                    }
                ]
            });

            return usuario;
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            throw new Error("Error al obtener el usuario");
        }
    }

    async createUsuario(data) {
        try {
            const { correo, contraseña, tipo_usuario, empleado } = data;

            // Verificar si el usuario ya existe
            const usuarioExistente = await models.Usuarios.findOne({
                where: { correo }
            });

            if (usuarioExistente) {
                throw new Error('El usuario ya existe');
            }

            // Verificar que el empleado existe
            const empleadoExistente = await models.Empleados.findByPk(empleado);
            if (!empleadoExistente) {
                throw new Error('El empleado especificado no existe');
            }

            // Verificar que el tipo de usuario existe
            const tipoUsuarioExistente = await models.TipoUsuarios.findByPk(tipo_usuario);
            if (!tipoUsuarioExistente) {
                throw new Error('El tipo de usuario especificado no existe');
            }

            // Encriptar la contraseña
            const saltRounds = 10;
            const contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);

            const nuevoUsuario = await models.Usuarios.create({
                correo,
                contraseña: contraseñaEncriptada,
                tipo_usuario,
                empleado,
                estado: true
            });

            // Retornar el usuario sin la contraseña
            const { contraseña: _, ...usuarioSinContraseña } = nuevoUsuario.toJSON();
            return usuarioSinContraseña;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw new Error(error.message || "Error al crear el usuario");
        }
    }

    async updateUsuario(id, data) {
        try {
            const usuario = await models.Usuarios.findByPk(id);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            // Si se va a actualizar la contraseña, encriptarla
            if (data.contraseña) {
                const saltRounds = 10;
                data.contraseña = await bcrypt.hash(data.contraseña, saltRounds);
            }

            // Si se actualiza el empleado, verificar que existe
            if (data.empleado) {
                const empleadoExistente = await models.Empleados.findByPk(data.empleado);
                if (!empleadoExistente) {
                    throw new Error('El empleado especificado no existe');
                }
            }

            // Si se actualiza el tipo de usuario, verificar que existe
            if (data.tipo_usuario) {
                const tipoUsuarioExistente = await models.TipoUsuarios.findByPk(data.tipo_usuario);
                if (!tipoUsuarioExistente) {
                    throw new Error('El tipo de usuario especificado no existe');
                }
            }

            const usuarioActualizado = await usuario.update(data);
            
            // Retornar el usuario sin la contraseña
            const { contraseña: _, ...usuarioSinContraseña } = usuarioActualizado.toJSON();
            return usuarioSinContraseña;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw new Error(error.message || "Error al actualizar el usuario");
        }
    }

    async deleteUsuario(id) {
        try {
            const usuario = await models.Usuarios.findByPk(id);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            // Soft delete - cambiar estado a false
            await usuario.update({ estado: false });
            
            return { message: "Usuario desactivado correctamente" };
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            throw new Error(error.message || "Error al eliminar el usuario");
        }
    }

    async activateUsuario(id) {
        try {
            const usuario = await models.Usuarios.findByPk(id);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            await usuario.update({ estado: true });
            
            return { message: "Usuario activado correctamente" };
        } catch (error) {
            console.error("Error al activar usuario:", error);
            throw new Error("Error al activar el usuario");
        }
    }

    async searchUsuarios(searchTerm) {
        try {
            const usuarios = await models.Usuarios.findAll({
                where: {
                    [Op.or]: [
                        { correo: { [Op.like]: `%${searchTerm}%` } },
                        { '$empleado_info.nombre$': { [Op.like]: `%${searchTerm}%` } },
                        { '$empleado_info.apep$': { [Op.like]: `%${searchTerm}%` } },
                        { '$empleado_info.apem$': { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                attributes: ['id_usuario', 'correo', 'estado', 'tipo_usuario', 'empleado'],
                include: [
                    {
                        model: models.TipoUsuarios,
                        as: 'tipo_usuario_info',
                        attributes: ['id_tipo_usuario', 'nombre']
                    },
                    {
                        model: models.Empleados,
                        as: 'empleado_info',
                        attributes: ['id_empleado', 'nombre', 'apep', 'apem']
                    }
                ]
            });

            return usuarios;
        } catch (error) {
            console.error("Error al buscar usuarios:", error);
            throw new Error("Error al buscar usuarios");
        }
    }

    async getUsuariosByTipo(tipo_usuario) {
        try {
            const usuarios = await models.Usuarios.findAll({
                where: {
                    tipo_usuario: tipo_usuario,
                    estado: true
                },
                attributes: ['id_usuario', 'correo', 'estado', 'tipo_usuario', 'empleado'],
                include: [
                    {
                        model: models.TipoUsuarios,
                        as: 'tipo_usuario_info',
                        attributes: ['id_tipo_usuario', 'nombre']
                    },
                    {
                        model: models.Empleados,
                        as: 'empleado_info',
                        attributes: ['id_empleado', 'nombre', 'apep', 'apem']
                    }
                ]
            });

            return usuarios;
        } catch (error) {
            console.error("Error al obtener usuarios por tipo:", error);
            throw new Error("Error al obtener usuarios por tipo");
        }
    }
}

export default UsuariosService;
