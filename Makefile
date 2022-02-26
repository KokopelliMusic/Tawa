dev-server:
	npx ts-node-dev --respawn --pretty --transpile-only src/index.ts

dev:
	docker-compose --profile dev up

start:
	npx ts-node --transpile-only src/index.ts

build-docker-dev:
	docker build --tag tawa-web-dev --file Dockerfile-Dev . 

redis:
	docker-compose up

redis-cli: 
	docker exec -it tawa-redis redis-cli

db:
	supabase start

stop-supabase:
	docker stop $(docker ps -aq --filter "name=supabase")

clean-supabase: stop-supabase
	docker rm $(docker ps -aq --filter "name=supabase") 