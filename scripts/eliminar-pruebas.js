const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const today = new Date().toISOString().split('T')[0];
const filePath = path.join(dataDir, `${today}.json`);

// Leer datos
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Filtrar registros - mantener solo los reales
const originales = data.filter(record => {
  // Eliminar si es de prueba
  const esPrueba = 
    (record.descripcion && /test|prueba|qwerty|sdf/i.test(record.descripcion)) ||
    (record.contacto && /^123$|^123456$|test@test/.test(record.contacto)) ||
    (record.nombre && /Cheosys Prueba|Mensaje Cheosys/i.test(record.nombre));
  
  if (esPrueba) {
    console.log(`❌ Eliminando: ${record.id} - ${record.nombre || 'Sin nombre'}`);
  }
  
  return !esPrueba;
});

console.log(`\n📊 Resumen:`);
console.log(`  - Total original: ${data.length}`);
console.log(`  - Eliminados: ${data.length - originales.length}`);
console.log(`  - Conservados: ${originales.length}`);

// Guardar
fs.writeFileSync(filePath, JSON.stringify(originales, null, 2));
console.log(`\n✅ Archivo actualizado: ${filePath}`);
