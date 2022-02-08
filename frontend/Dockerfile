FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

RUN yarn build:ssr
RUN yarn global add pm2
CMD ["pm2-runtime", "dist/ssr/index.js"]
