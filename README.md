# mobility-infra

駐停車（駐車場）領域のデジタル化・自動化を行う自社 SaaS のモノレポ。

> 📝 **学習・キャッチアップの記録は `doc/` に日付き（日時）で残す。**
> 例: `doc/2026-07-03.md`。README には常設情報（構成・使い方）のみを書き、日々の学習ログはここではなく `doc/` に追記していく。

### 学習記録（トピック別）

- [doc/](doc/) — 学習・調査ログの置き場
- [doc/NestJs/](doc/NestJs/) — NestJS
- [doc/GCP/](doc/GCP/) — GCP / Cloud Monitoring
- [doc/marketing/](doc/marketing/) — マーケ・業界調査

## キャッチアップ目標

### NestJS の基礎概念の理解

実務で使う大まかな流れを、以下の動画で理解する（約1時間 / 2日予想）。

- [NestJS の基礎動画（YouTube・約1時間）](https://www.youtube.com/watch?v=Q6NpiIp-6WM)

### GCP の理解

AWS のインフラ構築経験はあるが、リソースの理解が浅い。AWS Black Belt に相当する教材があるか調査中。

**キャッチアップ手順**

- コンソール画面を触りながら、IaC で `apply` と `destroy` を繰り返して理解する
- Cloud Monitoring の使い方を押さえる

## 今後の課題

- Makefile で起動しているが、Nix で環境差異をなくしたい

## 業界課題の調査

### 市場規模

AISCEAS のフレームワークに沿って、カスタマージャーニーマップでユーザー体験のフローを行動追跡の観点で捉える。ユーザーがどのような感情で動き、興味へ移るのかを追う。

### 指標と分析

| 指標 | 意味 |
|---|---|
| CTR（クリック率） | クリック数 / 表示回数 |
| CPC（クリック単価） | 1 クリックにかかる費用 |
| CPA（獲得単価） | 1 成約（獲得）にかかる費用 |
| PV | ページビュー数 |
| セッション数 | 訪問の回数 |
| UU（ユニークユーザー） | 訪問した人の数（重複なし） |

### 課題アプローチ

- 表示回数はあるがクリックされない → タイトル・説明文（CTR）を見直す
- クリックはされるが売れない → CPA を見直す
- 客観的なユーザー行動のフローから「設計・分析・改善」を繰り返すフローを構築する

## 技術スタック

| レイヤ | 採用技術 |
|---|---|
| バックエンド | TypeScript / **Nest.js** |
| フロントエンド | TypeScript / **Next.js** |
| インフラ | GCP（Cloud Run 想定） |
| DB | PostgreSQL 18 |
| キャッシュ | Valkey（Redis 互換） |
| AI / 分析 | Python / FastAPI, JupyterLab |
| モニタリング | Cloud Monitoring |
| CI/CD | GitHub Actions |

## サービス構成（`services/`）

| サービス | 役割 | ランタイム | 公開経路 |
|---|---|---|---|
| `backend` | REST API（運営者・利用者共通のバックエンド） | Node 22 / Nest.js | `/api` |
| `frontend` | 運営者向け管理画面 | Node 22 / Next.js | `/` |
| `portal` | 利用者向けポータル（申込〜契約） | Node 22 / Next.js | `/portal` |
| `web` | エッジ（nginx リバースプロキシ） | nginx | `:80` |
| `model` | AI 推論 API | Python / FastAPI | `/model` |
| `notebook` | データ分析環境（dev 専用） | JupyterLab | `:8888` |
| `db` | データベース | PostgreSQL 18 | `:5432` |
| `cache` | キャッシュ / セッション | Valkey | `:6379` |

## 開発（すべて Docker 内で完結。ホストに Node/Python は不要）

```bash
make up      # 開発スタックを起動（ホットリロード）
make down    # 停止
make check   # typecheck / lint / build を Docker 内で実行
```

- 管理画面: <http://localhost/>
- ポータル: <http://localhost/portal>
- API: <http://localhost/api/health>
- AI (Swagger): <http://localhost:8000/model/docs>
- Notebook: <http://localhost:8888>

## 本番ビルド（distroless・非root）

```bash
cp docker/.env.prod.example docker/.env.prod   # 値を埋める
docker compose --env-file docker/.env.prod -f docker/docker-compose.prod.yml up -d --build
```
