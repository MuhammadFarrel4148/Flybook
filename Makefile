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

# Frontend Service
up-frontend:
	docker compose up -d frontend

down-frontend:
	docker compose down frontend

test-frontend:
	cd apps/frontend && npm test

# Backend Service
up-backend:
	docker compose up -d backend

down-backend:
	docker compose down backend

test-backend:
	cd apps/backend && npm test