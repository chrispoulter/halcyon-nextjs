FROM node:16-alpine AS base
WORKDIR /app

ARG VERSION=1.0.0
ENV NEXT_PUBLIC_VERSION=$VERSION
ENV NEXT_TELEMETRY_DISABLED 1

FROM base AS build
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn lint
RUN yarn prisma:generate
RUN yarn build

FROM base AS final
ENV NODE_ENV production
COPY --chown=node:node --from=build ["/app/public", "./public"]
COPY --chown=node:node --from=build ["/app/package.json", "./package.json"]
COPY --chown=node:node --from=build ["/app/.next/standalone", "./"]
COPY --chown=node:node --from=build ["/app/.next/static", "./.next/static"]

USER node
EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
