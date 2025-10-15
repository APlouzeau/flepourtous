# 🚀 Guide des Environnements

Ce projet dispose de 3 environnements distincts :

## 📦 Environnements disponibles

### 1. DEV (Développement Local)
**Usage :** Développement quotidien sur ta machine locale
**Commande :** `make dev`
**URLs :**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- phpMyAdmin: http://localhost:8081
- Database: localhost:3307

**Caractéristiques :**
- ✅ Hot reload activé
- ✅ Base de données locale
- ✅ Pas de HTTPS
- ✅ Accès direct aux ports

---

### 2. STAGING (Debug sur VPS)
**Usage :** Débugger des bugs difficiles sur le VPS avec hot reload
**Commande :** `make staging`
**URLs :**
- Frontend: https://staging.flepourtous.plouzor.fr
- Backend: https://api-staging.flepourtous.plouzor.fr

**Caractéristiques :**
- ✅ Hot reload activé (modifications instantanées)
- ✅ HTTPS via Traefik
- ✅ Environnement proche de la production
- ✅ Parfait pour débugger

**⚠️ Important :** Les modifications de code sont appliquées en temps réel !

---

### 3. PREPROD (Validation finale)
**Usage :** Valider les changements avant la mise en production
**Commande :** `make preprod`
**URLs :**
- Frontend: https://flepourtous.plouzor.fr
- Backend: https://api.flepourtous.plouzor.fr

**Caractéristiques :**
- ❌ Pas de hot reload (code buildé et optimisé)
- ✅ HTTPS via Traefik
- ✅ Identique à la production
- ✅ Performances optimales

---

## 🔄 Workflow recommandé

### Pour développer une nouvelle feature

1. **Développement local**
   ```bash
   git checkout -b feat/ma-nouvelle-feature
   make dev
   # Code, test, repeat...
   ```

2. **Si bug uniquement sur le VPS** (rare)
   ```bash
   # Sur le VPS
   git checkout feat/ma-nouvelle-feature
   make staging
   # Debug avec hot reload
   ```

3. **Validation en preprod**
   ```bash
   git checkout preprod
   git merge feat/ma-nouvelle-feature
   git push
   # Sur le VPS
   make preprod
   ```

---

## 🐛 Pour débugger le bug de rendez-vous

### Problème actuel
Les `console.log()` n'apparaissent pas car preprod n'a pas de hot reload.

### Solution
```bash
# Sur le VPS
cd ~/projects/preprod/flepourtous
git checkout preprod  # ou ta branche de feature
make staging

# Maintenant tu peux modifier le code et voir les changements instantanément
docker logs -f frontend-staging  # Pour voir les logs
```

---

## 📝 Commandes utiles

### Démarrer un environnement
```bash
make dev       # Local
make staging   # Staging avec hot reload
make preprod   # Preprod (production-like)
```

### Arrêter un environnement
```bash
make down          # Dev
make down-staging  # Staging
make down-preprod  # Preprod
```

### Redémarrer un environnement
```bash
make restart         # Dev
make restart-staging # Staging
make restart-preprod # Preprod
```

### Voir les logs
```bash
make logs              # Tous les services
make logs-frontend     # Frontend uniquement
make logs-backend      # Backend uniquement
docker logs -f frontend-staging  # Frontend staging
docker logs -f backend-staging   # Backend staging
```

### Rebuild les images
```bash
make build           # Dev
make build-staging   # Staging
make build-preprod   # Preprod
```

---

## ⚠️ Points d'attention

1. **Staging = Debug uniquement**
   Ne l'utilise que pour débugger des problèmes complexes. Pour le dev quotidien, utilise `make dev` en local.

2. **Preprod = Production-like**
   Toujours valider sur preprod avant de merger dans `main`.

3. **Hot reload = Performance dégradée**
   Staging sera plus lent que preprod à cause du mode dev.

4. **DNS requis pour staging**
   Assure-toi d'avoir configuré les DNS pour :
   - `staging.flepourtous.plouzor.fr`
   - `api-staging.flepourtous.plouzor.fr`

---

## 🎯 Résumé visuel

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│                 │   DEV        │  STAGING     │  PREPROD     │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ Localisation    │ Local        │ VPS          │ VPS          │
│ Hot Reload      │ ✅           │ ✅           │ ❌           │
│ HTTPS           │ ❌           │ ✅           │ ✅           │
│ Performance     │ Normale      │ Normale      │ Optimale     │
│ Usage           │ Dev daily    │ Debug        │ Validation   │
│ Base de données │ Locale       │ Partagée     │ Production   │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```
