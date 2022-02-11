FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

RUN yarn build:ssr
COPY node_modules ./dist/ssr/

#RUN rm -rf node_modules

WORKDIR dist/ssr
RUN yarn --ignore-platform

CMD ["yarn", "start"]
