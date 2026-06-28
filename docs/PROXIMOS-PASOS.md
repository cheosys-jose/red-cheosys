# Próximos Pasos - Red CheoSys

**Fecha:** 2026-06-28
**Estado actual:** v0.3.0 - Geolocalización funcional

## Prioridad Alta (Semana 1)

### 1. Mapa Interactivo con Leaflet
- [ ] Instalar Leaflet.js
- [ ] Crear componente de mapa
- [ ] Mostrar centros en mapa
- [ ] Click en marcador = ver detalles
- [ ] Lazy load (solo cargar si usuario pide)

### 2. Formulario Mejorado
- [ ] Autocompletar ubicación con Nominatim
- [ ] Mostrar coordenadas en mapa mientras escribe
- [ ] Validación en tiempo real
- [ ] Preview antes de enviar

### 3. PWA (Progressive Web App)
- [ ] manifest.json
- [ ] Service Worker (offline support)
- [ ] Iconos para móvil
- [ ] Instalable en home screen

## Prioridad Media (Semana 2-3)

### 4. Sistema de Votos/Confianza
- [ ] Botón "Útil" / "No útil"
- [ ] Contador de votos
- [ ] Ordenar por confianza
- [ ] Prevenir spam (rate limiting)

### 5. RSS Feeds
- [ ] Feed por tipo de registro
- [ ] Feed por ciudad
- [ ] Feed de desaparecidos
- [ ] XML válido y validado

### 6. API Pública Documentada
- [ ] Swagger/OpenAPI specs
- [ ] Rate limiting (100 req/hour)
- [ ] Autenticación con API keys
- [ ] Ejemplos de código

## Prioridad Baja (Semana 4+)

### 7. Optimización Avanzada
- [ ] Redis cache para búsquedas populares
- [ ] CDN para assets estáticos
- [ ] Compresión Brotli en Nginx
- [ ] Image optimization

### 8. Moderación
- [ ] Sistema de reportes
- [ ] Cola de moderación
- [ ] Auto-detección de spam
- [ ] Panel de administración

### 9. Donaciones Cripto
- [ ] Widget de donaciones
- [ ] USDT TRC20/ERC20
- [ ] Bitcoin
- [ ] Transparencia de fondos

### 10. Búsqueda Avanzada
- [ ] Búsqueda por voz (Web Speech API)
- [ ] Búsqueda por QR
- [ ] Búsqueda por SMS (Twilio)
- [ ] Filtros combinados

## Ideas Futuras

- [ ] Integración con WhatsApp Business API
- [ ] Bot de Telegram para consultas
- [ ] App móvil nativa (React Native)
- [ ] Dashboard de estadísticas
- [ ] Exportar datos a CSV/Excel
- [ ] Multi-idioma (i18n)

## Métricas de Éxito

### Performance
- [ ] First Contentful Paint < 1s ✅ (actual: ~96KB)
- [ ] Time to Interactive < 2s
- [ ] Búsqueda < 100ms ✅ (Meilisearch)
- [ ] Lighthouse score > 95

### Uso
- [ ] 100+ registros/día
- [ ] 1000+ búsquedas/día
- [ ] Uptime > 99%

### Comunidad
- [ ] 10+ contribuidores
- [ ] 50+ forks en GitHub
- [ ] 100+ stars en GitHub

---

**Nota:** Este documento se actualiza semanalmente según el progreso.
