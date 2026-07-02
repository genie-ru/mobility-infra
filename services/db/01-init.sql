-- 初回起動時のみ実行される（データボリュームが空のとき）。
-- スキーマ・拡張の初期化はここに追記する。マイグレーションは api 側で管理する想定。

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- アプリのマイグレーションが使う専用スキーマ
CREATE SCHEMA IF NOT EXISTS app;
