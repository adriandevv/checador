#!/usr/bin/env node

// Script para generar todas las migraciones de la base de datos
const { execSync } = require('child_process');

const migrations = [
  'create-tipo-usuarios-table',
  'create-empleados-table', 
  'create-coordenadas-table',
  'create-usuarios-table',
  'create-zonas-table',
  'create-imagenes-table',
  'create-huellas-table',
  'create-dispositivos-table',
  'create-registros-table',
  'create-turnos-table',
  'create-cuerpo-alertas-table',
  'create-alertas-especificas-table',
  'create-alertas-generales-table',
  'create-direccion-table',
  'create-permisos-table'
];

console.log('Generando migraciones para todas las tablas...\n');

migrations.forEach((migration, index) => {
  try {
    console.log(`${index + 1}. Generando migración: ${migration}`);
    execSync(`pnpm run migrate:create ${migration}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } catch (error) {
    console.error(`Error generando migración ${migration}:`, error.message);
  }
});

console.log('\n✅ Todas las migraciones han sido generadas!');
console.log('\n📝 Próximos pasos:');
console.log('1. Edita cada archivo de migración en db/migrations/');
console.log('2. Ejecuta: pnpm run migrate:up para aplicar las migraciones');
console.log('3. Ejecuta: pnpm run migrate:status para ver el estado');
