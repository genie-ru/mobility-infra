# Nest.js（Node 24 / pnpm）。dev=ホットリロード / prod=distroless 非root。
FROM node:24-bookworm-slim AS deps
RUN corepack enable
WORKDIR /app
COPY services/backend/package.json services/backend/pnpm-lock.yaml services/backend/.npmrc ./
# lockfile と package.json のズレを検知して落とす（本番の再現性を担保）
RUN pnpm install --frozen-lockfile

FROM node:24-bookworm-slim AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY services/backend/ ./
RUN pnpm run build && pnpm prune --prod

# dev: ソースは compose の bind マウントで /app に入る
FROM node:24-bookworm-slim AS dev
RUN corepack enable
WORKDIR /app
EXPOSE 8080
CMD ["sh", "-c", "pnpm install && pnpm run start:dev"]

# prod: distroless 非root（ENTRYPOINT=node）
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS prod
WORKDIR /app
USER 65532:65532
ENV NODE_ENV=production
COPY --from=builder --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=builder --chown=65532:65532 /app/dist ./dist
COPY --from=builder --chown=65532:65532 /app/package.json ./
EXPOSE 8080
CMD ["dist/main.js"]
