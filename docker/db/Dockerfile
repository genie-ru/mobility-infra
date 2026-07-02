# base: dev は初期化SQLを bind マウント / prod: 焼き込み
FROM postgres:18-alpine AS base

FROM base AS prod
COPY services/db/ /docker-entrypoint-initdb.d
