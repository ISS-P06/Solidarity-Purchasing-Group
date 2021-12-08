FROM node:16 as base

WORKDIR /app

COPY package*.json ./
RUN npm install --silent 

COPY . .

FROM base as test
CMD "npm" "run" "test:watch"

FROM base as development
EXPOSE 3001
CMD "npm" "run" "dev"

FROM base as production
EXPOSE 3001
CMD "npm" "run" "start"