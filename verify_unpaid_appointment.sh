#!/bin/bash

API_URL="http://localhost:8000/api/checkWaitingEvents"
LOG_FILE="/home/alex/projects/docker/flepourtous/logs/verify_unpaid_appointment.log"
TIMESTAMP=$(date +"%Y-%m-%d %T")

echo "[$TIMESTAMP] Début de l'appel cron à $API_URL" >> "$LOG_FILE"

# Récupérer la clé API depuis l'environnement Docker du conteneur production
CRON_KEY=$(docker exec flepourtous-backend-dev printenv CRON_KEY 2>/dev/null)

if [ -z "$CRON_KEY" ]; then
    echo "[$TIMESTAMP] ERREUR: Impossible de récupérer CRON_KEY depuis le conteneur backend" >> "$LOG_FILE"
    exit 1
fi

# -s pour silent (pas de barre de progression)
# -S pour afficher les erreurs même en mode silent  
# -X POST car votre route est en POST
# --fail pour que curl retourne un code d'erreur non nul si le code HTTP est >= 400
curl -sS -X POST --fail -H "API-KEY: $CRON_KEY" "$API_URL" >> "$LOG_FILE" 2>&1

CURL_EXIT_CODE=$?

if [ $CURL_EXIT_CODE -eq 0 ]; then
    echo "[$TIMESTAMP] Appel à $API_URL réussi." >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] Erreur lors de l'appel à $API_URL. Code de sortie de curl: $CURL_EXIT_CODE" >> "$LOG_FILE"
fi

echo "[$TIMESTAMP] Fin de l'appel cron." >> "$LOG_FILE"
echo "" >> "$LOG_FILE" # Ligne vide pour séparer les logs

exit $CURL_EXIT_CODE
