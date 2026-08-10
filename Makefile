SHELL := /bin/bash

# General Command
up:
	docker compose up -d

down:
	docker compose down

up-build:
	docker compose up --build -d

build:
	docker compose build

logs:
	docker compose logs -f $(s)

test: test-frontend test-backend

check: check-frontend check-backend

fix: fix-frontend fix-backend 

# Frontend Service
up-frontend:
	docker compose up -d frontend

down-frontend:
	docker compose down frontend

test-frontend:
	cd apps/frontend && npm test

check-frontend:
	cd apps/frontend && npm run format-check

fix-frontend:
	cd apps/frontend && npm run format

# Backend Service
up-backend:
	docker compose up -d backend

down-backend:
	docker compose down backend

test-backend:
	cd apps/backend && npm test

check-backend:
	cd apps/backend && npm run format-check

fix-backend:
	cd apps/backend && npm run format