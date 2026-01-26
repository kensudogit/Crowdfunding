# Railway クイックスタートガイド

## 5分でデプロイ

### ステップ1: Railwayアカウント作成
1. [railway.app](https://railway.app)にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでログイン

### ステップ2: プロジェクト作成
1. 「New Project」→「Deploy from GitHub repo」を選択
2. リポジトリを選択

### ステップ3: PostgreSQLデータベース追加
1. 「New」→「Database」→「Add PostgreSQL」をクリック
2. データベースが作成されるのを待つ

### ステップ4: バックエンドデプロイ
1. 「New」→「GitHub Repo」を選択（同じリポジトリ）
2. サービス名: `backend`
3. 「Settings」→「Root Directory」: `backend`
4. 「Settings」→「Dockerfile Path」: `Dockerfile.prod`
5. 「Variables」タブで以下を設定：

```env
NODE_ENV=production
PORT=8000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=<強力なランダム文字列>
FRONTEND_URL=https://<フロントエンドのURL>
CORS_ORIGIN=https://<フロントエンドのURL>
```

**JWT_SECRETの生成方法:**
```bash
openssl rand -base64 32
```

### ステップ5: フロントエンドデプロイ
1. バックエンドのデプロイが完了したら、そのURLをコピー
2. 「New」→「GitHub Repo」を選択（同じリポジトリ）
3. サービス名: `frontend`
4. 「Settings」→「Root Directory」: `frontend`
5. 「Settings」→「Dockerfile Path」: `Dockerfile.prod`
6. 「Variables」タブで以下を設定：

```env
VITE_API_URL=https://<バックエンドのURL>/api
```

### ステップ6: データベース初期化
1. バックエンドがデプロイされたら、以下のURLにアクセス：
   ```
   https://<バックエンドのURL>/api/sample-data/generate
   ```
2. または、Railway CLIで：
   ```bash
   railway connect postgres
   psql -f database/init/01_init.sql
   psql -f database/init/02_sample_data.sql
   ```

### ステップ7: カスタムドメイン設定（オプション）
1. 各サービスの「Settings」→「Domains」でカスタムドメインを追加
2. DNS設定をRailwayの指示に従って設定

## 完了！

フロントエンドのURLにアクセスして、アプリケーションが動作していることを確認してください。

詳細な手順は `RAILWAY_DEPLOY.md` を参照してください。
