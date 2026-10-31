#!/usr/bin/env bash
# ============================================================
# Appel d'une route cron de l'API, sur le VPS, pour un environnement donné.
#
#   scripts/cron.sh <prod|preprod> <route>
#   ex. : scripts/cron.sh prod checkWaitingEvents
#
# Routes cron (déclarées 'cron' dans backend/config/router.php) :
#   checkWaitingEvents                  cours non payés : rappel puis annulation (toutes les 10 min)
#   sendMailToAlertForNextAppointment   rappel 1 h avant le cours (fenêtre 55-65 min : toutes les 10 min)
#   setupGoogleWatch                    renouvelle l'abonnement au webhook Google Calendar (TTL 7 jours : une fois par jour)
#
# La clé est lue dans le conteneur backend de l'environnement (jamais écrite dans un fichier).
# Journal : logs/cron-<route>.log dans le dossier du projet (le dossier logs/ monté dans l'API).
# Code de retour non nul en cas d'échec, pour que cron le signale.
# ============================================================
set -uo pipefail

ENV_NAME="${1:-}"
ROUTE="${2:-}"
[[ "$ENV_NAME" =~ ^(prod|preprod)$ ]] && [[ "$ROUTE" =~ ^[A-Za-z]+$ ]] \
    || { echo "Usage : $0 <prod|preprod> <route>" >&2; exit 2; }

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTAINER="flepourtous-backend-$ENV_NAME"
if [ "$ENV_NAME" = prod ]; then DEFAULT_URL="https://api.flepourtous.fr"; else DEFAULT_URL="https://api.preprod.flepourtous.fr"; fi
API_URL="${API_URL:-$DEFAULT_URL}/api/$ROUTE"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/cron-$ROUTE.log"
mkdir -p "$LOG_DIR"

log() { echo "[$(date -u +'%Y-%m-%d %H:%M:%S')Z] [$ENV_NAME] $*" >> "$LOG_FILE"; }

# Erreur affichée (et journalisée) au lieu d'être masquée : conteneur absent, accès Docker refusé, clé vide.
if ! KEY_OUTPUT="$(docker exec "$CONTAINER" printenv CRON_KEY 2>&1)"; then
    log "ERREUR : lecture de CRON_KEY dans $CONTAINER impossible : $KEY_OUTPUT"
    echo "ERREUR : lecture de CRON_KEY dans $CONTAINER impossible : $KEY_OUTPUT" >&2
    exit 1
fi
CRON_KEY="$(printf '%s' "$KEY_OUTPUT" | tr -d '\r\n')"
if [ -z "$CRON_KEY" ]; then
    log "ERREUR : CRON_KEY vide dans $CONTAINER"
    echo "ERREUR : CRON_KEY vide dans $CONTAINER" >&2
    exit 1
fi

# --fail-with-body : code non nul si HTTP >= 400, en gardant la réponse dans le journal.
RESPONSE="$(curl -sS --max-time 120 --fail-with-body -X POST -H "Api-Key: $CRON_KEY" -w '\nHTTP %{http_code}' "$API_URL" 2>&1)"
CODE=$?
log "$API_URL → $(printf '%s' "$RESPONSE" | tr '\n' ' ' | cut -c1-500)"
if [ $CODE -ne 0 ]; then
    echo "ERREUR : $API_URL (curl $CODE) : $RESPONSE" >&2
fi
exit $CODE
