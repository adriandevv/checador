import express from 'express';
import UsuariosService from '../services/usuarios.service.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const service = new UsuariosService();
const authMiddleware = new AuthMiddleware();

// Aplicar autenticación a todas las rutas
router.use(authMiddleware.verifyToken);

// GET /usuarios - Solo admin puede ver todos los usuarios
router.get('/', authMiddleware.requireRole(1), async (req, res) => {
    try {
        const usuarios = await service.getAllUsuarios();
        res.status(200).json({
            message: 'Usuarios obtenidos exitosamente',
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /usuarios/search - Búsqueda de usuarios (solo admin)
router.get('/search', authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                error: 'Parámetro de búsqueda "q" es requerido'
            });
        }

        const usuarios = await service.searchUsuarios(q);
        res.status(200).json({
            message: 'Búsqueda realizada exitosamente',
            data: usuarios
        });
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /usuarios/tipo/:tipo - Obtener usuarios por tipo (solo admin)
router.get('/tipo/:tipo', authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { tipo } = req.params;
        const usuarios = await service.getUsuariosByTipo(parseInt(tipo));
        res.status(200).json({
            message: 'Usuarios por tipo obtenidos exitosamente',
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios por tipo:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /usuarios/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Solo admin puede ver cualquier usuario, otros solo pueden ver su propio perfil
        if (req.user.tipo_usuario !== 1 && parseInt(id) !== req.user.id_usuario) {
            return res.status(403).json({
                error: 'No tienes permisos para acceder a este recurso'
            });
        }

        const usuario = await service.getUsuarioById(id);
        if (usuario) {
            res.status(200).json({
                message: 'Usuario obtenido exitosamente',
                data: usuario
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /usuarios - Crear nuevo usuario (solo admin)
router.post('/', authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { correo, contraseña, tipo_usuario, empleado } = req.body;

        // Validaciones
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

        const nuevoUsuario = await service.createUsuario({
            correo,
            contraseña,
            tipo_usuario,
            empleado
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: nuevoUsuario
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({ error: error.message });
    }
});

// PUT /usuarios/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { correo, contraseña, tipo_usuario, empleado, estado } = req.body;

        // Solo admin puede actualizar cualquier usuario, otros solo pueden actualizar su propio perfil
        if (req.user.tipo_usuario !== 1 && parseInt(id) !== req.user.id_usuario) {
            return res.status(403).json({
                error: 'No tienes permisos para actualizar este usuario'
            });
        }

        // Los usuarios no admin no pueden cambiar tipo_usuario ni empleado
        const updateData = {};
        if (correo) updateData.correo = correo;
        if (contraseña) updateData.contraseña = contraseña;
        
        if (req.user.tipo_usuario === 1) {
            // Solo admin puede cambiar estos campos
            if (tipo_usuario) updateData.tipo_usuario = tipo_usuario;
            if (empleado) updateData.empleado = empleado;
            if (estado !== undefined) updateData.estado = estado;
        }

        // Validar formato de correo si se proporciona
        if (correo) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({
                    error: 'Formato de correo inválido'
                });
            }
        }

        // Validar longitud de contraseña si se proporciona
        if (contraseña && contraseña.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const usuarioActualizado = await service.updateUsuario(id, updateData);
        
        if (usuarioActualizado) {
            res.status(200).json({
                message: 'Usuario actualizado exitosamente',
                data: usuarioActualizado
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(400).json({ error: error.message });
    }
});

// DELETE /usuarios/:id - Desactivar usuario (solo admin)
router.delete('/:id', authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir que el admin se desactive a sí mismo
        if (parseInt(id) === req.user.id_usuario) {
            return res.status(400).json({
                error: 'No puedes desactivar tu propia cuenta'
            });
        }

        const result = await service.deleteUsuario(id);
        
        if (result) {
            res.status(200).json({
                message: result.message
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /usuarios/:id/activate - Activar usuario (solo admin)
router.put('/:id/activate', authMiddleware.requireRole(1), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.activateUsuario(id);
        
        if (result) {
            res.status(200).json({
                message: result.message
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al activar usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
