# 開発用タスク。`make help` で一覧。
# typecheck・build はすべて Docker 内で実行する（ホストに Node/pnpm は不要）。
.DEFAULT_GOAL := help

COMPOSE := docker compose -f docker/docker-compose.yml

# TS チェック系はホストの uid/gid で実行し、bind マウントに root 所有ファイルを残さない。
# pnpm ストアと HOME は書き込み可能な /tmp に逃がす（bind マウントの所有権と衝突させない）。
UIDGID := $(shell id -u):$(shell id -g)
DRUN := $(COMPOSE) run --rm --no-deps --user $(UIDGID) -e HOME=/tmp -e npm_config_store_dir=/tmp/store

.PHONY: help up down check lint format logs

TS_SERVICES := backend frontend portal

help: ## タスク一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-8s\033[0m %s\n", $$1, $$2}'

up: ## 開発スタックを起動（ホットリロード）
	$(COMPOSE) up -d --build

down: ## 開発スタックを停止
	$(COMPOSE) down

logs: ## 全サービスのログを追う
	$(COMPOSE) logs -f

lint: ## lint + フォーマットチェック（Docker 内、TS サービス）
	@for s in $(TS_SERVICES); do \
		echo "== lint $$s =="; \
		$(DRUN) $$s sh -c 'pnpm install && pnpm run lint && pnpm run format:check' || exit 1; \
	done

format: ## Prettier で自動整形（Docker 内、TS サービス）
	@for s in $(TS_SERVICES); do \
		echo "== format $$s =="; \
		$(DRUN) $$s sh -c 'pnpm install && pnpm run format' || exit 1; \
	done

check: ## typecheck / lint / build を Docker 内で実行（TS サービス）
	@for s in $(TS_SERVICES); do \
		echo "== check $$s =="; \
		$(DRUN) $$s sh -c 'pnpm install && pnpm run typecheck && pnpm run lint && pnpm run format:check && pnpm run build' || exit 1; \
	done
