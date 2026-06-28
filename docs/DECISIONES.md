# Decisiones Arquitectónicas

**Última actualización:** 2026-06-28

## Stack Tecnológico

### Frontend
- **Next.js 14** - SSR/ISR, App Router
- **HTMX** - Interacciones sin JS pesado (14KB)
- **Alpine.js** - Solo lo necesario (15KB)
- **Tailwind CSS** - Utility-first, purged
- **Leaflet.js** - Mapas ligeros (open source)

### Backend
- **Meilisearch** - Búsqueda instantánea (Rust, <100MB RAM)
- **SQLite** - Datos crudos (zero deps)
- **Nominatim** - Geocodificación OpenStreetMap (gratis)

### Infraestructura
- **Nginx** - Reverse proxy + Brotli compression
- **PM2** - Process manager
- **Certbot** - SSL automático

## ¿Por qué estas decisiones?

### Meilisearch vs Elasticsearch
- ✅ Meilisearch: <100MB RAM, typo-tolerant, más simple
- ❌ Elasticsearch: >1GB RAM, complejo, overkill

### SQLite vs PostgreSQL
- ✅ SQLite: Zero config, portable, <10MB, perfecto para <100k records
- ❌ PostgreSQL: Requiere servidor, más complejo

### HTMX vs React
- ✅ HTMX: 14KB, HTML-first, sin build step
- ❌ React: 200KB+, complejo, overkill para este caso

### Nominatim vs Google Maps
- ✅ Nominatim: Gratis, open source, sin API key
- ❌ Google Maps: Requiere API key, costo si crece

### Leaflet vs Mapbox
- ✅ Leaflet: 39KB, open source, plugins
- ❌ Mapbox: Requiere token, costo si crece

## Principios de Diseño

1. **Velocidad extrema** - Cada KB cuenta
2. **Open source** - Todo libre, sin vendor lock-in
3. **Offline-first** - Funciona con internet limitado
4. **Simplicidad** - Menos es más en emergencias
5. **Transparencia** - Datos públicos, código abierto

## Trade-offs Aceptados

### ✅ Aceptamos
- Menos features que soluciones comerciales
- UI más simple (pero funcional)
- Escalamiento manual hasta cierto punto

### ❌ No aceptamos
- Dependencias de servicios pagos
- Vendor lock-in
- Complejidad innecesaria
- Datos privados (todo es público)

## Migración desde v0.1.0

### Qué mantener
- ✅ Estructura Next.js 14
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ API routes (/api/submit, /api/centers)

### Qué cambiar
- 🔄 React → HTMX + Alpine.js (progresivo)
- 🔄 JSON files → SQLite + Meilisearch
- 🔄 Google Maps → OpenStreetMap/Nominatim
- 🔄 Multi-step form → Búsqueda instantánea

### Qué agregar
- ➕ Meilisearch
- ➕ SQLite
- ➕ PWA + Service Worker
- ➕ HTMX
- ➕ Leaflet

## Costos Estimados

### Mensuales
- Servidor (Contabo): $10
- Dominio: $1.25 (prorrateado)
- SSL: $0 (Let's Encrypt)
- **Total: ~$11.25/mes**

### Anuales
- **Total: ~$135/año**

### Sostenibilidad
- Donaciones cripto (USDT TRC20/ERC20, Bitcoin)
- Transparencia total de costos
