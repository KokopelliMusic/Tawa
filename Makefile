dev:
	npx ts-node-dev --respawn --pretty --transpile-only src/index.ts

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