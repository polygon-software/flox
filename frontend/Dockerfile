FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

RUN quasar build -m ssr
RUN ls
RUN cd dist/ssr
RUN yarn --ignore-platform
RUN ls
CMD ["yarn", "start"]
