FROM node:16 as base

WORKDIR /app

COPY package*.json ./

FROM base as test
RUN npm ci --silent

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

CMD "npm" "test"

FROM base as development
RUN npm install --silent

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

EXPOSE 3000
CMD "npm" "start"  
