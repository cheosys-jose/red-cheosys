# Decisiones Arquitectónicas

**Última actualización:** 2026-06-28

## Stack Tecnológico

### Frontend
- **Next.js 14** - SSR/ISR, App Router
- **React 18** - UI interactiva
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first, purged

### Backend
- **Meilisearch** - Búsqueda instantánea (Rust, <100MB RAM)
- **Sharp.js** - Procesamiento de imágenes (optimización WebP)
- **OpenStreetMap/Nominatim** - Geocodificación (gratis, open source)

### Infraestructura
- **Nginx** - Reverse proxy + SSL
- **PM2** - Process manager
- **Certbot** - SSL automático (Let's Encrypt)

## ¿Por qué estas decisiones?

### Meilisearch vs Elasticsearch
- ✅ Meilisearch: <100MB RAM, typo-tolerant, más simple, búsqueda <10ms
- ❌ Elasticsearch: >1GB RAM, complejo, overkill para este caso

### Sharp.js vs ImageMagick
- ✅ Sharp: Node.js nativo, rápido, optimización WebP automática
- ❌ ImageMagick: Requiere CLI, más lento, menos integración

### Nominatim vs Google Maps
- ✅ Nominatim: Gratis, open source, sin API key, sin límites
- ❌ Google Maps: Requiere API key, costo si crece, dependencias

### Next.js vs HTMX
- ✅ Next.js: SSR/ISR, mejor SEO, React ecosystem
- ❌ HTMX: Más simple pero menos flexibilidad para UI compleja

### JSON por día vs SQLite
- ✅ JSON: Simple, portable, fácil backup, suficiente para <100k registros
- ⚠️ Considerar SQLite si crece a >100k registros

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
- Imágenes optimizadas (800x800px) para reducir ancho de banda

### ❌ No aceptamos
- Dependencias de servicios pagos
- Vendor lock-in
- Complejidad innecesaria
- Datos privados (todo es público)

## Arquitectura de Imágenes

### Flujo de Upload
1. Usuario sube imagen (máx 2MB)
2. Sharp.js procesa: resize 800x800px + WebP calidad 70%
3. Guardado en `data/images/YYYY-MM/nombre-hash.webp`
4. URL relativa: `/images/YYYY-MM/nombre-hash.webp`
5. Middleware sirve desde `/api/images/[...path]`

### Optimización
- **Formato:** WebP (50-80% más pequeño que JPEG)
- **Tamaño:** 800x800px máximo (suficiente para visualización)
- **Calidad:** 70% (balance calidad/tamaño)
- **Cache:** 1 año en navegador (immutable)

