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
	
deploy-db:
	npx prisma migrate deploy --skip-seed

migrate:
	npx prisma migrate dev

generate:
	npx prisma generate && npx prisma db seed

format-prisma:
	npx prisma format

seed:
	npx prisma db seed

studio:
	npx prisma studio