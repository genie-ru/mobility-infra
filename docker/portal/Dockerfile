# Next.js 利用者ポータル（Node 24 / pnpm）。dev=next dev / prod=standalone を distroless で実行。
FROM node:24-bookworm-slim AS deps
RUN corepack enable
WORKDIR /app
COPY services/portal/package.json services/portal/pnpm-lock.yaml services/portal/.npmrc ./
RUN pnpm install --frozen-lockfile

FROM node:24-bookworm-slim AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY services/portal/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# dev: ソースは compose の bind マウントで /app に入る。
# 生成物(node_modules 等)をホスト(genie=uid1000)と同じ所有者にするため、node イメージ同梱の
# node ユーザー(uid/gid 1000)で実行する。これで bind マウントに root 所有ファイルを作らせない。
# 名前指定(USER node)なので HOME=/home/node が設定され、corepack/pnpm のDL・ストアも書き込める。
FROM node:24-bookworm-slim AS dev
RUN corepack enable
WORKDIR /app
RUN chown node:node /app
USER node
EXPOSE 3000
CMD ["sh", "-c", "pnpm install && pnpm run dev"]

# prod: distroless 非root、standalone を node で実行
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS prod
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder /usr/lib/x86_64-linux-gnu/libstdc++.so.6* /usr/lib/x86_64-linux-gnu/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libgcc_s.so.1* /usr/lib/x86_64-linux-gnu/
USER 65532:65532
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static
COPY --from=builder --chown=65532:65532 /app/public ./public
EXPOSE 3000
CMD ["server.js"]
