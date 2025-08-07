import express from 'express';
import AuthService from '../services/auth.service.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const authService = new AuthService();
const authMiddleware = new AuthMiddleware();

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        // Validaciones básicas
        if (!correo || !contraseña) {
            return res.status(400).json({
                error: 'Correo y contraseña son requeridos'
            });
        }

        const resultado = await authService.login(correo, contraseña);
        
        res.status(200).json({
            message: 'Login exitoso',
            data: resultado
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(401).json({
            error: error.message
        });
    }
});

// Ruta para registro (solo para admins)
router.post('/register', authMiddleware.verifyToken, authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { correo, contraseña, tipo_usuario, empleado } = req.body;

        // Validaciones básicas
        if (!correo || !contraseña || !tipo_usuario || !empleado) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos: correo, contraseña, tipo_usuario, empleado'
            });
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                error: 'Formato de correo inválido'
            });
        }

        // Validar longitud de contraseña
        if (contraseña.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const nuevoUsuario = await authService.register({
            correo,
            contraseña,
            tipo_usuario,
            empleado
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            data: nuevoUsuario
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(400).json({
            error: error.message
        });
    }
});

// Ruta para refrescar token
router.post('/refresh-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token requerido'
            });
        }

        const token = authHeader.split(' ')[1];
        const resultado = await authService.refreshToken(token);

        res.status(200).json({
            message: 'Token refrescado exitosamente',
            data: resultado
        });

    } catch (error) {
        console.error('Error al refrescar token:', error);
        res.status(401).json({
            error: error.message
        });
    }
});

// Ruta para cambiar contraseña
router.put('/change-password', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { contraseñaActual, nuevaContraseña } = req.body;

        // Validaciones básicas
        if (!contraseñaActual || !nuevaContraseña) {
            return res.status(400).json({
                error: 'Contraseña actual y nueva contraseña son requeridas'
            });
        }

        // Validar longitud de nueva contraseña
        if (nuevaContraseña.length < 6) {
            return res.status(400).json({
                error: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        const resultado = await authService.changePassword(
            req.user.id_usuario,
            contraseñaActual,
            nuevaContraseña
        );

        res.status(200).json({
            message: resultado.message
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(400).json({
            error: error.message
        });
    }
});

// Ruta para verificar token (útil para frontend)
router.get('/verify-token', authMiddleware.verifyToken, async (req, res) => {
    try {
        res.status(200).json({
            message: 'Token válido',
            data: {
                usuario: req.user
            }
        });
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(401).json({
            error: 'Token inválido'
        });
    }
});

// Ruta para logout real (invalida el token)
router.post('/logout', authMiddleware.verifyToken, async (req, res) => {
    try {
        const resultado = await authService.logout(req.token);
        res.status(200).json({
            message: resultado.message
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            error: error.message || 'Error interno del servidor'
        });
    }
});

// Ruta para logout de todos los dispositivos
router.post('/logout-all', authMiddleware.verifyToken, async (req, res) => {
    try {
        const resultado = await authService.logoutAllDevices(req.user.id_usuario);
        res.status(200).json({
            message: resultado.message
        });
    } catch (error) {
        console.error('Error en logout-all:', error);
        res.status(500).json({
            error: error.message || 'Error interno del servidor'
        });
    }
});

// Ruta para revocar tokens de un usuario (solo admin)
router.post('/revoke-user-tokens', authMiddleware.verifyToken, authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { usuario_id, razon } = req.body;

        if (!usuario_id) {
            return res.status(400).json({
                error: 'ID de usuario es requerido'
            });
        }

        const resultado = await authService.revokeUserTokens(usuario_id, razon || 'admin_revoke');
        res.status(200).json({
            message: resultado.message
        });
    } catch (error) {
        console.error('Error al revocar tokens:', error);
        res.status(400).json({
            error: error.message
        });
    }
});

// Ruta para obtener perfil del usuario autenticado
router.get('/profile', authMiddleware.verifyToken, async (req, res) => {
    try {
        res.status(200).json({
            message: 'Perfil obtenido exitosamente',
            data: {
                usuario: req.user
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

export default router;
