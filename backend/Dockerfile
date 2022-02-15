FROM node:16-alpine

WORKDIR /full-stack-bootstrap/backend

COPY backend .

WORKDIR /full-stack-bootstrap/shared

COPY shared .
RUN yarn --ignore-platform

WORKDIR /full-stack-bootstrap/backend

RUN yarn --ignore-platform

RUN rm -rf dist

RUN yarn build

WORKDIR ./dist/backend/src

CMD ["node", "main.js"]
