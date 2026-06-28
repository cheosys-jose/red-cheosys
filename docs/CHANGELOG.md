# Changelog

Todos los cambios notables en este proyecto.

## [0.3.0] - 2026-06-28

### Agregado
- ✅ Geolocalización con OpenStreetMap (Nominatim)
- ✅ Búsqueda por cercanía con radio configurable
- ✅ Cálculo de distancia con fórmula de Haversine
- ✅ Coordenadas almacenadas en Meilisearch
- ✅ API endpoint `/api/search/near` para búsqueda geográfica
- ✅ Reverse geocoding para convertir coordenadas en dirección
- ✅ Páginas `/agregar`, `/centros`, `/docs`

### Técnico
- Integración con Nominatim API (OpenStreetMap)
- Geocodificación automática al enviar formularios
- Búsqueda geográfica con radio en kilómetros
- Cliente axios para requests HTTP

## [0.2.0] - 2026-06-28

### Agregado
- ✅ Meilisearch instalado y configurado como servicio systemd
- ✅ Búsqueda full-text instantánea (<100ms)
- ✅ Nueva home tipo Google 90s (minimalista, rápida)
- ✅ Página de búsqueda con filtros por tipo
- ✅ Integración Meilisearch en API de submit
- ✅ Cliente Node.js de Meilisearch
- ✅ Índice "records" con atributos buscables configurados

### Cambiado
- Arquitectura: JSON files → JSON + Meilisearch
- Frontend: React multi-step → Búsqueda instantánea
- Home: Formulario complejo → Búsqueda central simple

### Técnico
- Meilisearch v1.48.2 corriendo en puerto 7700
- Servicio systemd: meilisearch-red-cheosys.service
- Master key configurada
- Atributos buscables: titulo, descripcion, texto_ubicacion, ciudad, tags
- Filtros: tipo, ciudad, estado, prioridad, tags

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
