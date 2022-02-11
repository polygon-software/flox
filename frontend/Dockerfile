FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

RUN yarn build:ssr
#RUN rm -rf node_modules
WORKDIR dist/ssr
RUN yarn global add express
CMD ["yarn", "start"]
