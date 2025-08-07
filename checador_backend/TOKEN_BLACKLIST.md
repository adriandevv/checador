# 🚫 Sistema de Invalidación de Tokens JWT - Blacklist

## 📋 Descripción

Este sistema implementa una **blacklist (lista negra)** para tokens JWT, permitiendo invalidar tokens específicos de forma segura. Esto es útil para:

- **Logout real**: Invalidar token al cerrar sesión
- **Seguridad**: Revocar tokens comprometidos
- **Cambio de contraseña**: Invalidar todos los tokens existentes
- **Administración**: Revocar acceso de usuarios específicos

## 🔧 Componentes

### 1. **Modelo TokensInvalidados**
- Almacena tokens invalidados en la base de datos
- Incluye hash del token y JTI (JWT ID) para identificación única
- Registra razón de invalidación y fecha de expiración

### 2. **TokenBlacklistService**
- `invalidateToken()`: Invalidar token específico
- `isTokenBlacklisted()`: Verificar si token está invalidado
- `cleanupExpiredTokens()`: Limpiar tokens expirados
- `getBlacklistStats()`: Obtener estadísticas

### 3. **Nuevas Rutas de Autenticación**

#### POST /api/v1/auth/logout
Logout real que invalida el token actual.
```bash
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

#### POST /api/v1/auth/logout-all
Cierra sesión en todos los dispositivos del usuario.
```bash
POST /api/v1/auth/logout-all
Authorization: Bearer <token>
```

#### POST /api/v1/auth/revoke-user-tokens
Revoca todos los tokens de un usuario (solo admin).
```bash
POST /api/v1/auth/revoke-user-tokens
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "usuario_id": 123,
  "razon": "cuenta_comprometida"
}
```

### 4. **Rutas Administrativas**

#### GET /api/v1/admin/blacklist/stats
Obtiene estadísticas de la blacklist.
```bash
GET /api/v1/admin/blacklist/stats
Authorization: Bearer <admin_token>
```

**Respuesta:**
```json
{
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 150,
    "active": 45,
    "expired": 105,
    "byReason": [
      { "razon": "logout", "count": 80 },
      { "razon": "password_change", "count": 35 },
      { "razon": "admin_revoke", "count": 35 }
    ]
  }
}
```

#### POST /api/v1/admin/blacklist/cleanup
Limpia tokens expirados de la blacklist.
```bash
POST /api/v1/admin/blacklist/cleanup
Authorization: Bearer <admin_token>
```

#### GET /api/v1/admin/blacklist/user/:id
Obtiene tokens invalidados de un usuario específico.
```bash
GET /api/v1/admin/blacklist/user/123?limit=20
Authorization: Bearer <admin_token>
```

#### POST /api/v1/admin/blacklist/invalidate
Invalida un token específico (para emergencias).
```bash
POST /api/v1/admin/blacklist/invalidate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "razon": "token_comprometido"
}
```

## 🚀 Configuración

### 1. **Ejecutar Migración**
```bash
pnpm run migrate:up
```

### 2. **Script de Limpieza Automática**
```bash
# Ejecutar manualmente
pnpm run cleanup-tokens

# Para programar ejecución automática (cron)
# Agregar a crontab: 0 2 * * * cd /path/to/project && pnpm run cleanup-tokens
```

## 🔒 Mejoras de Seguridad

### **Tokens con JTI**
Todos los tokens ahora incluyen un **JTI (JWT ID)** único para identificación:

```json
{
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "id_usuario": 1,
  "correo": "usuario@ejemplo.com",
  "tipo_usuario": 1,
  "empleado": 1,
  "iat": 1642694400,
  "exp": 1642780800
}
```

### **Verificación en Middleware**
El middleware de autenticación ahora verifica:
1. ✅ Firma del token
2. ✅ Fecha de expiración
3. ✅ **Blacklist (nuevo)**
4. ✅ Usuario activo

### **Invalidación Automática**
- **Cambio de contraseña**: Invalida todos los tokens del usuario
- **Refresh token**: Invalida el token anterior
- **Logout**: Invalida el token específico

## 📊 Razones de Invalidación

| Razón | Descripción |
|-------|-------------|
| `logout` | Usuario cerró sesión normalmente |
| `logout_all` | Usuario cerró sesión en todos los dispositivos |
| `password_change` | Contraseña fue cambiada |
| `refresh` | Token fue refrescado |
| `admin_revoke` | Administrador revocó el token |
| `account_suspended` | Cuenta suspendida |
| `security_breach` | Brecha de seguridad detectada |

## 🔧 Códigos de Error Nuevos

- `TOKEN_REVOKED`: Token está en la blacklist
- `BLACKLIST_ERROR`: Error al verificar blacklist

## ⚡ Rendimiento

### **Optimizaciones Implementadas**
- Índices en base de datos para consultas rápidas
- Hash SHA-256 para comparación eficiente de tokens
- Limpieza automática de tokens expirados
- Consultas optimizadas con JTI

### **Recomendaciones**
- Ejecutar limpieza de tokens diariamente
- Monitorear tamaño de la blacklist
- Configurar alertas para tokens revocados en masa

## 🧪 Casos de Uso

### **1. Usuario Normal**
```javascript
// Login
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo: 'user@example.com', contraseña: 'password' })
});

const { token } = loginResponse.data;

// Usar token en requests
fetch('/api/v1/empleados', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Logout real
await fetch('/api/v1/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
// Token ahora está invalidado
```

### **2. Administrador**
```javascript
// Revocar todos los tokens de un usuario
await fetch('/api/v1/auth/revoke-user-tokens', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    usuario_id: 123, 
    razon: 'cuenta_comprometida' 
  })
});

// Ver estadísticas
const stats = await fetch('/api/v1/admin/blacklist/stats', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
```

## 📈 Métricas de Monitoreo

Estadísticas disponibles para monitoreo:
- **Total de tokens invalidados**
- **Tokens activos vs expirados**
- **Distribución por razón de invalidación**
- **Tokens por usuario**
- **Tasa de invalidación por día**

## 🔄 Migración de Sistemas Existentes

Si ya tienes tokens JWT en uso:
1. Los tokens existentes seguirán funcionando
2. Nuevos tokens incluirán JTI automáticamente
3. Puedes forzar refresh de todos los tokens si es necesario
4. La blacklist solo afecta tokens explícitamente invalidados

## ✅ Estado del Sistema

El sistema de blacklist está **completamente implementado** y listo para producción:

- ✅ Modelo de base de datos creado
- ✅ Migración lista para ejecutar
- ✅ Servicios implementados
- ✅ Middlewares actualizados
- ✅ Rutas de API disponibles
- ✅ Scripts de mantenimiento
- ✅ Documentación completa

**Próximos pasos:**
1. Ejecutar migración: `pnpm run migrate:up`
2. Probar endpoints de invalidación
3. Configurar limpieza automática
4. Monitorear métricas en producción
