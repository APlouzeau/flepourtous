#!/bin/bash

# --- Configuration ---
FRONTEND_DIR="/home/flepourtous-preprod-eyonexis/projects/flepourtous/frontend"
# !!! IMPORTANT: Remplacez par le nom EXACT de votre application PM2 !!!
PM2_APP_NAME="flepourtous-preprod"

echo "### Passage en mode DÉVELOPPEMENT ###"
echo ""

# Aller dans le répertoire du frontend
cd "$FRONTEND_DIR" || { echo "ERREUR: Impossible d'accéder à $FRONTEND_DIR. Arrêt."; exit 1; }

# Arrêter le processus PM2 s'il existe et est en cours d'exécution
echo "Tentative d'arrêt du processus PM2 '$PM2_APP_NAME' (s'il existe)..."
pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pm2 stop "$PM2_APP_NAME"
    echo "Processus PM2 '$PM2_APP_NAME' arrêté."
    pm2 delete "$PM2_APP_NAME"
else
    echo "Le processus PM2 '$PM2_APP_NAME' n'a pas été trouvé ou n'était pas en cours d'exécution."
fi
echo ""

# Lancer le serveur de développement
echo "Lancement du serveur de développement Next.js (npm run dev)..."
echo "Appuyez sur Ctrl+C pour arrêter le serveur de développement."
echo "---------------------------------------------------------------------"
pnpm run dev
echo "---------------------------------------------------------------------"
echo "Serveur de développement Next.js arrêté."
echo "### Mode DÉVELOPPEMENT terminé ###"