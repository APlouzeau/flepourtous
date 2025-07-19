.PHONY: help install build up down clean logs restart setup dev prod

# Variables
COMPOSE_FILE = compose.yml
FRONTEND_DIR = frontend
BACKEND_DIR = backend

# Aide par défaut
help: ## Affiche cette aide
	@echo "Commands disponibles :"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Setup initial pour nouveaux développeurs
first-install: ## Installation complète pour nouveau projet
	@echo "🚀 Setup initial du projet..."
	@echo "📦 Installation des dépendances frontend..."
	cd $(FRONTEND_DIR) && pnpm install
	@echo "📦 Installation des dépendances backend..."
	cd $(BACKEND_DIR) && composer install
	@echo "✅ Setup terminé ! Vous pouvez maintenant faire 'make dev'"

# Développement
dependencies: ## Installe les dépendances localement (pour IDE)
	@echo "📦 Installation des dépendances pour l'IDE..."
	cd $(FRONTEND_DIR) && pnpm install
	cd $(BACKEND_DIR) && composer install

build: ## Build les images Docker
	docker compose -f $(COMPOSE_FILE) build

dev: build ## Lance l'environnement de développement
	@echo "🔥 Démarrage de l'environnement de développement..."
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "✅ Environnement prêt !"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:8000"
	@echo "🗃️  PhpMyAdmin: http://localhost:8081"

up: ## Démarre les services (sans rebuild)
	docker compose -f $(COMPOSE_FILE) up -d

down: ## Arrête tous les services
	docker compose -f $(COMPOSE_FILE) down

restart: down dev ## Redémarre complètement l'environnement

# Logs et debug
logs: ## Affiche les logs de tous les services
	docker compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Logs du backend uniquement
	docker compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Logs du frontend uniquement
	docker compose -f $(COMPOSE_FILE) logs -f frontend

# Nettoyage
clean: ## Nettoie les containers et volumes
	docker compose -f $(COMPOSE_FILE) down -v
	docker system prune -f

clean-all: ## Nettoyage complet (images, volumes, cache)
	docker compose -f $(COMPOSE_FILE) down -v
	docker system prune -a -f --volumes
	docker builder prune -a -f

# Production (à venir)
prod: ## Lance en mode production
	@echo "🚀 Mode production pas encore configuré"

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

update: ## Met à jour les dépendances
	cd $(FRONTEND_DIR) && pnpm update
	cd $(BACKEND_DIR) && composer update