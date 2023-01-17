FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
# RUN npm ci --only=production
COPY . .

RUN npm run build
# Start from dist
WORKDIR /usr/src/app/dist

EXPOSE 8081
CMD [ "node", "index.js" ]