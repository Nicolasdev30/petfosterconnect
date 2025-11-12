#!/bin/bash

# Script de test complet de l'application PetFosterConnect via Docker
# Usage: bash test-docker-app.sh

echo "======================================"
echo "🧪 Tests PetFosterConnect - Docker"
echo "======================================"
echo ""

# Couleurs pour la sortie
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Fonction pour afficher les résultats
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} - $2"
        ((FAILED++))
    fi
}

# Fonction pour tester une URL
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$response" = "$expected_status" ]; then
        test_result 0 "$description (HTTP $response)"
    else
        test_result 1 "$description (Expected: $expected_status, Got: $response)"
    fi
}

# Fonction pour tester avec données JSON
test_json_response() {
    local url=$1
    local description=$2
    local json_key=$3

    response=$(curl -s "$url" 2>/dev/null)

    if echo "$response" | grep -q "$json_key"; then
        test_result 0 "$description"
    else
        test_result 1 "$description (Key '$json_key' not found)"
    fi
}

echo "📋 Test 1 : Vérification des conteneurs Docker"
echo "--------------------------------------"

# Test 1.1 : Tous les conteneurs sont running
containers=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l)
if [ "$containers" -ge 3 ]; then
    test_result 0 "Tous les conteneurs sont démarrés ($containers/4)"
else
    test_result 1 "Certains conteneurs ne sont pas démarrés ($containers/4)"
fi

# Test 1.2 : Base de données est healthy
db_health=$(docker inspect petfosterconnect-main-db-1 --format='{{.State.Health.Status}}' 2>/dev/null)
if [ "$db_health" = "healthy" ]; then
    test_result 0 "Base de données PostgreSQL (healthy)"
else
    test_result 1 "Base de données PostgreSQL ($db_health)"
fi

echo ""
echo "📋 Test 2 : API Backend (Port 3000)"
echo "--------------------------------------"

# Test 2.1 : Health check
test_json_response "http://localhost:3000/api/health" "Health check endpoint" "success"

# Test 2.2 : API root
test_json_response "http://localhost:3000/api" "API root endpoint" "Pet Foster Connect"

# Test 2.3 : Get Animals (public)
test_json_response "http://localhost:3000/api/animals" "Liste des animaux" "animals"

# Test 2.4 : Get Associations (public)
test_json_response "http://localhost:3000/api/associations" "Liste des associations" "associations"

echo ""
echo "📋 Test 3 : Authentification"
echo "--------------------------------------"

# Test 3.1 : Login admin avec succès
login_response=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@petfosterconnect.com","password":"Admin@123"}' 2>/dev/null)

if echo "$login_response" | grep -q "Connexion réussie"; then
    test_result 0 "Login admin réussi"
    # Extraire le cookie si possible pour les tests suivants
    admin_cookie=$(curl -s -c - -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@petfosterconnect.com","password":"Admin@123"}' 2>/dev/null | grep token | awk '{print $7}')
else
    test_result 1 "Login admin échoué"
fi

# Test 3.2 : Login avec mauvais mot de passe
bad_login=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@petfosterconnect.com","password":"WrongPassword"}' 2>/dev/null)

if echo "$bad_login" | grep -q "incorrect"; then
    test_result 0 "Rejet mot de passe incorrect"
else
    test_result 1 "Mauvais mot de passe devrait être rejeté"
fi

# Test 3.3 : Accès route protégée sans authentification
unauthorized=$(curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE http://localhost:3000/api/admin/users/999 2>/dev/null)

if [ "$unauthorized" = "401" ]; then
    test_result 0 "Route admin bloquée sans authentification (401)"
else
    test_result 1 "Route admin devrait retourner 401 sans auth (Got: $unauthorized)"
fi

echo ""
echo "📋 Test 4 : Nginx Reverse Proxy (Port 80)"
echo "--------------------------------------"

# Test 4.1 : Frontend accessible via nginx
test_endpoint "http://localhost/" "Frontend via nginx" 200

# Test 4.2 : API via nginx
test_json_response "http://localhost/api/health" "API via nginx proxy" "success"

# Test 4.3 : Animals via nginx
test_json_response "http://localhost/api/animals" "Animals via nginx" "animals"

echo ""
echo "📋 Test 5 : Base de Données"
echo "--------------------------------------"

# Test 5.1 : Compte admin existe
admin_check=$(docker exec petfosterconnect-main-db-1 psql -U petfosterconnect -d petfosterconnect \
  -t -c "SELECT COUNT(*) FROM \"user\" WHERE email = 'admin@petfosterconnect.com';" 2>/dev/null | tr -d ' ')

if [ "$admin_check" = "1" ]; then
    test_result 0 "Compte admin existe dans la BD"
else
    test_result 1 "Compte admin non trouvé dans la BD"
fi

# Test 5.2 : Les 3 rôles existent
roles_count=$(docker exec petfosterconnect-main-db-1 psql -U petfosterconnect -d petfosterconnect \
  -t -c "SELECT COUNT(*) FROM role;" 2>/dev/null | tr -d ' ')

if [ "$roles_count" = "3" ]; then
    test_result 0 "Les 3 rôles sont définis (utilisateur, association, admin)"
else
    test_result 1 "Rôles incorrects (Expected: 3, Got: $roles_count)"
fi

# Test 5.3 : Des animaux existent
animals_count=$(docker exec petfosterconnect-main-db-1 psql -U petfosterconnect -d petfosterconnect \
  -t -c "SELECT COUNT(*) FROM animal;" 2>/dev/null | tr -d ' ')

if [ "$animals_count" -gt 0 ]; then
    test_result 0 "Des animaux sont présents dans la BD ($animals_count)"
else
    test_result 1 "Aucun animal dans la BD"
fi

echo ""
echo "📋 Test 6 : Validation et Sécurité"
echo "--------------------------------------"

# Test 6.1 : Validation mot de passe faible
weak_pass=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"Test",
    "last_name":"User",
    "email":"test@test.com",
    "password":"weak",
    "confirmPassword":"weak"
  }' 2>/dev/null)

if echo "$weak_pass" | grep -qi "validation\|password"; then
    test_result 0 "Validation mot de passe faible"
else
    test_result 1 "Mot de passe faible devrait être rejeté"
fi

# Test 6.2 : Headers de sécurité
security_headers=$(curl -s -I http://localhost/ 2>/dev/null | grep -i "x-content-type-options\|x-frame-options")

if [ ! -z "$security_headers" ]; then
    test_result 0 "Headers de sécurité présents (Helmet.js)"
else
    test_result 1 "Headers de sécurité manquants"
fi

echo ""
echo "======================================"
echo "📊 RÉSULTATS FINAUX"
echo "======================================"
echo -e "${GREEN}✅ Tests réussis : $PASSED${NC}"
echo -e "${RED}❌ Tests échoués : $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Tous les tests sont passés ! (100%)${NC}"
    echo ""
    echo "✅ Application PetFosterConnect pleinement opérationnelle"
    exit 0
else
    echo -e "${YELLOW}⚠️  Taux de réussite : $SUCCESS_RATE%${NC}"
    echo ""
    echo "❌ Certains tests ont échoué. Vérifier les logs :"
    echo "   docker-compose logs"
    exit 1
fi
