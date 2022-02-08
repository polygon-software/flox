FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-platform
RUN yarn global add @vue/cli
RUN yarn global add @quasar/cli

COPY . .

RUN rm -rf dist

FROM develop-stage as build-stage
RUN yarn \
    && yarn lint \
    && quasar build -m ssr

# production stage
FROM nginx:1.17.5-alpine as production-stage
COPY --from=build-stage /app/dist/ssr /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
