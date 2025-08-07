import jwt from 'jsonwebtoken';
import { sequelize } from '../db/config.js';
import TokenBlacklistService from '../services/token-blacklist.service.js';

const models = sequelize.models;

class AuthMiddleware {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';
        this.blacklistService = new TokenBlacklistService();
    }

    // Middleware para verificar token JWT
    verifyToken = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({ 
                    error: 'Token de acceso requerido',
                    code: 'NO_TOKEN'
                });
            }

            // Verificar formato: "Bearer token"
            const tokenParts = authHeader.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                return res.status(401).json({ 
                    error: 'Formato de token inválido. Use: Bearer <token>',
                    code: 'INVALID_TOKEN_FORMAT'
                });
            }

            const token = tokenParts[1];

            // Verificar y decodificar el token
            const decoded = jwt.verify(token, this.jwtSecret);

            // Verificar si el token está en la blacklist
            const isBlacklisted = await this.blacklistService.isTokenBlacklisted(token);
            if (isBlacklisted) {
                return res.status(401).json({ 
                    error: 'Token revocado',
                    code: 'TOKEN_REVOKED'
                });
            }

            // Verificar que el usuario aún existe y está activo
            const usuario = await models.Usuarios.findOne({
                where: {
                    id_usuario: decoded.id_usuario,
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
                return res.status(401).json({ 
                    error: 'Usuario no encontrado o inactivo',
                    code: 'USER_NOT_FOUND'
                });
            }

            // Agregar información del usuario al request
            req.user = {
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                tipo_usuario: usuario.tipo_usuario,
                empleado: usuario.empleado,
                tipo_usuario_info: usuario.tipo_usuario_info,
                empleado_info: usuario.empleado_info
            };

            // Agregar el token al request para posible invalidación
            req.token = token;

            next();

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    error: 'Token inválido',
                    code: 'INVALID_TOKEN'
                });
            }
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expirado',
                    code: 'TOKEN_EXPIRED'
                });
            }

            console.error('Error en middleware de autenticación:', error);
            return res.status(500).json({ 
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    };

    // Middleware para verificar roles/permisos específicos
    requireRole = (rolesPermitidos) => {
        return async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ 
                        error: 'Usuario no autenticado',
                        code: 'NOT_AUTHENTICATED'
                    });
                }

                // Si rolesPermitidos es un array, verificar si el rol del usuario está incluido
                if (Array.isArray(rolesPermitidos)) {
                    if (!rolesPermitidos.includes(req.user.tipo_usuario)) {
                        return res.status(403).json({ 
                            error: 'No tienes permisos para acceder a este recurso',
                            code: 'INSUFFICIENT_PERMISSIONS'
                        });
                    }
                } else {
                    // Si es un solo rol
                    if (req.user.tipo_usuario !== rolesPermitidos) {
                        return res.status(403).json({ 
                            error: 'No tienes permisos para acceder a este recurso',
                            code: 'INSUFFICIENT_PERMISSIONS'
                        });
                    }
                }

                next();

            } catch (error) {
                console.error('Error en middleware de roles:', error);
                return res.status(500).json({ 
                    error: 'Error interno del servidor',
                    code: 'INTERNAL_ERROR'
                });
            }
        };
    };

    // Middleware para verificar que el usuario solo puede acceder a sus propios datos
    requireOwnership = (paramName = 'id') => {
        return async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ 
                        error: 'Usuario no autenticado',
                        code: 'NOT_AUTHENTICATED'
                    });
                }

                const resourceId = req.params[paramName];
                
                // Si el usuario es admin (tipo_usuario = 1), puede acceder a todo
                if (req.user.tipo_usuario === 1) {
                    return next();
                }

                // Verificar si el recurso pertenece al usuario
                if (parseInt(resourceId) !== req.user.empleado) {
                    return res.status(403).json({ 
                        error: 'No tienes permisos para acceder a este recurso',
                        code: 'RESOURCE_NOT_OWNED'
                    });
                }

                next();

            } catch (error) {
                console.error('Error en middleware de ownership:', error);
                return res.status(500).json({ 
                    error: 'Error interno del servidor',
                    code: 'INTERNAL_ERROR'
                });
            }
        };
    };

    // Middleware opcional - no falla si no hay token
    optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                req.user = null;
                return next();
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, this.jwtSecret);

            const usuario = await models.Usuarios.findOne({
                where: {
                    id_usuario: decoded.id_usuario,
                    estado: true
                }
            });

            req.user = usuario ? {
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                tipo_usuario: usuario.tipo_usuario,
                empleado: usuario.empleado
            } : null;

            next();

        } catch (error) {
            // En caso de error, continuar sin usuario autenticado
            req.user = null;
            next();
        }
    };
}

export default AuthMiddleware;
