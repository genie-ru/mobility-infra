# cache = Valkey（Redis フォーク）
# base: dev は設定を bind マウント / prod: 焼き込み
FROM valkey/valkey:9.1.0-alpine AS base

FROM base AS prod
COPY services/cache/valkey.conf /usr/local/etc/valkey/valkey.conf
