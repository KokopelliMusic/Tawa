dev-server:
	npx ts-node-dev --respawn --pretty --transpile-only src/index.ts

dev:
	docker-compose --profile dev up

start:
	npx ts-node src/index.ts

build-docker-dev:
	docker build --tag tawa-web-dev --file Dockerfile-Dev . 

redis:
	docker-compose up

redis-cli: 
	docker exec -it tawa-redis redis-cli

db:
	supabase start