.PHONY: help install build up down clean logs restart setup dev prod

# Variables
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.dev.yml
COMPOSE_STAGING_FILE = docker-compose.staging.yml
COMPOSE_PREPROD_FILE = docker-compose.preprod.yml
COMPOSE_PROD_FILE = docker-compose.prod.yml
FRONTEND_DIR = frontend
BACKEND_DIR = backend

# Aide par défaut
help: ## Affiche cette aide
    @echo "Commands disponibles :"
    @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Vérification et installation automatique de pnpm
check-pnpm:
	@echo "🔍 Vérification de pnpm..."
	@if ! command -v pnpm >/dev/null 2>&1; then \
	    echo "📦 Installation de pnpm via npm..."; \
	    npm install -g pnpm; \
	    echo "✅ pnpm installé avec succès !"; \
	else \
	    echo "✅ pnpm disponible"; \
	fi

# Setup initial pour nouveaux développeurs
first-install: check-pnpm network ## Installation complète pour nouveau projet
	@echo "🚀 Setup initial du projet..."
	@echo "📦 Installation des dépendances frontend avec pnpm..."
	cd $(FRONTEND_DIR) && pnpm install
	@echo "🔨 Build des images Docker..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) build
	@echo "📦 Installation des dépendances backend via Docker..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) run --rm backend composer install
	make preprod

# Setup pour la préprod
first-install-preprod: check-pnpm network ## Installation pour environnement préprod
	@echo "🚀 Setup initial du projet (préprod)..."
	@echo "📦 Installation des dépendances frontend avec pnpm..."
	cd $(FRONTEND_DIR) && pnpm install
	@echo "🔨 Build des images Docker..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) build
	@echo "📦 Installation des dépendances backend via Docker..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) run --rm backend composer install
	make preprod

# Développement
dependencies: check-pnpm ## Installe les dépendances localement (pour IDE)
	@echo "📦 Installation des dépendances pour l'IDE avec pnpm..."
	cd $(FRONTEND_DIR) && pnpm install
	@echo "📦 Installation des dépendances backend via Docker..."
	docker compose -f $(COMPOSE_FILE) build backend
	docker compose -f $(COMPOSE_FILE) run --rm backend composer install

# Garder le fallback npm au cas où
dependencies-npm: ## Fallback : installe avec npm si problème pnpm
	@echo "📦 Installation des dépendances avec npm (fallback)..."
	cd $(FRONTEND_DIR) && npm install --legacy-peer-deps
	docker compose -f $(COMPOSE_FILE) run --rm backend composer install

build: ## Build les images Docker
	docker compose -f $(COMPOSE_FILE) build

build-preprod: ## Build les images Docker pour préprod
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) build

build-prod: ## Build les images Docker pour production
	docker compose -f $(COMPOSE_PROD_FILE) build

build-staging: ## Build les images Docker pour staging
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_STAGING_FILE) build

network: ## Crée le réseau web s'il n'existe pas
	@docker network inspect web >/dev/null 2>&1 || docker network create web

dev: network build ## Lance l'environnement de développement
	@echo "🔥 Démarrage de l'environnement de développement..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) --profile dev up -d
	@echo "✅ Environnement prêt !"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:8000"
	@echo "🗃️  PhpMyAdmin: http://localhost:8081"
	@echo "🗄️  Database: localhost:3307 (pour connexions externes)"

staging: network build-staging ## Lance l'environnement staging (debug avec hot reload)
	@echo "🔥 Démarrage de l'environnement staging..."
	@echo "📌 Branche actuelle: $$(git branch --show-current)"
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_STAGING_FILE) up -d
	@echo "✅ Environnement staging prêt avec HOT RELOAD !"
	@echo "📱 Frontend: https://staging.flepourtous.plouzor.fr"
	@echo "🔧 Backend: https://api-staging.flepourtous.plouzor.fr"
	@echo "💡 Les modifications de code sont appliquées en temps réel"

preprod: network build-preprod ## Lance l'environnement de préprod
	@echo "🔥 Démarrage de l'environnement de préprod..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) up -d
	@echo "✅ Environnement préprod prêt !"
	@echo "📱 Frontend: https://flepourtous.plouzor.fr"
	@echo "🔧 Backend: https://api.flepourtous.plouzor.fr"

prod: network ## Lance l'environnement de production
	@echo "🔥 Démarrage de l'environnement de production..."
	docker compose -f $(COMPOSE_PROD_FILE) up --build -d
	@echo "✅ Environnement production prêt !"
	@echo "📱 Frontend: https://flepourtous.fr"
	@echo "🔧 Backend: https://api.flepourtous.fr"

up: ## Démarre les services (sans rebuild)
	docker compose -f $(COMPOSE_FILE) up -d

up-preprod: ## Démarre les services préprod (sans rebuild)
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) up -d

up-staging: ## Démarre les services staging (sans rebuild)
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_STAGING_FILE) up -d

down: ## Arrête tous les services
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) --profile dev down

down-prod: ## Arrête les services production
	docker compose -f $(COMPOSE_PROD_FILE) down

down-preprod: ## Arrête les services préprod
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) down

down-staging: ## Arrête les services staging
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_STAGING_FILE) down

restart-dev: down dev ## Redémarre complètement l'environnement

restart-preprod: down-preprod preprod ## Redémarre complètement l'environnement préprod

restart-staging: down-staging staging ## Redémarre complètement l'environnement staging

restart-prod: down-prod prod ## Redémarre complètement l'environnement production

# Logs et debug
logs: ## Affiche les logs de tous les services
	docker compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Logs du backend uniquement
	docker logs flepourtous-prod-api -f 2>/dev/null || docker compose -f $(COMPOSE_FILE) logs -f api

logs-frontend: ## Logs du frontend uniquement
	docker logs flepourtous-prod-frontend -f 2>/dev/null || docker compose -f $(COMPOSE_FILE) logs -f app

logs-staging: ## Logs de l'environnement staging
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_STAGING_FILE) logs -f

logs-preprod: ## Logs de l'environnement preprod
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_PREPROD_FILE) logs -f

logs-prod: ## Logs de l'environnement production
	docker compose -f $(COMPOSE_PROD_FILE) logs -f

logs-db: ## Logs de la base de données uniquement
	docker compose -f $(COMPOSE_FILE) logs -f db

# Nettoyage
clean: ## Nettoie les containers et volumes
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) --profile dev down -v
	docker system prune -f

clean-all: ## Nettoyage complet (images, volumes, cache)
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) --profile dev down -v
	docker system prune -a -f --volumes
	docker builder prune -a -f

# Utilitaires
shell-backend: ## Shell dans le container backend
	docker compose -f $(COMPOSE_FILE) exec backend bash

shell-frontend: ## Shell dans le container frontend
	docker compose -f $(COMPOSE_FILE) exec frontend sh

db-backup: ## Sauvegarde la base de données
	@echo "💾 Sauvegarde de la base..."
	docker compose -f $(COMPOSE_FILE) exec db mysqldump -u flepourtous -p1234 flepourtous > backup-$(shell date +%Y%m%d-%H%M%S).sql

status: ## Vérifie l'état des services
	@echo "📊 État des services :"
	docker compose -f $(COMPOSE_FILE) ps
	@echo "\n🌐 URLs disponibles :"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000" 
	@echo "PhpMyAdmin: http://localhost:8081"
	@echo "Database: localhost:3307 (pour connexions externes)"

update: ## Met à jour les dépendances
	cd $(FRONTEND_DIR) && npm update
	cd $(BACKEND_DIR) && composer update

db-debug: ## Debug l'initialisation de la base
	@echo "🔍 Debug base de données..."
	@echo "📁 Contenu du dossier db/ :"
	@ls -la db/
	@echo "\n🐳 État du container db :"
	@docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) ps db
	@echo "\n📋 Tables actuelles dans la base :"
	@docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) exec db mysql -u flepourtous -p1234 flepourtous -e "SHOW TABLES;" 2>/dev/null || echo "❌ Impossible de se connecter à la base"

db-import: ## Importe le schéma flepourtous.sql
	@echo "📥 Import du schéma flepourtous.sql..."
	@docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) exec -T db mysql -u flepourtous -p1234 flepourtous < db/flepourtous.sql
	@echo "✅ Schéma importé !"
	@echo "📋 Vérification - tables créées :"
	@docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) exec db mysql -u flepourtous -p1234 flepourtous -e "SHOW TABLES;"

db-reset: ## Recrée la base complètement avec le schéma
	@echo "🗑️  Reset complet de la base..."
	@docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) --profile dev down
	@sudo rm -rf db_data/
	@docker volume rm flepourtous_db_data 2>/dev/null || true


db-drop-recreate: ## Drop et recréation des tables
	@echo "🗑️  Suppression et recréation des tables..."
	@docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) exec db mysql -u flepourtous -p1234 flepourtous -e "DROP	DATABASE IF EXISTS flepourtous; CREATE DATABASE flepourtous;"
	@$(MAKE) db-import

reset-all: 
		docker compose -f docker-compose.yml -f docker-compose.preprod.yml run --rm api composer installecho "🔄 Reset complet du projet..."
	@$(MAKE) clean-all
	@$(MAKE) db-reset
	@$(MAKE) first-install

# Google Calendar Webhooks
google-setup-watch: ## Configure le webhook Google Calendar
	@echo "🔔 Configuration du webhook Google Calendar..."
	@curl -X POST "http://localhost:8000/api/setupGoogleWatch" \
		-H "Content-Type: application/json" \
		-H "Api-Key: $${CRON_KEY:-IFyAdjbJa1OHCFfLirZXtumCrTBprgZKoZMYaKoUE0UozKwSTyCd8LkHBefGPEzY}" \
		-s || echo "❌ Erreur lors de la configuration"
	@echo ""
	@echo "✅ Webhook configuré !"

google-tunnel: ## Lance cloudflared tunnel pour le backend
	@echo "🌐 Lancement du tunnel cloudflared pour le backend..."
	@echo "⚠️  Note: L'URL du tunnel change à chaque redémarrage (version gratuite)"
	@pkill cloudflared 2>/dev/null || true
	@sleep 1
	@cloudflared tunnel --url http://localhost:8000