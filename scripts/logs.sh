#!/usr/bin/env bash
# ============================================================
# Hygiène des logs applicatifs (dossier logs/ monté dans l'API), sur le VPS.
#
#   scripts/logs.sh check  <prod|preprod>   compte ce qui ne devrait plus être dans les logs
#   scripts/logs.sh scrub  <prod|preprod>   supprime les ID de session, masque les e-mails (FLE-57)
#   scripts/logs.sh rotate <prod|preprod>   archive les .log du mois et supprime les archives anciennes
#
# Durée de conservation : LOG_RETENTION_DAYS (360 jours par défaut, décidé le 31/10).
# Rotation : une fois par mois, par cron, par exemple :
#   5 3 1 * * /chemin/du/projet/scripts/logs.sh rotate prod
#
# Tout passe par « docker exec -u 0 » dans le conteneur API : les fichiers de logs/ appartiennent
# à www-data (API) ou à l'utilisateur des crons ; root dans le conteneur évite les problèmes de droits.
# Aucune copie de sauvegarde n'est gardée : une copie garderait aussi ce qu'on veut effacer.
# ============================================================
set -euo pipefail

ACTION="${1:-}"
ENV_NAME="${2:-}"
[[ "$ACTION" =~ ^(check|scrub|rotate)$ ]] && [[ "$ENV_NAME" =~ ^(prod|preprod)$ ]] \
    || { echo "Usage : $0 <check|scrub|rotate> <prod|preprod>" >&2; exit 2; }

CONTAINER="flepourtous-backend-$ENV_NAME"
LOG_DIR_IN_CONTAINER="/var/www/html/logs"
RETENTION_DAYS="${LOG_RETENTION_DAYS:-360}"
[[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]] && [ "$RETENTION_DAYS" -ge 30 ] \
    || { echo "LOG_RETENTION_DAYS doit être un nombre de jours >= 30" >&2; exit 2; }

in_container() { docker exec -u 0 "$CONTAINER" sh -c "$1"; }

# Une adresse e-mail non masquée : un caractère, puis d'autres caractères d'adresse, puis @domaine.
# Une adresse déjà masquée (a***@gmail.com) ne correspond pas : le * coupe le motif.
EMAIL_RE='[A-Za-z0-9][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
SESSION_RE='^[[:space:]]*- (Session ID|Session): '

case "$ACTION" in
check)
    echo "== $CONTAINER : logs Docker (sortie d'erreur PHP / Apache)"
    DOCKER_LOGS="$(docker logs "$CONTAINER" 2>&1 || true)"
    echo "  « LOGIN - Request data » (mots de passe) : $(printf '%s' "$DOCKER_LOGS" | grep -c 'LOGIN - Request data' || true)"
    echo "  « Session ID » : $(printf '%s' "$DOCKER_LOGS" | grep -c 'Session ID' || true)"
    echo "  adresses e-mail en clair : $(printf '%s' "$DOCKER_LOGS" | grep -Eoc "$EMAIL_RE" || true)"
    echo "== $CONTAINER : fichiers de $LOG_DIR_IN_CONTAINER"
    in_container "cd $LOG_DIR_IN_CONTAINER 2>/dev/null || { echo '  (dossier absent)'; exit 0; }
        for f in \$(find . -type f -name '*.log' | sort); do
            s=\$(grep -Ec '$SESSION_RE' \"\$f\" || true)
            m=\$(grep -Eo '$EMAIL_RE' \"\$f\" | wc -l)
            echo \"  \$f : \$(du -h \"\$f\" | cut -f1), ID de session : \$s, e-mails en clair : \$m\"
        done"
    ;;
scrub)
    echo "== $CONTAINER : suppression des ID de session et masquage des e-mails dans $LOG_DIR_IN_CONTAINER"
    in_container "cd $LOG_DIR_IN_CONTAINER &&
        find . -type f -name '*.log' -exec sed -i -E \
            -e '/$SESSION_RE/d' \
            -e 's/([A-Za-z0-9])[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/\1***@\2/g' {} +"
    echo "Fait. Relancer « $0 check $ENV_NAME » pour vérifier : 0 partout."
    ;;
rotate)
    STAMP="$(date -u +%Y-%m-%d)"
    echo "== $CONTAINER : archivage des .log ($STAMP), suppression des archives de plus de $RETENTION_DAYS jours"
    in_container "cd $LOG_DIR_IN_CONTAINER && mkdir -p archive &&
        for f in *.log; do
            [ -s \"\$f\" ] || continue
            mv \"\$f\" \"archive/\${f%.log}-$STAMP.log\" && : > \"\$f\" && chown --reference=\"archive/\${f%.log}-$STAMP.log\" \"\$f\"
            gzip -f \"archive/\${f%.log}-$STAMP.log\"
        done
        find archive -type f -name '*.log.gz' -mtime +$RETENTION_DAYS -print -delete"
    ;;
esac
