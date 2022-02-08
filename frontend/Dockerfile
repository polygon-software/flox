FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform

COPY . .

RUN rm -rf dist

CMD ["yarn", "build:ssr"]
RUN cd dist/ssr
CMD ["yarn", "start"]
