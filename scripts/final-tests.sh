#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         TESTS FINALES - RED CHEOSYS v0.4.0                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3001"
PASS=0
FAIL=0

# Función para test
test_endpoint() {
  local name=$1
  local method=$2
  local url=$3
  local data=$4
  local expected=$5
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$url")
  else
    response=$(curl -s -w "\n%{http_code}" -X POST "$url" -H "Content-Type: application/json" -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "$expected" ]; then
    echo "✅ $name (HTTP $http_code)"
    ((PASS++))
  else
    echo "❌ $name (HTTP $http_code, esperado $expected)"
    ((FAIL++))
  fi
}

echo "🧪 PROBANDO ENDPOINTS API v1..."
echo ""

# Alerts
test_endpoint "GET /api/v1/alerts" "GET" "$BASE_URL/api/v1/alerts" "" "200"
test_endpoint "POST /api/v1/alerts (válido)" "POST" "$BASE_URL/api/v1/alerts" '{"severity":"CRITICAL","alertType":"FLOOD","exactLocation":"Test","description":"Test"}' "201"
test_endpoint "POST /api/v1/alerts (inválido)" "POST" "$BASE_URL/api/v1/alerts" '{"severity":"INVALID"}' "400"

# Resources
test_endpoint "GET /api/v1/resources" "GET" "$BASE_URL/api/v1/resources" "" "200"
test_endpoint "POST /api/v1/resources (válido)" "POST" "$BASE_URL/api/v1/resources" '{"category":"TRANSPORT_4X4","coverageArea":"Caracas","availability":"IMMEDIATE","providerContact":"+584121234567","description":"Test"}' "201"

# Missing Persons
test_endpoint "GET /api/v1/persons/missing" "GET" "$BASE_URL/api/v1/persons/missing" "" "200"
test_endpoint "POST /api/v1/persons/missing (válido)" "POST" "$BASE_URL/api/v1/persons/missing" '{"fullName":"Test Person","ageGroup":"ADULT","gender":"MALE","lastSeenLocation":"Test","relativeContact":"+584121234567"}' "201"

# Found Persons
test_endpoint "GET /api/v1/persons/found" "GET" "$BASE_URL/api/v1/persons/found" "" "200"
test_endpoint "POST /api/v1/persons/found (válido)" "POST" "$BASE_URL/api/v1/persons/found" '{"condition":"CONSCIOUS_DISORIENTED","currentSafeLocation":"Test","estimatedAgeGroup":"ADULT","estimatedGender":"MALE","custodianContact":"+584121234567"}' "201"

# Centers
test_endpoint "GET /api/v1/centers" "GET" "$BASE_URL/api/v1/centers" "" "200"
test_endpoint "POST /api/v1/centers (válido)" "POST" "$BASE_URL/api/v1/centers" '{"centerType":"DONATION_HUB","name":"Test Center","address":"Test","contactPhone":"+584121234567"}' "201"

echo ""
echo "🧪 PROBANDO ENDPOINTS API v2..."
echo ""

# Search v2
test_endpoint "GET /api/v2/search" "GET" "$BASE_URL/api/v2/search?q=" "" "200"
test_endpoint "GET /api/v2/search?type=alerts" "GET" "$BASE_URL/api/v2/search?type=alerts" "" "200"
test_endpoint "GET /api/v2/search?type=missing_persons" "GET" "$BASE_URL/api/v2/search?type=missing_persons" "" "200"

echo ""
echo "🧪 PROBANDO PÁGINAS WEB..."
echo ""

# Páginas
test_endpoint "GET /" "GET" "$BASE_URL/" "" "200"
test_endpoint "GET /search" "GET" "$BASE_URL/search" "" "200"
test_endpoint "GET /persons/missing" "GET" "$BASE_URL/persons/missing" "" "200"
test_endpoint "GET /persons/missing/report" "GET" "$BASE_URL/persons/missing/report" "" "200"
test_endpoint "GET /persons/found/report" "GET" "$BASE_URL/persons/found/report" "" "200"
test_endpoint "GET /admin/metrics" "GET" "$BASE_URL/admin/metrics" "" "200"

echo ""
echo "🧪 PROBANDO MEILISEARCH..."
echo ""

# Meilisearch
test_endpoint "Meilisearch health" "GET" "http://localhost:7700/health" "" "200"

# Verificar índices
for index in alerts resources missing_persons found_persons centers; do
  count=$(curl -s "http://localhost:7700/indexes/$index/stats" -H "Authorization: Bearer red-cheosys-2026-change-me" | jq '.numberOfDocuments')
  if [ "$count" != "null" ] && [ "$count" -gt 0 ]; then
    echo "✅ Índice $index: $count documentos"
    ((PASS++))
  else
    echo "❌ Índice $index: sin documentos"
    ((FAIL++))
  fi
done

echo ""
echo "🧪 PROBANDO BASE DE DATOS..."
echo ""

# Verificar DB
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const alerts = await prisma.alert.count();
  const resources = await prisma.resource.count();
  const missing = await prisma.missingPerson.count();
  const found = await prisma.foundPerson.count();
  const centers = await prisma.center.count();
  console.log('✅ DB conectada');
  console.log('   Alertas:', alerts);
  console.log('   Recursos:', resources);
  console.log('   Buscados:', missing);
  console.log('   Encontrados:', found);
  console.log('   Centros:', centers);
  await prisma.\$disconnect();
}
check().catch(err => { console.error('❌ Error DB:', err.message); process.exit(1); });
"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    RESULTADOS FINALES                         ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║  ✅ Tests pasados: $PASS                                          ║"
echo "║  ❌ Tests fallidos: $FAIL                                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "🎉 TODOS LOS TESTS PASARON CORRECTAMENTE"
  exit 0
else
  echo ""
  echo "⚠️  ALGUNOS TESTS FALLARON"
  exit 1
fi
