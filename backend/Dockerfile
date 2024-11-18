FROM node:latest

WORKDIR /usr/src/app

COPY package-lock.json package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "main.js"]
