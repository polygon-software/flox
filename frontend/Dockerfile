FROM node:14-alpine

WORKDIR /usr/src/app

COPY frontend/package.json ./
COPY frontend/yarn.lock ./

COPY /frontend /frontend
COPY /shared /shared

WORKDIR /frontend
RUN yarn --ignore-platform

RUN rm -rf dist

RUN yarn build:ssr
RUN rm -rf node_modules
WORKDIR dist/ssr
CMD ["yarn", "start"]
