import dotenv from 'dotenv';
import { sequelize } from '../db/config.js';
import TokenBlacklistService from '../services/token-blacklist.service.js';

// Cargar variables de entorno
dotenv.config();

const blacklistService = new TokenBlacklistService();

async function cleanupExpiredTokens() {
    try {
        console.log('🧹 Iniciando limpieza de tokens expirados...');
        
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Limpiar tokens expirados
        const resultado = await blacklistService.cleanupExpiredTokens();
        
        console.log(`✅ Limpieza completada: ${resultado.deletedCount} tokens expirados eliminados`);
        
        // Obtener estadísticas actualizadas
        const stats = await blacklistService.getBlacklistStats();
        console.log('📊 Estadísticas actuales de la blacklist:');
        console.log(`   - Total tokens invalidados: ${stats.total}`);
        console.log(`   - Tokens activos (no expirados): ${stats.active}`);
        console.log(`   - Tokens expirados: ${stats.expired}`);
        
        if (stats.byReason && stats.byReason.length > 0) {
            console.log('   - Por razón:');
            stats.byReason.forEach(reason => {
                console.log(`     * ${reason.razon || 'sin razón'}: ${reason.count}`);
            });
        }

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada');
        process.exit(0);
    }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    cleanupExpiredTokens();
}

export default cleanupExpiredTokens;
