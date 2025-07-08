# Installe toutes les dépendances (backend et frontend)
install:
	@echo "--- Installation des dépendances backend... ---"
	@cd backend && composer install
	@echo "--- Installation des dépendances frontend... ---"
	@cd frontend && pnpm install
	@echo "--- Installation terminée. ---"

# Lance le serveur de développement frontend
dev:
	@echo "--- Lancement du serveur de développement frontend... ---"
	@cd frontend && pnpm run dev

# Raccourci pour tout installer et lancer
i: install dev