# Sistema de Autenticación - Checador Backend

Este documento explica cómo usar el sistema de autenticación basado en JWT implementado en el proyecto.

## Configuración Inicial

### 1. Variables de Entorno
Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# JWT Configuration
JWT_SECRET=tu_secreto_super_seguro_aqui_cambialo_en_produccion
JWT_EXPIRATION=24h
```

### 2. Dependencias Instaladas
- `jsonwebtoken`: Para manejo de tokens JWT
- `bcryptjs`: Para encriptación de contraseñas

## Endpoints de Autenticación

### POST /api/v1/auth/login
Iniciar sesión con credenciales de usuario.

**Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "contraseña": "micontraseña"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": 1,
      "correo": "usuario@ejemplo.com",
      "tipo_usuario": {...},
      "empleado": {...}
    }
  }
}
```

### POST /api/v1/auth/register
Registrar un nuevo usuario (solo administradores).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "correo": "nuevo@ejemplo.com",
  "contraseña": "micontraseña",
  "tipo_usuario": 2,
  "empleado": 1
}
```

### POST /api/v1/auth/refresh-token
Refrescar token existente.

**Headers:**
```
Authorization: Bearer <token>
```

### PUT /api/v1/auth/change-password
Cambiar contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "contraseñaActual": "contraseñaVieja",
  "nuevaContraseña": "contraseñaNueva"
}
```

### GET /api/v1/auth/verify-token
Verificar si un token es válido.

**Headers:**
```
Authorization: Bearer <token>
```

### GET /api/v1/auth/profile
Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

### POST /api/v1/auth/logout
Cerrar sesión (opcional - el frontend puede eliminar el token).

**Headers:**
```
Authorization: Bearer <token>
```

## Endpoints de Usuarios

### GET /api/v1/usuarios
Obtener todos los usuarios (solo administradores).

### GET /api/v1/usuarios/:id
Obtener usuario por ID (admin o el mismo usuario).

### POST /api/v1/usuarios
Crear nuevo usuario (solo administradores).

### PUT /api/v1/usuarios/:id
Actualizar usuario (admin o el mismo usuario).

### DELETE /api/v1/usuarios/:id
Desactivar usuario (solo administradores).

### PUT /api/v1/usuarios/:id/activate
Activar usuario (solo administradores).

### GET /api/v1/usuarios/search?q=termino
Buscar usuarios (solo administradores).

### GET /api/v1/usuarios/tipo/:tipo
Obtener usuarios por tipo (solo administradores).

## Middlewares de Autenticación

### 1. verifyToken
Verifica que el token JWT sea válido y agrega la información del usuario al request.

```javascript
import AuthMiddleware from '../middlewares/auth.middleware.js';
const authMiddleware = new AuthMiddleware();

router.use(authMiddleware.verifyToken);
```

### 2. requireRole
Verifica que el usuario tenga un rol específico.

```javascript
// Solo administradores (tipo_usuario = 1)
router.post('/', authMiddleware.requireRole(1), handler);

// Múltiples roles
router.get('/', authMiddleware.requireRole([1, 2]), handler);
```

### 3. requireOwnership
Verifica que el usuario solo pueda acceder a sus propios recursos.

```javascript
// El usuario solo puede acceder si el ID coincide con su empleado
router.get('/:id', authMiddleware.requireOwnership('id'), handler);
```

### 4. optionalAuth
Autenticación opcional - no falla si no hay token.

```javascript
router.get('/', authMiddleware.optionalAuth, handler);
```

## Tipos de Usuario

- **1**: Administrador - Acceso completo
- **2**: Usuario regular - Acceso limitado

## Estructura del Token JWT

El token contiene la siguiente información:

```json
{
  "id_usuario": 1,
  "correo": "usuario@ejemplo.com",
  "tipo_usuario": 1,
  "empleado": 1,
  "iat": 1642694400,
  "exp": 1642780800
}
```

## Uso en el Frontend

### 1. Almacenar Token
```javascript
// Después del login exitoso
localStorage.setItem('token', data.token);
```

### 2. Enviar Token en Requests
```javascript
const token = localStorage.getItem('token');

fetch('/api/v1/empleados', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Verificar Autenticación
```javascript
const isAuthenticated = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await fetch('/api/v1/auth/verify-token', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  } catch {
    return false;
  }
};
```

### 4. Logout
```javascript
const logout = () => {
  localStorage.removeItem('token');
  // Redirigir al login
};
```

## Códigos de Error

- `NO_TOKEN`: No se proporcionó token
- `INVALID_TOKEN_FORMAT`: Formato de token inválido
- `INVALID_TOKEN`: Token inválido
- `TOKEN_EXPIRED`: Token expirado
- `USER_NOT_FOUND`: Usuario no encontrado
- `NOT_AUTHENTICATED`: Usuario no autenticado
- `INSUFFICIENT_PERMISSIONS`: Sin permisos suficientes
- `RESOURCE_NOT_OWNED`: Recurso no pertenece al usuario

## Seguridad

### Buenas Prácticas Implementadas:
1. Contraseñas encriptadas con bcrypt
2. Tokens JWT con expiración
3. Verificación de usuario activo en cada request
4. Control de acceso basado en roles
5. Validación de formato de correo
6. Longitud mínima de contraseña

### Recomendaciones:
1. Usar HTTPS en producción
2. Cambiar JWT_SECRET en producción
3. Implementar rate limiting
4. Logs de seguridad
5. Validación adicional de entrada

## Rutas Protegidas

Todas las rutas excepto `/auth/login` requieren autenticación:

- ✅ `/auth/login` - Público
- 🔒 `/auth/register` - Solo admin
- 🔒 `/auth/refresh-token` - Autenticado
- 🔒 `/auth/change-password` - Autenticado
- 🔒 `/auth/verify-token` - Autenticado
- 🔒 `/auth/profile` - Autenticado
- 🔒 `/auth/logout` - Autenticado
- 🔒 `/usuarios/*` - Autenticado (algunas solo admin)
- 🔒 `/empleados/*` - Autenticado (POST/PUT/DELETE solo admin)
