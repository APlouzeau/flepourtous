#!/bin/bash

# --- Configuration ---
FRONTEND_DIR="/home/flepourtous-preprod-eyonexis/projects/flepourtous/frontend"
# !!! IMPORTANT: Remplacez par le nom EXACT de votre application PM2 !!!
PM2_APP_NAME="flepourtous-preprod"
# Commande pour démarrer avec PM2. 'npm -- run start' est courant si 'start': 'next start' est dans package.json
# Si vous utilisez un fichier ecosystem.config.js, la commande serait 'pm2 startOrRestart ecosystem.config.js'
PM2_START_SCRIPT="npm" # Le script/binaire à lancer par PM2
PM2_START_ARGS="-- run start" # Les arguments pour ce script (par ex. 'run start' pour 'npm run start')

echo "### Passage en mode PRODUCTION (START) ###"
echo ""
echo "ATTENTION: Assurez-vous que tout processus 'npm run dev' est bien arrêté manuellement."
read -p "Appuyez sur [Entrée] pour continuer, ou Ctrl+C pour annuler..."
echo ""

# Aller dans le répertoire du frontend
cd "$FRONTEND_DIR" || { echo "ERREUR: Impossible d'accéder à $FRONTEND_DIR. Arrêt."; exit 1; }

# Construire l'application
echo "Construction de l'application Next.js (npm run build)..."
echo "---------------------------------------------------------------------"
if ! npm run build; then
    echo "---------------------------------------------------------------------"
    echo "ERREUR: La construction de l'application Next.js a échoué. Arrêt."
    exit 1
fi
echo "---------------------------------------------------------------------"
echo "Application Next.js construite avec succès."
echo ""

# Démarrer ou redémarrer avec PM2
echo "Démarrage/Redémarrage de l'application avec PM2 sous le nom '$PM2_APP_NAME'..."
pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Le processus PM2 '$PM2_APP_NAME' existe. Redémarrage..."
    pm2 restart "$PM2_APP_NAME"
else
    echo "Le processus PM2 '$PM2_APP_NAME' n'existe pas. Démarrage d'un nouveau processus..."
    # Si vous utilisez un fichier ecosystem.config.js, remplacez la ligne suivante par:
    # pm2 startOrRestart ecosystem.config.js
    # Sinon, pour un démarrage simple :
    pm2 start "$PM2_START_SCRIPT" --name "$PM2_APP_NAME" -- $PM2_START_ARGS
fi
echo ""

echo "Vérifiez le statut avec 'pm2 list' et les logs avec 'pm2 logs $PM2_APP_NAME'."
echo "### Mode PRODUCTION (START) configuré ###"