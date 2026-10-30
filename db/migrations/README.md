# Migrations de la base

Une migration = un fichier numéroté, appliqué dans l'ordre, une seule fois par environnement.
La table `schema_migrations` enregistre ce qui a été appliqué :

```sql
SELECT * FROM schema_migrations ORDER BY version;
```

## Règles

- **Avant toute exécution en prod : mysqldump**, hors du dépôt (jamais commité) :
  `mysqldump --single-transaction --routines --triggers -u <user> -p <base> | gzip > /chemin/hors-depot/<base>-AAAAMMJJ-HHMM.sql.gz`
- Toujours dans l'ordre : local → preprod (test par la cliente) → prod.
- Sous MariaDB, chaque `ALTER TABLE` est validé immédiatement : une transaction ne protège rien.
  Les scripts ajoutent et copient d'abord, et ne suppriment qu'ensuite, dans un fichier séparé.
- Chaque script est rejouable sans risque (`IF NOT EXISTS`, `INSERT IGNORE`).
- Ce dossier n'est **pas** exécuté automatiquement par Docker au premier lancement
  (le point d'entrée MariaDB ne lit pas les sous-dossiers).

## Fichiers

| Fichier | Rôle | Quand |
|---|---|---|
| `001_users_colonnes_acceptation_prod.sql` | Reproduit les colonnes ajoutées à la main en prod + crée `schema_migrations` | Partout, une fois |
| `002_users_acceptations_par_document.sql` | Une date et une version d'acceptation par document | Avant le déploiement du code qui les utilise |
| `003_users_suppression_anciennes_colonnes.sql` | Supprime les anciennes colonnes, nettoie les fausses dates | Quelques jours après la mise en prod |
| `preprod_remise_a_niveau.sql` | Ramène la preprod à l'état de la prod | Preprod uniquement, avant 001 |
| `prod_rattrapage_2026-10-30.sql` | Prod migrée à la main le 30/10/2026 : l'amène à l'état 001 + 002 + 003 | Déjà appliqué en prod, ne pas relancer ailleurs |

## État des environnements

Au 30/10/2026, prod et preprod sont à `003` (schémas identiques).
En local : `preprod_remise_a_niveau.sql` si la base a le schéma preprod, puis 001, 002, 003.
Prochain changement de schéma : `004_…`.
