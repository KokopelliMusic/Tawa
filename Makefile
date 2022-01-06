dev:
	npx ts-node-dev --respawn --pretty --transpile-only src/index.ts

redis:
	docker-compose up

redis-cli: 
	docker exec -it tawa-redis redis-cli