# Build context is the monorepo root: apps/api depends on the
# @zen/types workspace, whose entrypoint is raw TypeScript.
FROM node:24-alpine

ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# Every workspace manifest referenced by the lockfile must be present
# before `npm ci`, even the ones we do not install.
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/types/package.json ./packages/types/

RUN npm ci --omit=dev --workspace api --include-workspace-root

COPY packages/types ./packages/types
COPY apps/api ./apps/api

USER node
WORKDIR /app/apps/api

EXPOSE 8080
CMD ["/app/node_modules/.bin/tsx", "src/server.ts"]
