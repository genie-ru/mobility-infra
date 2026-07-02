# base: dev は設定を bind マウント / prod: 設定を焼き込み
FROM nginx:1.27-alpine AS base
EXPOSE 80

FROM base AS prod
# ベースイメージの OS パッケージを最新パッチに更新（Trivy HIGH/CRITICAL 対策）
RUN apk upgrade --no-cache
COPY services/web/ /etc/nginx/conf.d
