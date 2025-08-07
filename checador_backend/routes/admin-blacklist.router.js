import express from 'express';
import TokenBlacklistService from '../services/token-blacklist.service.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const blacklistService = new TokenBlacklistService();
const authMiddleware = new AuthMiddleware();

// Aplicar autenticación y verificar que sea admin
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.requireRole(1));

// GET /admin/blacklist/stats - Obtener estadísticas de la blacklist
router.get('/stats', async (req, res) => {
    try {
        const stats = await blacklistService.getBlacklistStats();
        res.status(200).json({
            message: 'Estadísticas obtenidas exitosamente',
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/blacklist/cleanup - Limpiar tokens expirados
router.post('/cleanup', async (req, res) => {
    try {
        const resultado = await blacklistService.cleanupExpiredTokens();
        res.status(200).json({
            message: resultado.message,
            data: { deletedCount: resultado.deletedCount }
        });
    } catch (error) {
        console.error('Error en limpieza:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /admin/blacklist/user/:id - Obtener tokens invalidados de un usuario
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 10 } = req.query;
        
        const tokens = await blacklistService.getUserInvalidatedTokens(parseInt(id), parseInt(limit));
        res.status(200).json({
            message: 'Tokens invalidados obtenidos exitosamente',
            data: tokens
        });
    } catch (error) {
        console.error('Error al obtener tokens del usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/blacklist/invalidate - Invalidar un token específico
router.post('/invalidate', async (req, res) => {
    try {
        const { token, razon = 'admin_revoke' } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'Token es requerido'
            });
        }

        const resultado = await blacklistService.invalidateToken(token, razon);
        res.status(200).json({
            message: resultado.message,
            data: { wasAlreadyInvalid: resultado.wasAlreadyInvalid }
        });
    } catch (error) {
        console.error('Error al invalidar token:', error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
