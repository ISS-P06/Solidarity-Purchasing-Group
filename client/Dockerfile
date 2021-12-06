FROM node:16 as base

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

FROM base as test

CMD "npm" "test"

FROM base as development

EXPOSE 3000
CMD "npm" "start"  
