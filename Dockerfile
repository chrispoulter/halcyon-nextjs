FROM node:16-alpine AS base
WORKDIR /app

ARG VERSION=1.0.0
ENV VERSION=$VERSION

ARG STAGE=local
ENV STAGE=$STAGE

FROM base AS build
ENV REACT_APP_VERSION=$VERSION
ENV REACT_APP_STAGE=$STAGE
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn lint
RUN yarn build

FROM base AS final
ENV NODE_ENV production
COPY --chown=node:node --from=build ["/app/package.json", "/app/yarn.lock", "./"]
COPY --chown=node:node --from=build ["/app/dist/", "./dist/"]
COPY --chown=node:node --from=build ["/app/build/", "./build/"]
RUN yarn install --frozen-lockfile --production

USER node
EXPOSE 3001
ENTRYPOINT ["yarn", "serve"]
