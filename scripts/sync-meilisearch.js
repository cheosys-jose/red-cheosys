const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'http://localhost:7700';
const MEILISEARCH_KEY = process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me';

async function syncMeilisearch() {
  console.log('🔄 Iniciando sincronización de Meilisearch...\n');

  // 1. Leer todos los JSONs
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('backup'));
  console.log(`📁 Encontrados ${files.length} archivos JSON`);

  let allRecords = [];
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`  - ${file}: ${data.length} registros`);
    allRecords = allRecords.concat(data);
  });

  console.log(`\n📊 Total de registros: ${allRecords.length}`);

  // 2. Limpiar Meilisearch
  console.log('\n🗑️  Limpiando Meilisearch...');
  const deleteResponse = await fetch(`${MEILISEARCH_URL}/indexes/records/documents`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${MEILISEARCH_KEY}`
    }
  });
  console.log('  ✓ Meilisearch limpiado');

  // 3. Esperar a que se complete la eliminación
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Indexar todos los registros
  console.log('\n📤 Indexando registros en Meilisearch...');
  const indexResponse = await fetch(`${MEILISEARCH_URL}/indexes/records/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MEILISEARCH_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(allRecords)
  });

  const result = await indexResponse.json();
  console.log(`  ✓ Tarea encolada: ${result.taskUid}`);

  // 5. Verificar
  await new Promise(resolve => setTimeout(resolve, 2000));
  const searchResponse = await fetch(`${MEILISEARCH_URL}/indexes/records/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MEILISEARCH_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: '' })
  });

  const searchResult = await searchResponse.json();
  console.log(`\n✅ Sincronización completa!`);
  console.log(`   Registros en Meilisearch: ${searchResult.estimatedTotalHits}`);
}

syncMeilisearch().catch(console.error);
