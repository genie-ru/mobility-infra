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

# dev: ソースは compose の bind マウントで /app に入る。
# 生成物(node_modules 等)をホスト(genie=uid1000)と同じ所有者にするため、node イメージ同梱の
# node ユーザー(uid/gid 1000)で実行する。これで bind マウントに root 所有ファイルを作らせない。
# 名前指定(USER node)なので HOME=/home/node が設定され、corepack/pnpm のDL・ストアも書き込める。
FROM node:24-bookworm-slim AS dev
# nest start --watch(tsc-watch) は再起動時に tree-kill で旧プロセスを終了させるが、
# tree-kill は ps(procps) に依存する。slim には ps が無く、欠けると子プロセス(node)を
# 特定できず kill できない → orphan 化して 8080 を握り続け EADDRINUSE になる。dev のみ導入。
RUN apt-get update && apt-get install -y --no-install-recommends procps \
 && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app
RUN chown node:node /app
USER node
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
