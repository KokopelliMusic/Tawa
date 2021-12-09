dev:
	npx ts-node-dev --pretty --transpile-only src/index.ts

postgres-dev:
	docker-compose up

build:
	tsc --outDir dist

start:
	ts-node src/index.ts

lint:
	tslint -c tslint.json src/**/*.ts
	
migrate:
	npx prisma migrate dev

generate:
	npx prisma generate

format-prisma:
	npx prisma format