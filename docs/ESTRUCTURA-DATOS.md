# Estructura de Datos - red.cheosys.com

## Formato de Almacenamiento

**Tipo:** JSON por día
**Ubicación:** `/opt/cheosys/services/web/red-cheosys/data/`
**Patrón:** `YYYY-MM-DD.json`

## Schema de Entrada

```json
{
  "id": "uuid-v4",
  "timestamp": "2026-06-27T14:32:00Z",
  "nombre": "María Pérez",
  "ubicacion": "Barrio Centro, Calle 5",
  "tipo": "alimento",
  "descripcion": "Familia de 4 personas, necesitan arroz y...",
  "contacto": "+58 414...",
  "ip_hash": "sha256-salt"
}
```

## Campos y Límites

| Campo | Tipo | Límite | Obligatorio | Descripción |
|-------|------|--------|-------------|-------------|
| id | string | 36 chars | Auto | UUID v4 generado automáticamente |
| timestamp | string | ISO 8601 | Auto | Fecha/hora UTC |
| nombre | string | 100 chars | No | Nombre de la persona o referencia |
| ubicacion | string | 200 chars | Sí | Dirección o referencia de ubicación |
| tipo | string | 50 chars | Sí | Categoría: alimento, medicina, agua, ropa, otro |
| descripcion | string | 2000 chars | Sí | Detalles de la necesidad |
| contacto | string | 200 chars | Sí | Teléfono, email o redes sociales |
| ip_hash | string | 64 chars | Auto | Hash SHA256 de IP + salt (privacidad) |

## Tipos de Ayuda (Categorías)

- `alimento` - Comida, víveres, alimentos
- `medicina` - Medicamentos, insumos médicos
- `agua` - Agua potable, tanques
- `ropa` - Ropa, calzado, mantas
- `transporte` - Transporte, movilidad
- `alojamiento` - Refugio, alojamiento temporal
- `otro` - Otras necesidades

## Validación

### Frontend (UX)
- Validación en tiempo real
- Mensajes de error claros
- Límites de caracteres visibles

### Backend (Seguridad)
- Sanitización de inputs
- Validación de tipos y longitudes
- Rate limiting (10 envíos por hora por IP)
- Hash de IP para privacidad

## Ejemplo de Archivo Diario

**Archivo:** `data/2026-06-27.json`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-06-27T14:32:00Z",
    "nombre": "María Pérez",
    "ubicacion": "Barrio Centro, Calle 5",
    "tipo": "alimento",
    "descripcion": "Familia de 4 personas, necesitan arroz, pasta y aceite",
    "contacto": "+58 414-1234567",
    "ip_hash": "a1b2c3d4e5f6..."
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "timestamp": "2026-06-27T15:45:00Z",
    "nombre": "Juan Rodríguez",
    "ubicacion": "Av. Principal, Casa Azul",
    "tipo": "medicina",
    "descripcion": "Necesita insulina para diabetes tipo 2",
    "contacto": "+58 412-9876543",
    "ip_hash": "f6e5d4c3b2a1..."
  }
]
```

## Backup y Exportación

### Backup Automático
```bash
# Script diario (cron)
tar -czf /opt/cheosys/infra/backups/red-cheosys-$(date +%Y%m%d).tar.gz \
  /opt/cheosys/services/web/red-cheosys/data/
```

### Exportar a CSV
```bash
# Convertir JSON a CSV para análisis
jq -r '(.[0] | keys_unsorted) as $keys | $keys, map([.[ $keys[] ]])[] | @csv' \
  data/2026-06-27.json > data/2026-06-27.csv
```

## Privacidad y Seguridad

- **IP:** Se almacena solo como hash SHA256 con salt
- **Datos personales:** Solo los proporcionados voluntariamente
- **Retención:** Los datos se mantienen mientras sean útiles para la coordinación
- **Acceso:** Solo administradores del proyecto tienen acceso al servidor
- **Open Source:** El código es público, los datos son privados

## Consideraciones Futuras

- Migración a SQLite si hay >1000 entradas/día
- Indexación por tipo y ubicación
- API REST para consultas
- Dashboard de estadísticas
