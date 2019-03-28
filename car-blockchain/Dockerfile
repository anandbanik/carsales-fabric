FROM node:latest

RUN mkdir car-blockchain

WORKDIR /car-blockchain/

COPY config ./config

COPY src ./src

COPY test ./test

COPY package.json ./

COPY xclap.js ./


RUN npm install
RUN node_modules/.bin/clap build

EXPOSE 3000

CMD "npm" "run" "prod"