FROM node:14-alpine AS base
WORKDIR /app

FROM base AS build
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn lint
RUN yarn build

FROM base AS final
COPY --from=build ["/app/package.json", "/app/yarn.lock", "./"]
COPY --from=build ["/app/dist/", "./dist/"]
COPY --from=build ["/app/build/", "./build/"]
RUN yarn install --frozen-lockfile --production

EXPOSE 3001
CMD ["yarn", "serve"]
