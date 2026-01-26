# Railway デプロイガイド

このガイドでは、CrowdfundingプラットフォームをRailwayに完全公開モードでデプロイする手順を説明します。

## 前提条件

- Railwayアカウント（[railway.app](https://railway.app)で作成）
- Railway CLI（オプション、推奨）
- Gitリポジトリ（GitHub、GitLab、Bitbucketなど）

## デプロイ手順

### 1. Railwayプロジェクトの作成

1. [Railway Dashboard](https://railway.app/dashboard)にログイン
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択（または「Empty Project」を選択）

### 2. PostgreSQLデータベースの追加

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. データベースが作成されたら、接続情報をメモしておく

### 3. バックエンドサービスのデプロイ

#### 方法A: GitHubリポジトリからデプロイ（推奨）

1. Railwayプロジェクトで「New」→「GitHub Repo」を選択
2. リポジトリを選択
3. 「Settings」→「Root Directory」を `backend` に設定
4. 「Settings」→「Dockerfile Path」を `Dockerfile.prod` に設定
5. 「Settings」→「Deploy」をクリック

#### 方法B: Railway CLIを使用

```bash
# Railway CLIをインストール
npm i -g @railway/cli

# ログイン
railway login

# プロジェクトに接続
railway link

# バックエンドディレクトリに移動
cd backend

# デプロイ
railway up --dockerfile Dockerfile.prod
```

### 4. フロントエンドサービスのデプロイ

1. Railwayプロジェクトで「New」→「GitHub Repo」を選択（同じリポジトリ）
2. 「Settings」→「Root Directory」を `frontend` に設定
3. 「Settings」→「Dockerfile Path」を `Dockerfile.prod` に設定
4. 「Settings」→「Deploy」をクリック

### 5. 環境変数の設定

#### バックエンド環境変数

Railwayダッシュボードでバックエンドサービスの「Variables」タブで以下を設定：

```env
NODE_ENV=production
PORT=8000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-very-secure-secret-key-change-this-in-production
```

**重要**: `JWT_SECRET`は強力なランダム文字列に変更してください。

#### フロントエンド環境変数

フロントエンドサービスの「Variables」タブで以下を設定：

```env
VITE_API_URL=https://your-backend-service.railway.app/api
```

**注意**: `your-backend-service.railway.app`は、バックエンドサービスのRailwayが提供するURLに置き換えてください。

### 6. カスタムドメインの設定（オプション）

1. 各サービス（バックエンド・フロントエンド）の「Settings」→「Domains」でカスタムドメインを追加
2. DNS設定をRailwayの指示に従って設定

### 7. データベースの初期化

#### 方法1: Railway CLIを使用

```bash
# データベースに接続
railway connect postgres

# 初期化SQLを実行
\i database/init/01_init.sql
\i database/init/02_sample_data.sql
```

#### 方法2: pgAdminまたはpsqlを使用

1. RailwayダッシュボードでPostgreSQLサービスの「Connect」をクリック
2. 接続情報を取得
3. ローカルから接続してSQLファイルを実行

#### 方法3: バックエンドAPIから初期化

1. バックエンドがデプロイされたら、以下のエンドポイントにアクセス：
   ```
   POST https://your-backend-service.railway.app/api/sample-data/generate
   ```

### 8. 動作確認

1. **バックエンド**: `https://your-backend-service.railway.app/api/health` にアクセス
2. **フロントエンド**: `https://your-frontend-service.railway.app` にアクセス
3. ログイン・登録機能をテスト
4. プロジェクト作成・表示機能をテスト

## トラブルシューティング

### バックエンドが起動しない

- 環境変数が正しく設定されているか確認
- Railwayのログを確認（「Deployments」→「View Logs」）
- データベース接続情報を確認

### フロントエンドがAPIに接続できない

- `VITE_API_URL`が正しく設定されているか確認
- バックエンドのCORS設定を確認
- ブラウザのコンソールでエラーを確認

### データベース接続エラー

- RailwayのPostgreSQLサービスの接続情報を確認
- 環境変数の`${{Postgres.*}}`参照が正しいか確認
- データベースが起動しているか確認

### ビルドエラー

- Dockerfileが正しく配置されているか確認
- 必要なファイルが`.railwayignore`で除外されていないか確認
- ビルドログを確認

## 本番環境のベストプラクティス

1. **セキュリティ**
   - `JWT_SECRET`を強力なランダム文字列に設定
   - HTTPSを有効化（Railwayは自動で提供）
   - 環境変数に機密情報を保存

2. **パフォーマンス**
   - データベース接続プールの設定を最適化
   - フロントエンドの静的ファイルをキャッシュ
   - CDNの使用を検討

3. **モニタリング**
   - Railwayのメトリクスを確認
   - エラーログを定期的に確認
   - データベースのパフォーマンスを監視

4. **バックアップ**
   - データベースの定期バックアップを設定
   - 重要なデータのバックアップ戦略を検討

## 環境変数の一覧

### バックエンド

| 変数名 | 説明 | 必須 | デフォルト |
|--------|------|------|-----------|
| `NODE_ENV` | 環境（production/development） | はい | - |
| `PORT` | サーバーポート | いいえ | 8000 |
| `DB_HOST` | データベースホスト | はい | - |
| `DB_PORT` | データベースポート | はい | - |
| `DB_NAME` | データベース名 | はい | - |
| `DB_USER` | データベースユーザー | はい | - |
| `DB_PASSWORD` | データベースパスワード | はい | - |
| `JWT_SECRET` | JWT署名用シークレット | はい | - |

### フロントエンド

| 変数名 | 説明 | 必須 | デフォルト |
|--------|------|------|-----------|
| `VITE_API_URL` | バックエンドAPIのURL | はい | - |

## サポート

問題が発生した場合は、以下を確認してください：

1. Railwayのドキュメント: https://docs.railway.app
2. プロジェクトのログ: Railwayダッシュボードの「Deployments」タブ
3. エラーメッセージ: ブラウザのコンソールとネットワークタブ
