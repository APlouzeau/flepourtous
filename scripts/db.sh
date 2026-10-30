#!/usr/bin/env bash
# ============================================================
# Sauvegarde et migrations de la base, sur le VPS (MariaDB installé sur l'hôte).
# Lancé par le déploiement (GitHub Actions), ou à la main depuis la racine du projet.
#
#   scripts/db.sh backup  <prod|preprod>   dump compressé dans ~/backups/flepourtous/, garde les 10 derniers
#   scripts/db.sh migrate <prod|preprod>   applique les migrations absentes de schema_migrations
#   scripts/db.sh status  <prod|preprod>   liste les migrations appliquées et en attente, sans rien changer
#
# Identifiants : DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PSW lus dans backend/.env
# (ceux de l'application). Le mot de passe passe par un fichier temporaire
# en 600, jamais par la ligne de commande (visible dans `ps`).
# ============================================================
set -euo pipefail
# Les erreurs dans les $(…) arrêtent aussi le script (sinon une requête ratée passerait pour « vide »).
shopt -s inherit_errexit
# Aucun échec muet : toute commande qui arrête le script dit où.
set -E
trap 'echo "❌ db.sh : échec ligne $LINENO : $BASH_COMMAND" >&2' ERR

ACTION="${1:-}"
ENV_NAME="${2:-}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/flepourtous}"
KEEP_BACKUPS="${KEEP_BACKUPS:-10}"
MIGRATIONS_DIR="db/migrations"
ENV_FILE="backend/.env"

usage() { echo "Usage : $0 <backup|migrate|status> <prod|preprod>" >&2; exit 2; }
[[ "$ACTION" =~ ^(backup|migrate|status)$ ]] || usage
[[ "$ENV_NAME" =~ ^(prod|preprod)$ ]] || usage
[ -f "$ENV_FILE" ] || { echo "❌ $ENV_FILE introuvable (lancer depuis la racine du projet)" >&2; exit 1; }

# Lit une variable du .env sans l'exécuter : retire guillemets et fins de ligne Windows.
# Variable absente = chaîne vide (DB_PORT n'est pas toujours défini).
env_value() {
    { grep -E "^[[:space:]]*$1[[:space:]]*=" "$ENV_FILE" || true; } | tail -n 1 | cut -d= -f2- \
        | tr -d '\r' | sed -E 's/^[[:space:]]+|[[:space:]]+$//g; s/^"(.*)"$/\1/; s/^'\''(.*)'\''$/\1/'
}
DB_HOST="$(env_value DB_HOST)"; DB_PORT="$(env_value DB_PORT)"; DB_PORT="${DB_PORT:-3306}"
DB_NAME="$(env_value DB_NAME)"; DB_USER="$(env_value DB_USER)"; DB_PSW="$(env_value DB_PSW)"
[ -n "$DB_HOST" ] && [ -n "$DB_NAME" ] && [ -n "$DB_USER" ] || { echo "❌ DB_HOST, DB_NAME ou DB_USER vide dans $ENV_FILE" >&2; exit 1; }

CNF="$(mktemp)"; chmod 600 "$CNF"
PARTIAL=""
trap 'rm -f "$CNF"; [ -z "$PARTIAL" ] || rm -f "$PARTIAL"' EXIT
printf '[client]\nhost=%s\nport=%s\nuser=%s\npassword="%s"\n' "$DB_HOST" "$DB_PORT" "$DB_USER" "${DB_PSW//\"/\\\"}" > "$CNF"

client() { command -v mariadb >/dev/null && echo mariadb || echo mysql; }
dumper() { command -v mariadb-dump >/dev/null && echo mariadb-dump || echo mysqldump; }
sql() { "$(client)" --defaults-extra-file="$CNF" --batch --skip-column-names "$DB_NAME" "$@"; }

# Connexion vérifiée d'emblée : une base injoignable arrête tout, avant de rien conclure.
sql -e "SELECT 1" >/dev/null || { echo "❌ Connexion impossible à $DB_NAME sur $DB_HOST:$DB_PORT : arrêt" >&2; exit 1; }

# Migrations numérotées uniquement (001_…) : les scripts ponctuels
# (prod_rattrapage…, preprod_remise_a_niveau) et le dossier a-venir/ sont ignorés.
migration_files() { find "$MIGRATIONS_DIR" -maxdepth 1 -type f -name '[0-9][0-9][0-9]_*.sql' | sort; }
applied_versions() {
    if [ "$(sql -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'schema_migrations'")" = "0" ]; then
        return 0
    fi
    sql -e "SELECT version FROM schema_migrations"
}
pending_files() {
    local applied files
    applied="$(applied_versions)"
    files="$(migration_files)"
    [ -n "$files" ] || return 0
    while IFS= read -r f; do
        local v; v="$(basename "$f" .sql)"
        grep -qxF "$v" <<< "$applied" || echo "$f"
    done <<< "$files"
}

case "$ACTION" in
backup)
    mkdir -p "$BACKUP_DIR"; chmod 700 "$BACKUP_DIR"
    OUT="$BACKUP_DIR/flepourtous-$ENV_NAME-$(date -u +%Y%m%d-%H%M%S)Z.sql.gz"
    echo "💾 Dump $ENV_NAME ($DB_NAME) → $OUT"
    # Écrit dans un .part puis renomme : un dump interrompu ne passe jamais pour un dump valide,
    # et le .part est effacé en sortie (trap) si quoi que ce soit échoue.
    PARTIAL="$OUT.part"
    if ! "$(dumper)" --defaults-extra-file="$CNF" --single-transaction --quick --triggers --no-tablespaces "$DB_NAME" | gzip > "$PARTIAL" \
        || ! gzip -t "$PARTIAL" \
        || ! gzip -dc "$PARTIAL" | tail -n 1 | grep -q 'Dump completed'; then
        echo "❌ Dump échoué ou incomplet : déploiement arrêté" >&2; exit 1
    fi
    mv "$PARTIAL" "$OUT"; PARTIAL=""; chmod 600 "$OUT"
    echo "✅ $(du -h "$OUT" | cut -f1) — conservation : $KEEP_BACKUPS derniers dumps $ENV_NAME"
    ls -1t "$BACKUP_DIR"/flepourtous-"$ENV_NAME"-*.sql.gz | tail -n +"$((KEEP_BACKUPS + 1))" | while IFS= read -r old; do
        echo "🗑️  $(basename "$old")"; rm -f -- "$old"
    done
    ;;
status)
    echo "📋 $ENV_NAME ($DB_NAME) — appliquées :"
    applied_versions | sed 's/^/   ✔ /'
    echo "📋 En attente :"
    pending_files | sed 's/^/   • /' | grep . || echo "   (aucune)"
    ;;
migrate)
    PENDING="$(pending_files)"
    if [ -z "$PENDING" ]; then echo "✅ $ENV_NAME : aucune migration en attente"; exit 0; fi
    while IFS= read -r f; do
        v="$(basename "$f" .sql)"
        echo "🛠️  $ENV_NAME : $v"
        # Pas de transaction possible (chaque ALTER TABLE est validé aussitôt sous MariaDB) :
        # en cas d'échec on s'arrête, le site reste sur l'ancien code, et le dump fait juste avant permet de revenir.
        sql < "$f" || { echo "❌ Échec de $v : déploiement arrêté. Dump du jour dans $BACKUP_DIR" >&2; exit 1; }
        sql -e "INSERT IGNORE INTO schema_migrations (version) VALUES ('$v')"
    done <<< "$PENDING"
    echo "✅ $ENV_NAME : migrations appliquées"
    ;;
esac
