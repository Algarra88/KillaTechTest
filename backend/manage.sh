#!/bin/bash

###############################################################################
# Script para ejecutar comandos de Django (manage.py) en Docker
# Uso: ./manage.sh <comando> [args...]
# 
# Ejemplos:
#   ./manage.sh migrate                 - Aplicar migraciones
#   ./manage.sh makemigrations          - Crear migraciones
#   ./manage.sh makemigrations Tasks    - Crear migraciones de Tasks
#   ./manage.sh showmigrations          - Ver estado migraciones
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVICE_NAME="backend"

error() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

if ! command -v docker-compose &> /dev/null; then
    error "docker-compose no está instalado"
fi

# Validación: Requiere un comando
if [ $# -eq 0 ]; then
    error "Debes proporcionar un comando. Uso: ./manage.sh <comando> [args...]

Ejemplos comunes:
  ./manage.sh migrate                 - Aplicar migraciones pendientes
  ./manage.sh makemigrations          - Crear migraciones de todas las apps
  ./manage.sh makemigrations Tasks    - Crear migraciones de Tasks
  ./manage.sh showmigrations          - Ver estado de todas migraciones"
fi

COMMAND="$1"
shift

info "Ejecutando: python manage.py $COMMAND $@"

docker-compose exec "$SERVICE_NAME" python manage.py "$COMMAND" "$@"

success "Comando ejecutado exitosamente"


