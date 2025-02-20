-include .env

init: ## Init the project
	docker compose build --no-cache --progress plain
	npm install

start: ## To start the containers
	docker compose up fe-db fe-service face-encoding-service

down: ## To stop the containers
	docker compose down

generate-migration: ## Will create a migration file by checking the schema and db. Can be run like this: name=init make generate-migration
	docker compose exec fe-service npm run typeorm migration:generate "src/core/orm/migrations/${name}"

migrate: ## Will run the migrations queued to be run
	docker compose exec fe-service npm run typeorm migration:run

migrate-down: ## Will revert the last migration
	docker compose exec fe-service npm run typeorm migration:revert

create-migration: ## Will create an empty migration file. Can be run like this: name=init make create-migration
	docker compose exec fe-service npm run typeorm-create-migration migration:create "src/core/orm/migrations/${name}"