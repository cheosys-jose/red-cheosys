#!/bin/bash

echo "🧪 Probando API Endpoints v1..."
echo ""

BASE_URL="http://localhost:3001/api/v1"

# Test 1: Crear Alerta
echo "1️⃣  POST /api/v1/alerts"
ALERT_RESPONSE=$(curl -s -X POST "$BASE_URL/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "CRITICAL",
    "alertType": "FLOOD",
    "affectedPeople": "10-50",
    "exactLocation": "Av. Principal, Sector Las Flores",
    "reporterContact": "+58 412 1234567",
    "description": "Inundación severa, casas afectadas",
    "locationLat": 10.5,
    "locationLng": -66.9
  }')
echo "$ALERT_RESPONSE" | jq -r '.id // .error'
echo ""

# Test 2: Listar Alertas
echo "2️⃣  GET /api/v1/alerts"
curl -s "$BASE_URL/alerts" | jq 'length'
echo ""

# Test 3: Crear Recurso
echo "3️⃣  POST /api/v1/resources"
RESOURCE_RESPONSE=$(curl -s -X POST "$BASE_URL/resources" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "TRANSPORT_4X4",
    "coverageArea": "Caracas y alrededores",
    "availability": "IMMEDIATE",
    "providerContact": "+58 414 9876543",
    "description": "Camioneta 4x4 disponible para transporte de personas",
    "locationLat": 10.5,
    "locationLng": -66.9
  }')
echo "$RESOURCE_RESPONSE" | jq -r '.id // .error'
echo ""

# Test 4: Listar Recursos
echo "4️⃣  GET /api/v1/resources"
curl -s "$BASE_URL/resources" | jq 'length'
echo ""

# Test 5: Crear Persona Buscada
echo "5️⃣  POST /api/v1/persons/missing"
MISSING_RESPONSE=$(curl -s -X POST "$BASE_URL/persons/missing" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez García",
    "alias": "Juanito",
    "ageGroup": "ADULT",
    "gender": "MALE",
    "lastSeenLocation": "Centro Comercial Sambil, Chacao",
    "clothingDescription": "Camisa azul, pantalón negro, zapatos marrones",
    "distinctiveFeatures": "Tatuaje en brazo derecho, usa lentes",
    "relativeContact": "+58 416 5554433",
    "additionalInfo": "Desaparecido desde hace 2 días",
    "locationLat": 10.49,
    "locationLng": -66.85
  }')
echo "$MISSING_RESPONSE" | jq -r '.id // .error'
echo ""

# Test 6: Listar Personas Buscadas
echo "6️⃣  GET /api/v1/persons/missing"
curl -s "$BASE_URL/persons/missing" | jq 'length'
echo ""

# Test 7: Crear Persona Encontrada
echo "7️⃣  POST /api/v1/persons/found"
FOUND_RESPONSE=$(curl -s -X POST "$BASE_URL/persons/found" \
  -H "Content-Type: application/json" \
  -d '{
    "condition": "CONSCIOUS_DISORIENTED",
    "declaredName": "María López",
    "currentSafeLocation": "Hospital Universitario de Caracas",
    "estimatedAgeGroup": "ADULT",
    "estimatedGender": "FEMALE",
    "clothingDescription": "Vestido rojo, sandalias blancas",
    "custodianContact": "+58 424 1112233",
    "additionalInfo": "No recuerda su dirección",
    "locationLat": 10.51,
    "locationLng": -66.92
  }')
echo "$FOUND_RESPONSE" | jq -r '.id // .error'
echo ""

# Test 8: Listar Personas Encontradas
echo "8️⃣  GET /api/v1/persons/found"
curl -s "$BASE_URL/persons/found" | jq 'length'
echo ""

# Test 9: Crear Centro
echo "9️⃣  POST /api/v1/centers"
CENTER_RESPONSE=$(curl -s -X POST "$BASE_URL/centers" \
  -H "Content-Type: application/json" \
  -d '{
    "centerType": "DONATION_HUB",
    "name": "Centro de Acopio El Paraíso",
    "address": "Av. Victoria, El Paraíso, Caracas",
    "criticalNeeds": "Agua, alimentos no perecederos, medicinas",
    "contactPhone": "+58 212 5556677",
    "description": "Centro de acopio principal, abierto 24 horas",
    "locationLat": 10.49,
    "locationLng": -66.91
  }')
echo "$CENTER_RESPONSE" | jq -r '.id // .error'
echo ""

# Test 10: Listar Centros
echo "🔟 GET /api/v1/centers"
curl -s "$BASE_URL/centers" | jq 'length'
echo ""

# Test 11: Validación de datos inválidos
echo "1️⃣1️⃣  POST /api/v1/alerts (datos inválidos)"
INVALID_RESPONSE=$(curl -s -X POST "$BASE_URL/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "INVALID_SEVERITY",
    "alertType": "FLOOD"
  }')
echo "$INVALID_RESPONSE" | jq -r '.error'
echo ""

echo "✅ Pruebas completadas"
