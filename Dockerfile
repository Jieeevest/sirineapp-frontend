FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx update-browserslist-db@latest

RUN npm rebuild

COPY . .

EXPOSE 3030

CMD ["npm", "run", "dev"]
