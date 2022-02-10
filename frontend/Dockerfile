FROM node:14-alpine

WORKDIR /usr/src/app

COPY frontend/package.json ./
COPY frontend/yarn.lock ./

WORKDIR /frontend

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

RUN yarn build:ssr
RUN rm -rf node_modules
WORKDIR dist/ssr
CMD ["yarn", "start"]
