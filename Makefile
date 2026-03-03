.PHONY: help install setup dev build start redis-up redis-down clean clean-modules clean-redis clean-all

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Setup"
	@echo "  install        Install npm dependencies"
	@echo "  setup          Copy .env.example to .env (skips if .env exists)"
	@echo ""
	@echo "Development"
	@echo "  dev            Start server in watch mode"
	@echo "  build          Compile TypeScript to dist/"
	@echo "  start          Run compiled server"
	@echo ""
	@echo "Redis"
	@echo "  redis-up       Start Redis container"
	@echo "  redis-down     Stop Redis container"
	@echo ""
	@echo "Cleanup"
	@echo "  clean          Remove dist/"
	@echo "  clean-modules  Remove node_modules/"
	@echo "  clean-redis    Stop Redis and remove its volume"
	@echo "  clean-all      Remove dist/, node_modules/, and Redis volume"

install:
	npm install

setup:
	@if [ ! -f .env ]; then cp .env.example .env && echo ".env created — add your VISUAL_CROSSING_API_KEY"; else echo ".env already exists, skipping"; fi

dev:
	npm run dev

build:
	npm run build

start:
	npm start

redis-up:
	docker compose up -d

redis-down:
	docker compose down

clean:
	rm -rf dist/

clean-modules:
	rm -rf node_modules/

clean-redis:
	docker compose down -v

clean-all: clean clean-modules clean-redis
