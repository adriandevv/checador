import { sequelize } from '../db/config.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const models = sequelize.models;

async function createAdminUser() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Verificar si ya existe un usuario administrador
        const adminExists = await models.Usuarios.findOne({
            where: { tipo_usuario: 1 }
        });

        if (adminExists) {
            console.log('Ya existe un usuario administrador en el sistema.');
            console.log(`Correo: ${adminExists.correo}`);
            return;
        }

        // Verificar que exista el tipo de usuario "Administrador"
        let tipoUsuarioAdmin = await models.TipoUsuarios.findOne({
            where: { id_tipo_usuario: 1 }
        });

        if (!tipoUsuarioAdmin) {
            console.log('Creando tipo de usuario Administrador...');
            tipoUsuarioAdmin = await models.TipoUsuarios.create({
                id_tipo_usuario: 1,
                nombre: 'Administrador',
                descripcion: 'Usuario con acceso completo al sistema'
            });
        }

        // Verificar que exista un empleado para asignar al admin
        let empleadoAdmin = await models.Empleados.findOne({
            where: { id_empleado: 1 }
        });

        if (!empleadoAdmin) {
            console.log('Creando empleado administrador...');
            empleadoAdmin = await models.Empleados.create({
                id_empleado: 1,
                nombre: 'Administrador',
                apep: 'Sistema',
                apem: '',
                estatus: true
            });
        }

        // Crear usuario administrador
        const adminEmail = 'admin@checador.com';
        const adminPassword = 'admin123';
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const adminUser = await models.Usuarios.create({
            correo: adminEmail,
            contraseña: hashedPassword,
            tipo_usuario: 1,
            empleado: empleadoAdmin.id_empleado,
            estado: true
        });

        console.log('✅ Usuario administrador creado exitosamente:');
        console.log(`   Correo: ${adminEmail}`);
        console.log(`   Contraseña: ${adminPassword}`);
        console.log(`   ID Usuario: ${adminUser.id_usuario}`);
        console.log('');
        console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login por seguridad.');

    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Ejecutar el script si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    createAdminUser()
        .then(() => {
            console.log('Script completado.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error en el script:', error);
            process.exit(1);
        });
}

export default createAdminUser;
