# Next.js フロントエンド（管理画面 / Node 22 / pnpm）。dev=next dev / prod=standalone を distroless で実行。
FROM node:22-bookworm-slim AS deps
RUN corepack enable
WORKDIR /app
COPY services/frontend/package.json services/frontend/pnpm-lock.yaml services/frontend/.npmrc ./
RUN pnpm install --frozen-lockfile

FROM node:22-bookworm-slim AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY services/frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# dev: ソースは compose の bind マウントで /app に入る
FROM node:22-bookworm-slim AS dev
RUN corepack enable
WORKDIR /app
EXPOSE 3000
CMD ["sh", "-c", "pnpm install && pnpm run dev"]

# prod: distroless 非root、standalone を node で実行
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS prod
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# sharp(libvips) が要する共有ライブラリ。distroless に無い2つを builder から補う
COPY --from=builder /usr/lib/x86_64-linux-gnu/libstdc++.so.6* /usr/lib/x86_64-linux-gnu/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libgcc_s.so.1* /usr/lib/x86_64-linux-gnu/
USER 65532:65532
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static
COPY --from=builder --chown=65532:65532 /app/public ./public
EXPOSE 3000
CMD ["server.js"]
