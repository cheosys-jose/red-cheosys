# Changelog

Todos los cambios notables en este proyecto.

## [0.2.0] - 2026-06-28 (EN DESARROLLO)

### Agregado
- Sistema de búsqueda con Meilisearch (pendiente)
- SQLite para almacenamiento de datos
- Nominatim para geocodificación
- HTMX para interacciones ligeras
- PWA con Service Worker
- Búsqueda por cercanía
- Mapa con Leaflet (lazy load)

### Cambiado
- Arquitectura: JSON files → SQLite + Meilisearch
- Frontend: React → HTMX + Alpine.js (progresivo)
- Mapas: Google Maps → OpenStreetMap

## [0.1.0] - 2026-06-27

### Agregado
- Next.js 14 con TypeScript y Tailwind CSS
- Formulario multi-step para "Necesita ayuda"
- API route para guardar datos en JSON
- Página para agregar centros de acopio
- Lista de centros registrados
- Documentación completa (5 documentos)
- Configuración PM2 y Nginx
- Licencia MIT

### Técnico
- Puerto: 3001
- PM2 process: red-cheosys (ID 8)
- Nginx: red.cheosys.com
- SSL: Certbot (Let's Encrypt)
