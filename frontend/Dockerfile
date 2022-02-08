FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

CMD ["yarn", "dev:ssr"]
