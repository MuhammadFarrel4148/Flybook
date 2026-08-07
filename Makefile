SHELL := /bin/bash

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