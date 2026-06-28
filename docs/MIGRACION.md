# Plan de Migración v0.1.0 → v0.2.0

**Fecha:** 2026-06-27
**Estado:** En progreso
**Riesgo:** Bajo (migración incremental)

## Estrategia
Migración **incremental** sin romper funcionalidad existente.

## Fase 1: Instalar Meilisearch (Día 1-2)

### 1.1 Instalar Meilisearch
```bash
# En el servidor
curl -L https://install.meilisearch.com | sh
./meilisearch --master-key=red-cheosys-2026-change-me --db-path /opt/cheosys/services/web/red-cheosys/data/meilisearch
```

### 1.2 Configurar como servicio systemd
```bash
sudo nano /etc/systemd/system/meilisearch.service
```

Contenido:
```ini
[Unit]
Description=Meilisearch
After=network.target

[Service]
Type=simple
User=cheo-admin-core
WorkingDirectory=/opt/cheosys/services/web/red-cheosys
ExecStart=/home/cheo-admin-core/meilisearch --master-key=red-cheosys-2026-change-me --db-path /opt/cheosys/services/web/red-cheosys/data/meilisearch
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable meilisearch
sudo systemctl start meilisearch
sudo systemctl status meilisearch
```

### 1.3 Verificar
```bash
curl http://localhost:7700/health
# Debe retornar: {"status":"available"}
```

### 1.4 Crear índices
```bash
# Usar Postman o curl
curl -X POST 'http://localhost:7700/indexes' \
  -H 'Authorization: Bearer red-cheosys-2026-change-me' \
  -H 'Content-Type: application/json' \
  --data-binary '{ "uid": "records", "primaryKey": "id" }'
```

## Fase 2: Migrar Datos a SQLite (Día 2-3)

### 2.1 Instalar SQLite
```bash
sudo apt-get install sqlite3 libsqlite3-dev
```

### 2.2 Crear schema
```bash
sqlite3 /opt/cheosys/services/web/red-cheosys/data/red-cheosys.db << 'SQL'
CREATE TABLE IF NOT EXISTS records (
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
);

CREATE INDEX IF NOT EXISTS idx_tipo ON records(tipo);
CREATE INDEX IF NOT EXISTS idx_ciudad ON records(ciudad);
CREATE INDEX IF NOT EXISTS idx_creado ON records(creado);
CREATE INDEX IF NOT EXISTS idx_tags ON records(tags);
SQL
```

### 2.3 Migrar JSON existentes a SQLite
```bash
# Script de migración
node scripts/migrate-json-to-sqlite.js
```

## Fase 3: Integrar Meilisearch (Día 3-4)

### 3.1 Instalar cliente Meilisearch
```bash
npm install meilisearch
```

### 3.2 Crear servicio de indexación
```bash
cat > src/lib/meilisearch.ts << 'TS'
import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export const index = client.index('records')

export async function indexRecord(record: any) {
  return index.addDocuments([record])
}

export async function searchRecords(query: string, filters?: any) {
  return index.search(query, {
    limit: 20,
    filter: filters,
    attributesToHighlight: ['titulo', 'descripcion'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>'
  })
}
TS
```

### 3.3 Actualizar API para indexar
```bash
# Modificar src/app/api/submit/route.ts
# Agregar: await indexRecord(record) después de guardar
```

## Fase 4: Nueva Home (Día 4-5)

### 4.1 Crear nueva página principal
```bash
cat > src/app/page.tsx << 'TSX'
// Home tipo Google 90s
// Búsqueda instantánea + accesos rápidos
TSX
```

### 4.2 Crear página de resultados
```bash
mkdir -p src/app/search
cat > src/app/search/page.tsx << 'TSX'
// Resultados de búsqueda
// HTMX para actualizaciones en tiempo real
TSX
```

## Fase 5: Geolocalización (Día 5-6)

### 5.1 Integrar Nominatim
```bash
cat > src/lib/nominatim.ts << 'TS'
// Geocodificación con OpenStreetMap
TS
```

### 5.2 Agregar Leaflet
```bash
npm install leaflet @types/leaflet
```

### 5.3 Crear componente de mapa
```bash
cat > src/components/Map.tsx << 'TSX'
// Mapa ligero, carga bajo demanda
TSX
```

## Fase 6: PWA (Día 6-7)

### 6.1 Crear manifest.json
```bash
cat > public/manifest.json << 'JSON'
{
  "name": "Red CheoSys",
  "short_name": "CheoSys",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb"
}
JSON
```

### 6.2 Service Worker
```bash
cat > public/sw.js << 'JS'
// Cache strategies
JS
```

## Rollback Plan

Si algo falla:
```bash
# Detener Meilisearch
sudo systemctl stop meilisearch

# Revertir a JSON
# Los datos originales están en data/*.json

# Reiniciar PM2
pm2 restart red-cheosys
```

## Testing

### Antes de cada fase
```bash
npm run build
pm2 restart red-cheosys
curl -I https://red.cheosys.com
```

### Después de cada fase
```bash
# Verificar logs
pm2 logs red-cheosys --lines 50

# Probar funcionalidad
curl https://red.cheosys.com/api/centers
```

## Checklist Final

- [ ] Meilisearch corriendo
- [ ] SQLite con datos migrados
- [ ] Búsqueda funcional
- [ ] Geolocalización funcionando
- [ ] PWA instalable
- [ ] Performance < 1s FCP
- [ ] Documentación actualizada
