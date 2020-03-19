FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock /
RUN yarn install --production && yarn cache clean

COPY src .

EXPOSE 3001
CMD [ "node", "server.js" ]
