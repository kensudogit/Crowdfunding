# トラブルシューティングガイド

## バックエンドサーバーが応答しない場合（ERR_EMPTY_RESPONSE）

### ステップ1: Docker Desktopの確認

1. **Docker Desktopが起動しているか確認**
   - タスクバーのDockerアイコンを確認
   - 起動していない場合は、Docker Desktopを起動

2. **Docker Desktopの状態確認**
   ```powershell
   docker version
   ```
   エラーが表示される場合は、Docker Desktopを再起動してください。

### ステップ2: コンテナの状態確認

```powershell
cd c:\devlop202601\Crowdfunding
docker ps
```

バックエンドコンテナ（`crowdfunding_backend`）が表示されない場合：
- コンテナが起動していません
- 以下のコマンドで起動してください：
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

### ステップ4: バックエンドサーバーの再起動

```powershell
# バックエンドコンテナを再起動
docker-compose restart backend

# または、全体を再起動
docker-compose down
docker-compose up -d
```

### ステップ5: バックエンドサーバーの動作確認

ブラウザで以下のURLにアクセス：
- `http://localhost:8000/` - APIの基本情報が表示される
- `http://localhost:8000/api/health` - ヘルスチェック

正常に動作している場合、JSONレスポンスが返されます。

### ステップ6: データベースの確認

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

### ステップ7: ネットワークの確認

```powershell
# Dockerネットワークの確認
docker network ls

# コンテナが同じネットワークに接続されているか確認
docker network inspect crowdfunding_crowdfunding_network
```

## よくある問題と解決方法

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
1. PostgreSQLコンテナが起動しているか確認
2. データベースコンテナを再起動：
   ```powershell
   docker-compose restart postgres
   ```
3. 環境変数が正しく設定されているか確認

### 問題3: TypeScriptコンパイルエラー

**エラーメッセージ：**
```
error TS2307: Cannot find module
```

**解決方法：**
1. 依存関係を再インストール：
   ```powershell
   cd backend
   npm install
   ```
2. コンテナを再ビルド：
   ```powershell
   docker-compose build backend
   docker-compose up -d backend
   ```

### 問題4: CORSエラー

**エラーメッセージ：**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**解決方法：**
- バックエンドのCORS設定は既に開発環境で全オリジンを許可しています
- バックエンドコンテナを再起動してください

## 完全リセット手順

すべてがうまくいかない場合：

```powershell
# 1. すべてのコンテナを停止・削除
docker-compose down

# 2. ボリュームも削除（データベースのデータも削除されます）
docker-compose down -v

# 3. コンテナを再ビルド
docker-compose build --no-cache

# 4. コンテナを起動
docker-compose up -d

# 5. ログを確認
docker-compose logs -f
```

## サポート

問題が解決しない場合：
1. `check-backend.bat`を実行して詳細な診断情報を取得
2. `docker-compose logs`の出力を確認
3. ブラウザの開発者ツール（F12）のネットワークタブでリクエストを確認
