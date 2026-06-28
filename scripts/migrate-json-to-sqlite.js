const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/red-cheosys.db');
const dataDir = path.join(__dirname, '../data');

const db = new sqlite3.Database(dbPath);

// Crear tabla
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    texto_ubicacion TEXT,
    ciudad TEXT,
    estado TEXT,
    pais TEXT DEFAULT 'Venezuela',
    lat REAL,
    lng REAL,
    geo_precision TEXT,
    contacto_tipo TEXT,
    contacto_valor TEXT,
    tags TEXT,
    prioridad TEXT DEFAULT 'media',
    creado TEXT NOT NULL,
    actualizado TEXT NOT NULL,
    expira TEXT,
    votos_confianza INTEGER DEFAULT 0,
    verificado INTEGER DEFAULT 0,
    estado_moderacion TEXT DEFAULT 'pendiente',
    ip_hash TEXT
  )`);
});

// Migrar JSON files
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'centros.json');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.forEach(record => {
    db.run(
      `INSERT OR IGNORE INTO records (id, tipo, titulo, descripcion, texto_ubicacion, ciudad, contacto_valor, creado, actualizado, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.tipo || 'necesita',
        record.tipo || 'Necesidad',
        record.descripcion || '',
        record.ubicacion || '',
        '', // ciudad
        record.contacto || '',
        record.timestamp,
        record.timestamp,
        record.ip_hash || ''
      ]
    );
  });
  
  console.log(`Migrado: ${file} (${data.length} records)`);
});

db.close();
console.log('Migración completada');
