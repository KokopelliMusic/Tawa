FROM node:17-buster as base

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install build-essential -y

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH=./build

CMD ["make", "start"]