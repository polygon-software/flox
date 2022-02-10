FROM node:14-alpine

WORKDIR /usr/src/app

COPY /backend /backend/
COPY /shared /shared/

WORKDIR /shared
RUN yarn --ignore-platform

WORKDIR ../backend
RUN yarn --ignore-platform

RUN rm -rf dist

RUN yarn build
#COPY backend/dist backend/dist/

CMD ["yarn", "start:prod"]
