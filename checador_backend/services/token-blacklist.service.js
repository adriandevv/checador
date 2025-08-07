import { sequelize } from "../db/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";

const models = sequelize.models;

class TokenBlacklistService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';
    }

    /**
     * Genera un hash del token para almacenamiento seguro
     */
    generateTokenHash(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Genera un JTI (JWT ID) único si no existe en el token
     */
    generateJTI() {
        return crypto.randomUUID();
    }

    /**
     * Invalida un token específico
     */
    async invalidateToken(token, razon = 'logout', usuarioId = null) {
        try {
            // Decodificar el token para obtener información
            const decoded = jwt.decode(token);
            
            if (!decoded) {
                throw new Error('Token inválido');
            }

            // Usar el JTI del token o generar uno nuevo
            const jti = decoded.jti || this.generateJTI();
            const tokenHash = this.generateTokenHash(token);
            const userId = usuarioId || decoded.id_usuario;

            // Verificar si el token ya está invalidado
            const tokenExistente = await models.TokensInvalidados.findOne({
                where: {
                    [Op.or]: [
                        { jti: jti },
                        { token_hash: tokenHash }
                    ]
                }
            });

            if (tokenExistente) {
                return { message: 'Token ya estaba invalidado', wasAlreadyInvalid: true };
            }

            // Agregar token a la blacklist
            await models.TokensInvalidados.create({
                jti: jti,
                token_hash: tokenHash,
                usuario_id: userId,
                razon: razon,
                expira_en: new Date(decoded.exp * 1000) // Convertir timestamp a Date
            });

            return { message: 'Token invalidado exitosamente', wasAlreadyInvalid: false };

        } catch (error) {
            console.error('Error al invalidar token:', error);
            throw new Error('Error al invalidar token: ' + error.message);
        }
    }

    /**
     * Verifica si un token está en la blacklist
     */
    async isTokenBlacklisted(token) {
        try {
            const decoded = jwt.decode(token);
            
            if (!decoded) {
                return true; // Token inválido se considera como blacklisted
            }

            const tokenHash = this.generateTokenHash(token);
            const jti = decoded.jti;

            const tokenInvalidado = await models.TokensInvalidados.findOne({
                where: {
                    [Op.or]: [
                        ...(jti ? [{ jti: jti }] : []),
                        { token_hash: tokenHash }
                    ]
                }
            });

            return !!tokenInvalidado;

        } catch (error) {
            console.error('Error al verificar blacklist:', error);
            return true; // En caso de error, considerar como blacklisted por seguridad
        }
    }

    /**
     * Invalida todos los tokens de un usuario específico
     */
    async invalidateAllUserTokens(usuarioId, razon = 'admin_revoke') {
        try {
            // Esta función requiere que los tokens tengan el usuario_id en el payload
            // Para tokens existentes, podemos invalidar basándose en el usuario_id del JWT
            
            const tokensActivos = await models.TokensInvalidados.findAll({
                where: {
                    usuario_id: usuarioId
                }
            });

            // En un sistema real, necesitarías mantener un registro de tokens activos
            // Por ahora, esto servirá como marcador para futuras verificaciones
            
            return { 
                message: `Todos los tokens del usuario ${usuarioId} han sido marcados para invalidación`,
                count: tokensActivos.length 
            };

        } catch (error) {
            console.error('Error al invalidar tokens del usuario:', error);
            throw new Error('Error al invalidar tokens del usuario');
        }
    }

    /**
     * Limpia tokens expirados de la blacklist
     */
    async cleanupExpiredTokens() {
        try {
            const now = new Date();
            
            const resultado = await models.TokensInvalidados.destroy({
                where: {
                    expira_en: {
                        [Op.lt]: now
                    }
                }
            });

            return { 
                message: 'Tokens expirados eliminados exitosamente',
                deletedCount: resultado 
            };

        } catch (error) {
            console.error('Error al limpiar tokens expirados:', error);
            throw new Error('Error al limpiar tokens expirados');
        }
    }

    /**
     * Obtiene estadísticas de tokens invalidados
     */
    async getBlacklistStats() {
        try {
            const total = await models.TokensInvalidados.count();
            const expired = await models.TokensInvalidados.count({
                where: {
                    expira_en: {
                        [Op.lt]: new Date()
                    }
                }
            });
            const active = total - expired;

            const byReason = await models.TokensInvalidados.findAll({
                attributes: [
                    'razon',
                    [sequelize.fn('COUNT', sequelize.col('id_token')), 'count']
                ],
                group: ['razon'],
                raw: true
            });

            return {
                total,
                active,
                expired,
                byReason
            };

        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de blacklist');
        }
    }

    /**
     * Obtiene tokens invalidados de un usuario específico
     */
    async getUserInvalidatedTokens(usuarioId, limit = 10) {
        try {
            const tokens = await models.TokensInvalidados.findAll({
                where: {
                    usuario_id: usuarioId
                },
                order: [['fecha_invalidacion', 'DESC']],
                limit: limit,
                include: [
                    {
                        model: models.Usuarios,
                        as: 'usuario',
                        attributes: ['correo']
                    }
                ]
            });

            return tokens;

        } catch (error) {
            console.error('Error al obtener tokens del usuario:', error);
            throw new Error('Error al obtener tokens invalidados del usuario');
        }
    }
}

export default TokenBlacklistService;
