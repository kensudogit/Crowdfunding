# Railway 完全公開モードデプロイガイド

このガイドでは、CrowdfundingプラットフォームをRailwayに**完全公開モード**でデプロイする手順を説明します。

## 🔴 現在の502エラーの原因

502 Bad Gatewayエラーが発生している場合、以下の原因が考えられます：

1. **バックエンドサーバーが起動していない**
2. **環境変数が正しく設定されていない**
3. **データベース接続エラー**
4. **ポート設定の問題**

## ✅ 完全公開モードデプロイ手順

### ステップ1: Railwayプロジェクトの準備

1. [Railway Dashboard](https://railway.app/dashboard)にログイン
2. 既存のプロジェクトを選択、または新規プロジェクトを作成

### ステップ2: PostgreSQLデータベースの設定

1. 「New」→「Database」→「Add PostgreSQL」を選択
2. データベースサービス名を確認（通常は`Postgres`）
3. データベースが起動するのを待つ

### ステップ3: バックエンドサービスのデプロイ

#### 3.1 サービス作成

1. 「New」→「GitHub Repo」を選択
2. リポジトリを選択
3. サービス名: `backend`（または任意の名前）

#### 3.2 設定の確認

「Settings」タブで以下を確認・設定：

- **Root Directory**: `backend`
- **Dockerfile Path**: `Dockerfile.prod`
- **Start Command**: `npm start`（自動設定される）

#### 3.3 環境変数の設定（重要）

「Variables」タブで以下を設定：

```env
NODE_ENV=production
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=<強力なランダム文字列>
FRONTEND_URL=https://<フロントエンドのURL>
CORS_ORIGIN=https://<フロントエンドのURL>
```

**重要事項：**
- `PORT`環境変数は**設定しないでください**（Railwayが自動設定）
- `Postgres`は実際のPostgreSQLサービス名に合わせて変更
- `JWT_SECRET`は強力なランダム文字列に設定（32文字以上推奨）

**JWT_SECRETの生成（PowerShell）:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 3.4 公開設定（完全公開モード）

1. 「Settings」→「Networking」を開く
2. 「**Generate Domain**」をクリックして公開ドメインを生成
3. 生成されたURLをコピー（例: `https://crowdfunding-backend-production.up.railway.app`）
4. 「**Public**」トグルを**ON**にする（完全公開モード）

#### 3.5 デプロイの確認

1. 「Deployments」タブでデプロイの進行を確認
2. デプロイが完了したら、「View Logs」でログを確認
3. 以下のメッセージが表示されれば成功：
   ```
   ✓ Server is running on port <PORT>
   ✓ Listening on 0.0.0.0:<PORT>
   ```

#### 3.6 動作確認

ブラウザで以下にアクセス：
- `https://<バックエンドのURL>/api/health`

正常な場合、以下のJSONが返されます：
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T..."
}
```

### ステップ4: フロントエンドサービスのデプロイ

#### 4.1 サービス作成

1. 「New」→「GitHub Repo」を選択（同じリポジトリ）
2. サービス名: `frontend`（または任意の名前）

#### 4.2 設定の確認

「Settings」タブで以下を確認・設定：

- **Root Directory**: `frontend`
- **Dockerfile Path**: `Dockerfile.prod`
- **Start Command**: `nginx -g 'daemon off;'`（自動設定される）

#### 4.3 環境変数の設定

「Variables」タブで以下を設定：

```env
VITE_API_URL=https://<バックエンドのURL>/api
```

**重要事項：**
- `<バックエンドのURL>`は、ステップ3.4で生成したバックエンドのURLを使用
- `/api`を必ず含めてください
- 例: `https://crowdfunding-backend-production.up.railway.app/api`

#### 4.4 公開設定（完全公開モード）

1. 「Settings」→「Networking」を開く
2. 「**Generate Domain**」をクリックして公開ドメインを生成
3. 生成されたURLをコピー（例: `https://crowdfunding-frontend-production.up.railway.app`）
4. 「**Public**」トグルを**ON**にする（完全公開モード）

#### 4.5 デプロイの確認

1. 「Deployments」タブでデプロイの進行を確認
2. デプロイが完了したら、「View Logs」でログを確認
3. エラーがなければ成功

#### 4.6 バックエンドの環境変数を更新

フロントエンドのURLが確定したら、バックエンドの環境変数を更新：

1. バックエンドサービスの「Variables」タブを開く
2. `FRONTEND_URL`を更新: `https://<フロントエンドのURL>`
3. `CORS_ORIGIN`を更新: `https://<フロントエンドのURL>`
4. 保存すると自動的に再デプロイが開始されます

### ステップ5: データベースの初期化

#### 方法1: APIエンドポイントを使用（推奨）

1. バックエンドがデプロイされたら、以下のURLにアクセス：
   ```
   POST https://<バックエンドのURL>/api/sample-data/generate
   ```
2. ブラウザの開発者ツール（F12）→「Network」タブで確認
3. または、curlコマンドで：
   ```bash
   curl -X POST https://<バックエンドのURL>/api/sample-data/generate
   ```

#### 方法2: Railway CLIを使用

```bash
# Railway CLIをインストール
npm i -g @railway/cli

# ログイン
railway login

# プロジェクトに接続
railway link

# データベースに接続
railway connect postgres

# SQLファイルを実行
\i database/init/01_init.sql
\i database/init/02_sample_data.sql
```

### ステップ6: 動作確認

1. **フロントエンド**: `https://<フロントエンドのURL>` にアクセス
2. **ログイン・登録機能**をテスト
3. **プロジェクト作成・表示機能**をテスト
4. **支援機能**をテスト

## 🔧 502エラーの解決方法

### 問題1: バックエンドが起動しない

**確認事項：**
1. 「Deployments」→「View Logs」でエラーログを確認
2. 環境変数が正しく設定されているか確認
3. `PORT`環境変数が設定されていないか確認（削除する）

**解決方法：**
1. 環境変数を再確認
2. 「Settings」→「Deployments」→「Redeploy」をクリック
3. ログを確認してエラーを修正

### 問題2: データベース接続エラー

**確認事項：**
1. PostgreSQLサービスが起動しているか確認
2. 環境変数の`${{Postgres.*}}`参照が正しいか確認
3. PostgreSQLサービス名が正しいか確認

**解決方法：**
1. PostgreSQLサービスの「Variables」タブで接続情報を確認
2. バックエンドの環境変数でサービス名を確認（`Postgres`を実際のサービス名に変更）
3. バックエンドを再デプロイ

### 問題3: フロントエンドがAPIに接続できない

**確認事項：**
1. `VITE_API_URL`が正しく設定されているか確認
2. バックエンドのURLが正しいか確認
3. バックエンドのCORS設定を確認

**解決方法：**
1. フロントエンドの環境変数`VITE_API_URL`を確認
2. バックエンドの`FRONTEND_URL`と`CORS_ORIGIN`を確認
3. フロントエンドを再デプロイ

### 問題4: ビルドエラー

**確認事項：**
1. Dockerfileが正しく配置されているか確認
2. 必要なファイルが`.railwayignore`で除外されていないか確認
3. ビルドログを確認

**解決方法：**
1. 「Deployments」→「View Logs」でビルドログを確認
2. エラーメッセージに従って修正
3. 再デプロイ

## 📋 完全公開モード設定チェックリスト

### バックエンド
- [ ] サービスが作成されている
- [ ] Root Directory: `backend`
- [ ] Dockerfile Path: `Dockerfile.prod`
- [ ] 環境変数が正しく設定されている
- [ ] **公開ドメインが生成されている**
- [ ] **PublicトグルがONになっている**
- [ ] デプロイが成功している
- [ ] `/api/health`エンドポイントが応答している

### フロントエンド
- [ ] サービスが作成されている
- [ ] Root Directory: `frontend`
- [ ] Dockerfile Path: `Dockerfile.prod`
- [ ] `VITE_API_URL`が正しく設定されている
- [ ] **公開ドメインが生成されている**
- [ ] **PublicトグルがONになっている**
- [ ] デプロイが成功している
- [ ] フロントエンドが表示される

### データベース
- [ ] PostgreSQLサービスが作成されている
- [ ] データベースが起動している
- [ ] 初期データが投入されている

## 🔒 セキュリティ設定

### 本番環境の推奨設定

1. **JWT_SECRET**
   - 32文字以上の強力なランダム文字列を使用
   - 定期的に変更を検討

2. **CORS設定**
   - 本番環境では、許可するオリジンを明示的に指定
   - ワイルドカード（`*`）は使用しない

3. **環境変数**
   - 機密情報は環境変数で管理
   - Railwayの「Variables」タブで管理

4. **HTTPS**
   - Railwayは自動的にHTTPSを提供
   - カスタムドメインもHTTPS対応

## 🎯 カスタムドメインの設定（オプション）

1. 各サービスの「Settings」→「Domains」を開く
2. 「**Custom Domain**」をクリック
3. ドメイン名を入力
4. DNS設定をRailwayの指示に従って設定
5. SSL証明書が自動的に発行されます

## 📞 サポート

問題が解決しない場合：

1. Railwayのデプロイログを確認
2. ブラウザの開発者ツール（F12）でエラーを確認
3. `RAILWAY_502_FIX.md`を参照
4. `TROUBLESHOOTING.md`を参照
5. Railwayの「Help Station」を確認

## 🚀 デプロイ完了後の確認事項

- [ ] バックエンドが正常に動作している
- [ ] フロントエンドが正常に動作している
- [ ] データベース接続が正常
- [ ] ログイン・登録機能が動作
- [ ] プロジェクト作成・表示機能が動作
- [ ] 支援機能が動作
- [ ] すべてのエンドポイントがHTTPSでアクセス可能
