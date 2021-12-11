dev: install generate
	npx ts-node-dev --pretty --transpile-only src/index.ts

install:
	npm install

db:
	docker-compose up

build:
	tsc --outDir dist

start:
	ts-node src/index.ts

deploy-db:
	npx prisma migrate deploy --skip-seed

migrate:
	npx prisma migrate dev

generate:
	npx prisma generate

lint:
	npx eslint . --ext .ts --fix 

format-prisma:
	npx prisma format

seed:
	npx prisma db seed

studio:
	npx prisma studio