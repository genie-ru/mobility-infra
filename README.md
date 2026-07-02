# mobility-infra
# キャッチアップ目標

### NestJsの基礎概念の理解
以下のサイトにて実務で使用する大まかな流れを理解する。
動画1時間(2日予想)

https://www.youtube.com/watch?v=Q6NpiIp-6WM


### GCPの理解
Awsのインフラ構築はしたことはあるが、リソースの理解をしていない
Aws Blackbeltに相当するものがあるかどうか調査中

キャッチアップ手順
コンソール画面を触れながらlacでapplyとdestroyを繰り返して理解する
Cloud Monitorinの使い方


## 今後課題

Makefileで起動しているが、Nixで環境差異をなくしたい。

駐停車（駐車場）領域のデジタル化・自動化を行う自社 SaaS のモノレポ。

## 業界課題の調査

### 市場規模

AISCEASのフレームワークに沿ってユーザー体験のフローをカスタマージャニーマップで行動追跡観点

ユーザーはどのような感情で動き、興味に移るのか、
### 指標と分析

#### CTR(クリック率): クリック数/表示回数
#### CPC(クリック単価): 1クリックにかかる費用
#### CPA(獲得単価): 1製薬にかかる費用
#### PV: ページビュー数
#### セッション数: 訪問の回数
#### UU(ユニークユーザー): 訪問した人の数(重複なし)

## 課題アプローチ
#### 表示回数はあるがクリックされない場合「タイトル・説明文(CTR):」を見直す

#### クリックはされるが売れないのであればCPAを見直す

#### 客観的なユーザーの行動のフローから「設計・分析・改善」の繰り返しのフローを構築すること

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
