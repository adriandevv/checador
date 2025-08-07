import express from 'express';
import EmpleadosService from '../services/empleados.service.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const service = new EmpleadosService();
const authMiddleware = new AuthMiddleware();

// Aplicar autenticación a todas las rutas de empleados
router.use(authMiddleware.verifyToken);

router.get('/', async (req, res) => {
try {
    const empleados = await service.getAllEmpleados();
    res.status(200).json(empleados);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const empleado = await service.getEmpleadoById(id);
        if (empleado) {
            res.status(200).json(empleado);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST - Solo admin puede crear empleados
router.post('/', authMiddleware.requireRole(1), async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno } = req.body;
    try {
        const nuevoEmpleado = await service.createEmpleado({ nombre:nombre, apep: apellido_paterno, apem: apellido_materno });
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Solo admin puede actualizar empleados
router.put('/:id', authMiddleware.requireRole(1), async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno } = req.body;

    try {
        const empleadoActualizado = await service.updateEmpleado(id, { nombre, apep: apellido_paterno, apem: apellido_materno });
        if (empleadoActualizado) {
            res.status(200).json(empleadoActualizado);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// DELETE - Solo admin puede eliminar empleados
router.delete('/:id', authMiddleware.requireRole(1), async (req, res) => {
    const { id } = req.params;
    try {
       const result = await service.deleteEmpleado(id);

        if (!result) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;