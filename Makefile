dev:
	npx ts-node-dev --respawn --pretty --transpile-only src/index.ts

redis:
	docker-compose up