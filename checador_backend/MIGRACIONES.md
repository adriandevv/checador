# Guía de Migraciones de Sequelize

## Comandos disponibles

### Comandos de Migración

```bash
# Ver el estado de las migraciones
pnpm run migrate:status

# Crear una nueva migración
pnpm run migrate:create nombre-de-la-migracion

# Generar todas las migraciones automáticamente
pnpm run migrate:generate-all

# Ejecutar todas las migraciones pendientes
pnpm run migrate:up

# Deshacer la última migración
pnpm run migrate:down

# Deshacer todas las migraciones
pnpm run migrate:down:all
```

### Comandos de Seeders

```bash
# Crear un nuevo seeder
pnpm run seed:create nombre-del-seeder

# Ejecutar todos los seeders
pnpm run seed:run

# Deshacer el último seeder
pnpm run seed:undo

# Deshacer todos los seeders
pnpm run seed:undo:all
```

## Orden de Ejecución de Migraciones

Para evitar errores de claves foráneas, las migraciones deben ejecutarse en este orden:

1. `tipo_usuarios`
2. `empleados` 
3. `coordenadas`
4. `usuarios` (requiere tipo_usuarios y empleados)
5. `zonas` (requiere coordenadas y empleados)
6. `imagenes` (requiere empleados)
7. `huellas` (requiere empleados)
8. `dispositivos` (requiere empleados)
9. `registros` (requiere zonas, imagenes, dispositivos y empleados)
10. `turnos` (requiere empleados)
11. `cuerpo_alertas`
12. `alertas_especificas` (requiere cuerpo_alertas, empleados y registros)
13. `alertas_generales` (requiere cuerpo_alertas)
14. `direccion` (requiere coordenadas)
15. `permisos` (requiere usuarios)

## Pasos para configurar la base de datos

1. **Configurar variables de entorno**: Crea un archivo `.env` con:
   ```
   DB_NAME=tu_base_de_datos
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_PORT=3306
   ```

2. **Crear la base de datos**: 
   ```sql
   CREATE DATABASE tu_base_de_datos;
   ```

3. **Generar todas las migraciones**:
   ```bash
   pnpm run migrate:generate-all
   ```

4. **Editar las migraciones**: Usa el archivo `migration-templates.js` como referencia para completar cada migración.

5. **Ejecutar las migraciones**:
   ```bash
   pnpm run migrate:up
   ```

6. **Verificar el estado**:
   ```bash
   pnpm run migrate:status
   ```

## Estructura de archivos

```
checador_backend/
├── db/
│   ├── config.js                 # Configuración de Sequelize para modelos
│   ├── sequelize-config.js       # Configuración para migraciones/seeders
│   ├── models/                   # Modelos de Sequelize
│   ├── migrations/               # Archivos de migración
│   │   ├── migration-templates.js # Plantillas de todas las tablas
│   │   └── [timestamp]-[nombre].js
│   └── seeders/                  # Datos de prueba
├── scripts/
│   └── generate-migrations.js    # Script para generar todas las migraciones
└── .sequelizerc                  # Configuración de rutas de Sequelize CLI
```

## Notas importantes

- Las migraciones se ejecutan en orden cronológico según el timestamp
- Cada migración debe tener su correspondiente función `down` para poder deshacerla
- Usa `references` para definir claves foráneas en las migraciones
- Los modelos y las migraciones deben estar sincronizados
- Siempre verifica el estado de las migraciones antes de hacer cambios en producción
