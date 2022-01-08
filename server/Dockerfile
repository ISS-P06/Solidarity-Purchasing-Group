FROM node:16 as base

WORKDIR /app
COPY package*.json ./

# testing terget

FROM base as test
RUN npm ci --silent 
COPY . .
CMD "npm" "run" "test:watch"

# development target

FROM base as development
RUN npm install --silent 
COPY . .
EXPOSE 3001
CMD "npm" "run" "dev"

# prudction target

FROM base as production
RUN npm ci --silent 
COPY . .
EXPOSE 3001
CMD "npm" "run" "start"