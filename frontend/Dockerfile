FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform
RUN yarn global add @vue/cli
RUN yarn global add @quasar/cli

COPY . .

RUN rm -rf dist

RUN quasar build -m ssr
WORKDIR /dist/ssr
RUN yarn --ignore-platform
CMD ["yarn", "start"]
