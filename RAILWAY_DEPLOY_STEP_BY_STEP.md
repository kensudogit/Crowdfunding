# Railway 完全公開デプロイ - ステップバイステップガイド

このガイドでは、CrowdfundingプラットフォームをRailwayに完全公開モードでデプロイする詳細な手順を説明します。

## 📋 前提条件

- ✅ Railwayアカウント（[railway.app](https://railway.app)で作成）
- ✅ GitHubリポジトリにコードがプッシュされている
- ✅ Docker Desktopがローカルで動作している（テスト用）

## 🚀 デプロイ手順

### ステップ1: Railwayアカウントの作成・ログイン

1. [railway.app](https://railway.app)にアクセス
2. 「Start a New Project」または「Login」をクリック
3. GitHubアカウントでログイン（推奨）

### ステップ2: 新しいプロジェクトの作成

1. Railwayダッシュボードで「**New Project**」をクリック
2. 「**Deploy from GitHub repo**」を選択
3. GitHubリポジトリを選択（まだ接続していない場合は接続）
4. プロジェクト名を入力（例: `crowdfunding-platform`）

### ステップ3: PostgreSQLデータベースの追加

1. プロジェクト内で「**+ New**」ボタンをクリック
2. 「**Database**」→「**Add PostgreSQL**」を選択
3. PostgreSQLサービスが作成されるのを待つ（数秒〜1分）
4. データベースサービス名をメモ（通常は `Postgres`）

### ステップ4: バックエンドサービスのデプロイ

#### 4.1 サービスの作成

1. プロジェクト内で「**+ New**」ボタンをクリック
2. 「**GitHub Repo**」を選択
3. 同じリポジトリを選択
4. サービス名を `backend` に変更（オプション）

#### 4.2 設定の変更

1. バックエンドサービスをクリック
2. 「**Settings**」タブを開く
3. 以下の設定を変更：
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile.prod`
   - **Watch Paths**: （デフォルトのまま）

#### 4.3 環境変数の設定

1. 「**Variables**」タブを開く
2. 「**+ New Variable**」をクリックして、以下の環境変数を**1つずつ**追加：

```env
# 環境設定
NODE_ENV=production
# 注意: PORT環境変数は設定しないでください（Railwayが自動設定します）

# データベース接続（PostgreSQLサービスの変数参照）
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# JWT認証用シークレット（必ず変更！）
JWT_SECRET=<ここに強力なランダム文字列を設定>

# CORS設定（後でフロントエンドのURLに更新）
FRONTEND_URL=https://<フロントエンドのURL>
CORS_ORIGIN=https://<フロントエンドのURL>
```

**重要**: 
- `PORT`環境変数は**設定しないでください**。Railwayが自動的に設定します。
- `${{Postgres.*}}` の `Postgres` は、実際のPostgreSQLサービス名に合わせて変更してください。

**JWT_SECRETの生成方法（PowerShell）:**
```powershell
# PowerShellで実行
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

または、Git BashやWSLで：
```bash
openssl rand -base64 32
```

**重要**: 
- `${{Postgres.*}}` は、Railwayのサービス参照構文です。`Postgres` の部分は、実際のPostgreSQLサービス名に合わせて変更してください。
- `FRONTEND_URL` と `CORS_ORIGIN` は、後でフロントエンドのURLに更新します（一時的に `https://localhost:3000` でも可）

#### 4.4 デプロイの開始

1. 「**Deployments**」タブを確認
2. 自動的にデプロイが開始されます
3. デプロイが完了するまで待つ（5-10分）
4. デプロイ完了後、「**Settings**」→「**Networking**」で生成されたURLをコピー
   - 例: `https://crowdfunding-backend-production.up.railway.app`

### ステップ5: フロントエンドサービスのデプロイ

#### 5.1 サービスの作成

1. プロジェクト内で「**+ New**」ボタンをクリック
2. 「**GitHub Repo**」を選択
3. 同じリポジトリを選択
4. サービス名を `frontend` に変更（オプション）

#### 5.2 設定の変更

1. フロントエンドサービスをクリック
2. 「**Settings**」タブを開く
3. 以下の設定を変更：
   - **Root Directory**: `frontend`
   - **Dockerfile Path**: `Dockerfile.prod`
   - **Watch Paths**: （デフォルトのまま）

#### 5.3 環境変数の設定

1. 「**Variables**」タブを開く
2. 「**+ New Variable**」をクリックして、以下を追加：

```env
VITE_API_URL=https://<バックエンドのURL>/api
```

**重要**: `<バックエンドのURL>` は、ステップ4.4でコピーしたバックエンドのURLに置き換えてください。
- 例: `https://crowdfunding-backend-production.up.railway.app`

#### 5.4 デプロイの開始

1. 「**Deployments**」タブを確認
2. 自動的にデプロイが開始されます
3. デプロイが完了するまで待つ（5-10分）
4. デプロイ完了後、「**Settings**」→「**Networking**」で生成されたURLをコピー
   - 例: `https://crowdfunding-frontend-production.up.railway.app`

#### 5.5 バックエンドのCORS設定を更新

1. バックエンドサービスの「**Variables**」タブに戻る
2. `FRONTEND_URL` と `CORS_ORIGIN` を、フロントエンドのURLに更新：
   ```env
   FRONTEND_URL=https://crowdfunding-frontend-production.up.railway.app
   CORS_ORIGIN=https://crowdfunding-frontend-production.up.railway.app
   ```
3. 保存すると自動的に再デプロイが開始されます

### ステップ6: データベースの初期化

#### 方法1: バックエンドAPIから初期化（最も簡単）

1. バックエンドがデプロイされたら、以下のURLにアクセス：
   ```
   https://<バックエンドのURL>/api/sample-data/generate
   ```
2. ブラウザでアクセスするか、以下のコマンドを実行：
   ```bash
   curl -X POST https://<バックエンドのURL>/api/sample-data/generate
   ```
3. 成功すると、JSONレスポンスが返されます

#### 方法2: Railway CLIを使用

1. Railway CLIをインストール：
   ```bash
   npm i -g @railway/cli
   ```
2. ログイン：
   ```bash
   railway login
   ```
3. プロジェクトに接続：
   ```bash
   railway link
   ```
4. データベースに接続：
   ```bash
   railway connect postgres
   ```
5. SQLファイルを実行：
   ```sql
   \i database/init/01_init.sql
   \i database/init/02_sample_data.sql
   ```

#### 方法3: pgAdminまたはpsqlを使用

1. RailwayダッシュボードでPostgreSQLサービスの「**Connect**」をクリック
2. 接続情報をコピー
3. ローカルのpgAdminまたはpsqlで接続
4. SQLファイルを実行

### ステップ7: カスタムドメインの設定（オプション）

1. 各サービス（バックエンド・フロントエンド）の「**Settings**」→「**Domains**」を開く
2. 「**+ New Domain**」をクリック
3. カスタムドメインを入力（例: `api.yourdomain.com`、`app.yourdomain.com`）
4. Railwayが提供するDNS設定を確認
5. DNSプロバイダーでCNAMEレコードを設定
6. DNS設定が反映されるまで待つ（数分〜数時間）

### ステップ8: 動作確認

1. **バックエンドの確認**:
   - `https://<バックエンドのURL>/api/health` にアクセス
   - JSONレスポンスが返れば正常

2. **フロントエンドの確認**:
   - `https://<フロントエンドのURL>` にアクセス
   - アプリケーションが表示されれば正常

3. **機能テスト**:
   - ユーザー登録
   - ログイン
   - プロジェクト一覧の表示
   - プロジェクトの作成

## 🔧 トラブルシューティング

### バックエンドが起動しない

1. **ログを確認**:
   - バックエンドサービスの「**Deployments**」→「**View Logs**」を確認
   - エラーメッセージを確認

2. **環境変数を確認**:
   - `${{Postgres.*}}` が正しく設定されているか確認
   - PostgreSQLサービス名が正しいか確認

3. **データベース接続エラー**:
   - PostgreSQLサービスが起動しているか確認
   - 環境変数の値が正しいか確認

### フロントエンドがAPIに接続できない

1. **環境変数を確認**:
   - `VITE_API_URL` が正しく設定されているか確認
   - バックエンドのURLが正しいか確認（`/api` が含まれているか）

2. **CORSエラー**:
   - バックエンドの `FRONTEND_URL` と `CORS_ORIGIN` が正しく設定されているか確認
   - フロントエンドのURLと一致しているか確認

3. **ビルドエラー**:
   - フロントエンドのビルドログを確認
   - `VITE_API_URL` がビルド時に正しく埋め込まれているか確認

### データベース初期化エラー

1. **接続エラー**:
   - PostgreSQLサービスが起動しているか確認
   - 環境変数が正しく設定されているか確認

2. **SQLエラー**:
   - SQLファイルの構文を確認
   - ログでエラーメッセージを確認

## 📝 環境変数の完全なリスト

### バックエンド

| 変数名 | 説明 | 必須 | 例 |
|--------|------|------|-----|
| `NODE_ENV` | 環境 | はい | `production` |
| `PORT` | ポート番号 | いいえ | `8000` |
| `DB_HOST` | DBホスト | はい | `${{Postgres.PGHOST}}` |
| `DB_PORT` | DBポート | はい | `${{Postgres.PGPORT}}` |
| `DB_NAME` | DB名 | はい | `${{Postgres.PGDATABASE}}` |
| `DB_USER` | DBユーザー | はい | `${{Postgres.PGUSER}}` |
| `DB_PASSWORD` | DBパスワード | はい | `${{Postgres.PGPASSWORD}}` |
| `JWT_SECRET` | JWT秘密鍵 | はい | （32文字以上のランダム文字列） |
| `FRONTEND_URL` | フロントエンドURL | 推奨 | `https://...` |
| `CORS_ORIGIN` | CORS許可オリジン | 推奨 | `https://...` |

### フロントエンド

| 変数名 | 説明 | 必須 | 例 |
|--------|------|------|-----|
| `VITE_API_URL` | バックエンドAPI URL | はい | `https://.../api` |

## ✅ デプロイ完了チェックリスト

- [ ] PostgreSQLデータベースが作成された
- [ ] バックエンドサービスがデプロイされた
- [ ] バックエンドの環境変数が設定された
- [ ] バックエンドが正常に起動している（`/api/health` が応答）
- [ ] フロントエンドサービスがデプロイされた
- [ ] フロントエンドの環境変数が設定された
- [ ] フロントエンドが正常にビルドされた
- [ ] バックエンドのCORS設定が更新された
- [ ] データベースが初期化された
- [ ] フロントエンドからバックエンドに接続できる
- [ ] ユーザー登録・ログインが動作する
- [ ] プロジェクト一覧が表示される

## 🎉 完了！

デプロイが完了したら、フロントエンドのURLにアクセスして、アプリケーションが動作していることを確認してください。

問題が発生した場合は、`TROUBLESHOOTING.md` を参照するか、Railwayのログを確認してください。
