FROM node:latest

RUN mkdir car-service

WORKDIR /car-service/

COPY bin ./bin

COPY server ./server

COPY app.js ./

COPY package.json ./

RUN ls -la

RUN npm install

RUN npm install pm2 -g

#CMD "echo" "Hello World!"

#CMD "pm2" "start" "./bin/www"

CMD "npm" "run" "start:dev"
