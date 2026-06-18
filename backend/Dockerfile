FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g tsx

COPY . .

EXPOSE 5000

CMD ["tsx", "src/server.ts"]