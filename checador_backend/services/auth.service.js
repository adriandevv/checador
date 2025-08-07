import { sequelize } from "../db/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import TokenBlacklistService from "./token-blacklist.service.js";

const models = sequelize.models;

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';
        this.jwtExpiration = process.env.JWT_EXPIRATION || '24h';
        this.blacklistService = new TokenBlacklistService();
    }

    generateJTI() {
        return crypto.randomUUID();
    }

    async login(correo, contraseña) {
        try {
            // Buscar el usuario por correo
            const usuario = await models.Usuarios.findOne({
                where: { 
                    correo: correo,
                    estado: true 
                },
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

            if (!usuario) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar la contraseña
            const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
            if (!contraseñaValida) {
                throw new Error('Credenciales inválidas');
            }

            // Generar token JWT con JTI
            const jti = this.generateJTI();
            const payload = {
                jti: jti,
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                tipo_usuario: usuario.tipo_usuario,
                empleado: usuario.empleado
            };

            const token = jwt.sign(payload, this.jwtSecret, { 
                expiresIn: this.jwtExpiration 
            });

            return {
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    correo: usuario.correo,
                    tipo_usuario: usuario.tipo_usuario_info,
                    empleado: usuario.empleado_info
                }
            };

        } catch (error) {
            console.error("Error en login:", error);
            throw new Error(error.message || "Error al iniciar sesión");
        }
    }

    async register(datosUsuario) {
        try {
            const { correo, contraseña, tipo_usuario, empleado } = datosUsuario;

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

            // Crear el usuario
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
            console.error("Error en registro:", error);
            throw new Error(error.message || "Error al registrar usuario");
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    async isTokenValid(token) {
        try {
            // Verificar firma del token
            this.verifyToken(token);
            
            // Verificar si está en la blacklist
            const isBlacklisted = await this.blacklistService.isTokenBlacklisted(token);
            
            return !isBlacklisted;
        } catch (error) {
            return false;
        }
    }

    async refreshToken(token) {
        try {
            // Verificar que el token no esté en blacklist
            const isValid = await this.isTokenValid(token);
            if (!isValid) {
                throw new Error('Token inválido o revocado');
            }

            const decoded = this.verifyToken(token);
            
            // Verificar que el usuario aún existe y está activo
            const usuario = await models.Usuarios.findOne({
                where: {
                    id_usuario: decoded.id_usuario,
                    estado: true
                }
            });

            if (!usuario) {
                throw new Error('Usuario no encontrado o inactivo');
            }

            // Invalidar el token actual
            await this.blacklistService.invalidateToken(token, 'refresh');

            // Generar nuevo token con nuevo JTI
            const jti = this.generateJTI();
            const payload = {
                jti: jti,
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                tipo_usuario: usuario.tipo_usuario,
                empleado: usuario.empleado
            };

            const nuevoToken = jwt.sign(payload, this.jwtSecret, { 
                expiresIn: this.jwtExpiration 
            });

            return { token: nuevoToken };

        } catch (error) {
            console.error("Error al refrescar token:", error);
            throw new Error("Error al refrescar token");
        }
    }

    async changePassword(id_usuario, contraseñaActual, nuevaContraseña) {
        try {
            // Buscar el usuario
            const usuario = await models.Usuarios.findByPk(id_usuario);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar la contraseña actual
            const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.contraseña);
            if (!contraseñaValida) {
                throw new Error('Contraseña actual incorrecta');
            }

            // Encriptar la nueva contraseña
            const saltRounds = 10;
            const nuevaContraseñaEncriptada = await bcrypt.hash(nuevaContraseña, saltRounds);

            // Actualizar la contraseña
            await usuario.update({ contraseña: nuevaContraseñaEncriptada });

            // Invalidar todos los tokens del usuario por seguridad
            await this.blacklistService.invalidateAllUserTokens(id_usuario, 'password_change');

            return { message: 'Contraseña actualizada correctamente' };

        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            throw new Error(error.message || "Error al cambiar contraseña");
        }
    }

    async logout(token) {
        try {
            await this.blacklistService.invalidateToken(token, 'logout');
            return { message: 'Logout exitoso' };
        } catch (error) {
            console.error("Error en logout:", error);
            throw new Error("Error en logout");
        }
    }

    async logoutAllDevices(usuarioId) {
        try {
            await this.blacklistService.invalidateAllUserTokens(usuarioId, 'logout_all');
            return { message: 'Sesión cerrada en todos los dispositivos' };
        } catch (error) {
            console.error("Error al cerrar todas las sesiones:", error);
            throw new Error("Error al cerrar todas las sesiones");
        }
    }

    async revokeUserTokens(usuarioId, razon = 'admin_revoke') {
        try {
            await this.blacklistService.invalidateAllUserTokens(usuarioId, razon);
            return { message: `Todos los tokens del usuario han sido revocados` };
        } catch (error) {
            console.error("Error al revocar tokens:", error);
            throw new Error("Error al revocar tokens del usuario");
        }
    }
}

export default AuthService;
