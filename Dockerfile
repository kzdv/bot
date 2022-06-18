FROM node:lts-alpine

RUN apk update
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY config.json.sh ./
COPY src /app/src

RUN npm install && npm run build

CMD ["npm", "run", "prod"]