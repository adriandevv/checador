// Middleware para manejo de errores globales
const errorHandler = (err, req, res, next) => {
    console.error('Error capturado por el middleware:', err);

    // Error de validación de Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({
            error: 'Error de validación',
            details: errors
        });
    }

    // Error de constraint único de Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'El recurso ya existe',
            details: err.errors.map(error => ({
                field: error.path,
                message: `${error.path} ya está en uso`
            }))
        });
    }

    // Error de clave foránea de Sequelize
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: 'Error de referencia',
            message: 'La referencia especificada no existe'
        });
    }

    // Error de conexión a la base de datos
    if (err.name === 'SequelizeConnectionError') {
        return res.status(503).json({
            error: 'Error de conexión a la base de datos',
            message: 'El servicio no está disponible temporalmente'
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            code: 'INVALID_TOKEN'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expirado',
            code: 'TOKEN_EXPIRED'
        });
    }

    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'JSON inválido',
            message: 'El formato del JSON en el body es incorrecto'
        });
    }

    // Error personalizado con status
    if (err.status) {
        return res.status(err.status).json({
            error: err.message || 'Error del servidor'
        });
    }

    // Error genérico del servidor
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.path} no existe`,
        suggestion: 'Verifica la URL y el método HTTP'
    });
};

export { errorHandler, notFoundHandler };
