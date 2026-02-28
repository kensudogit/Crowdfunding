# 502 Bad Gateway エラー解決ガイド

## 🔴 問題: 502 Bad Gateway エラー

ブラウザのコンソールに「502 Bad Gateway」エラーが表示される場合、バックエンドサーバーが起動していないか、正しく応答していません。

## 🔍 原因の確認手順

### ステップ1: Docker Desktopの確認

1. **Docker Desktopが起動しているか確認**
   - タスクバーのDockerアイコンを確認
   - 起動していない場合は、Docker Desktopを起動
   - 起動後、数秒待ってから次のステップに進む

2. **Docker Desktopの状態確認**
   ```powershell
   docker version
   ```
   エラーが表示される場合は、Docker Desktopを再起動してください。

### ステップ2: コンテナの状態確認

```powershell
cd C:\devlop\Crowdfunding\Crowdfunding
docker ps
```

**確認すべきコンテナ:**
- `crowdfunding_backend` - バックエンドサーバー
- `crowdfunding_postgres` - データベース
- `crowdfunding_frontend` - フロントエンド

バックエンドコンテナが表示されない場合：
```powershell
docker-compose up -d backend
```

### ステップ3: バックエンドのログ確認

```powershell
docker-compose logs backend
```

または、最新の50行を確認：
```powershell
docker logs --tail 50 crowdfunding_backend
```

**確認すべきログメッセージ：**
- `✓ Server is running on port 8000`
- `✓ Listening on 0.0.0.0:8000`
- `✓ Database connection successful.`

**エラーメッセージが表示される場合：**
- データベース接続エラー: PostgreSQLコンテナが起動しているか確認
- ポート使用エラー: ポート8000が他のアプリケーションで使用されていないか確認
- TypeScriptコンパイルエラー: コードに構文エラーがないか確認

### ステップ4: バックエンドサーバーの動作確認

ブラウザで以下のURLにアクセス：
- `http://localhost:8000/` - APIの基本情報が表示される
- `http://localhost:8000/api/health` - ヘルスチェック

正常に動作している場合、JSONレスポンスが返されます：
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T..."
}
```

### ステップ5: データベースの確認

```powershell
# データベースコンテナの状態確認
docker ps --filter "name=crowdfunding_postgres"

# データベースのログ確認
docker-compose logs postgres
```

データベースが起動していない場合：
```powershell
docker-compose up -d postgres
```

## ✅ 解決方法

### 方法1: すべてのサービスを再起動

```powershell
cd C:\devlop\Crowdfunding\Crowdfunding

# すべてのコンテナを停止
docker-compose down

# すべてのコンテナを起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

### 方法2: バックエンドのみを再起動

```powershell
# バックエンドコンテナを再起動
docker-compose restart backend

# ログを確認
docker-compose logs -f backend
```

### 方法3: コンテナを再ビルド

```powershell
# バックエンドコンテナを再ビルド
docker-compose build backend

# コンテナを起動
docker-compose up -d backend

# ログを確認
docker-compose logs -f backend
```

### 方法4: 完全リセット（データベースのデータも削除）

```powershell
# すべてのコンテナとボリュームを削除
docker-compose down -v

# コンテナを再ビルド
docker-compose build --no-cache

# コンテナを起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

## 🛠️ よくある問題と解決方法

### 問題1: ポート8000が使用中

**エラーメッセージ：**
```
Error: Port 8000 is already in use
```

**解決方法：**
1. ポート8000を使用しているプロセスを確認：
   ```powershell
   netstat -ano | findstr :8000
   ```
2. プロセスIDを確認し、タスクマネージャーで終了
3. または、`docker-compose.yml`でポートを変更

### 問題2: データベース接続エラー

**エラーメッセージ：**
```
✗ Error: Could not connect to database
```

**解決方法：**
1. PostgreSQLコンテナが起動しているか確認：
   ```powershell
   docker ps --filter "name=crowdfunding_postgres"
   ```
2. データベースコンテナを再起動：
   ```powershell
   docker-compose restart postgres
   ```
3. 環境変数が正しく設定されているか確認（`docker-compose.yml`）

### 問題3: TypeScriptコンパイルエラー

**エラーメッセージ：**
```
error TS2307: Cannot find module
```

**解決方法：**
1. バックエンドコンテナ内で依存関係を再インストール：
   ```powershell
   docker-compose exec backend npm install
   ```
2. コンテナを再ビルド：
   ```powershell
   docker-compose build backend
   docker-compose up -d backend
   ```

### 問題4: Docker Desktopが起動しない

**症状：**
- Dockerコマンドが「Access is denied」エラーを返す
- Docker Desktopが起動しない

**解決方法：**
1. Docker Desktopを管理者権限で起動
2. Windowsの再起動
3. Docker Desktopの再インストール

### 問題5: フロントエンドがバックエンドに接続できない

**症状：**
- ブラウザのコンソールに502エラーが表示される
- ネットワークタブでリクエストが失敗している

**解決方法：**
1. バックエンドサーバーが起動しているか確認：
   ```powershell
   docker ps | findstr crowdfunding_backend
   ```
2. バックエンドのヘルスチェック：
   - ブラウザで `http://localhost:8000/api/health` にアクセス
3. フロントエンドのAPI URL設定を確認：
   - `frontend/.env` または `frontend/src/services/api.ts` を確認
   - `VITE_API_URL=http://localhost:8000/api` が設定されているか確認

## 📋 クイックチェックリスト

502エラーが発生した場合、以下の順序で確認してください：

- [ ] Docker Desktopが起動している
- [ ] バックエンドコンテナが起動している（`docker ps`で確認）
- [ ] バックエンドサーバーが応答している（`http://localhost:8000/api/health`にアクセス）
- [ ] データベースコンテナが起動している（`docker ps`で確認）
- [ ] バックエンドのログにエラーがない（`docker-compose logs backend`で確認）
- [ ] ポート8000が他のプロセスで使用されていない（`netstat -ano | findstr :8000`で確認）

## 🔄 自動診断スクリプトの実行

プロジェクトには診断スクリプトが用意されています：

```powershell
cd C:\devlop\Crowdfunding\Crowdfunding
.\check-backend.bat
```

このスクリプトは以下を自動的に確認します：
- バックエンドコンテナの状態
- バックエンドのログ
- バックエンドサーバーへの接続テスト

## 📞 追加のサポート

問題が解決しない場合：

1. **ログを確認：**
   ```powershell
   docker-compose logs backend > backend-logs.txt
   docker-compose logs postgres > postgres-logs.txt
   ```

2. **ブラウザの開発者ツールを確認：**
   - F12キーを押して開発者ツールを開く
   - 「Network」タブでリクエストの詳細を確認
   - 「Console」タブでエラーメッセージを確認

3. **`TROUBLESHOOTING.md`を参照**

4. **`RAILWAY_502_FIX.md`を参照**（Railwayにデプロイしている場合）

---

## 405 Method Not Allowed（登録・ログインができない）

### 症状

- 本番（Railway）で「登録に失敗しました」と表示される
- ブラウザのコンソールに `POST .../api/auth/register 405 (Method Not Allowed)` や `POST .../api/auth/login 405 (Method Not Allowed)` が出る

### 原因

フロントエンド（nginx の静的配信）とバックエンド（Express API）は**別サービス**です。  
フロントのビルド時に **API のベース URL** が未設定だったりフロントの URL のままになっていると、ログイン・登録のリクエストが**フロントと同じオリジン**に送られ、nginx が POST を受け付けず **405** になります。

### 対処（Railway でフロントをデプロイしている場合）

1. **バックエンドを別サービスとしてデプロイする**  
   - バックエンド用のサービス（`backend` フォルダからデプロイ）を用意し、Postgres など必要な環境変数を設定する。
   - デプロイ後に「Settings → Networking → Generate Domain」で URL を発行する（例: `https://crowdfunding-backend-xxxx.up.railway.app`）。

2. **フロントエンドのサービスで `VITE_API_URL` を設定する**  
   - Railway ダッシュボードで **フロントエンド** のサービスを開く。
   - **Variables** で次を追加する（値はバックエンドの URL に置き換える）:
     ```bash
     VITE_API_URL=https://あなたのバックエンドのドメイン
     ```
     - 末尾の `/api` は不要です（コード側で付与します）。
     - 例: `VITE_API_URL=https://crowdfunding-backend-xxxx.up.railway.app`

3. **再デプロイする**  
   - `VITE_API_URL` は**ビルド時**に埋め込まれるため、変数を追加・変更したあとでフロントエンドを**再ビルド・再デプロイ**する必要があります。

4. **バックエンドの CORS**  
   - バックエンドの環境変数で、フロントの本番 URL を許可するようにする（例: `FRONTEND_URL=https://crowdfunding-production-7caf.up.railway.app`）。  
   - `backend` の `app.ts` では `FRONTEND_URL` / `CORS_ORIGIN` を参照しています。

### 確認方法

- ブラウザの開発者ツールの **Network** タブで、登録・ログイン時の POST が **バックエンドのドメイン**（`VITE_API_URL` で指定した URL）に向いているか確認する。
- バックエンドの URL を直接開いて `https://<バックエンドURL>/api/health` が JSON で応答するか確認する。
