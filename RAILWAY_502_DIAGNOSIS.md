# Railway 502エラー 診断と解決ガイド

## 🔴 現在の状況

RailwayのHTTPログで502エラーが発生しています：
- `GET /` → 502エラー（191ms）
- `GET /favicon.ico` → 502エラー（9ms）

これは、バックエンドサーバーが起動していないか、正しく応答していないことを示しています。

## 🔍 診断手順

### ステップ1: Railwayデプロイログの確認

1. Railwayダッシュボードでバックエンドサービスを開く
2. 「**Deployments**」タブを開く
3. 最新のデプロイメントをクリック
4. 「**View Logs**」をクリック

**確認すべきログメッセージ：**

#### ✅ 正常な場合
```
✓ Server is running on port <PORT>
✓ Listening on 0.0.0.0:<PORT>
✓ Database connection successful.
```

#### ❌ エラーの場合
以下のエラーメッセージを確認：

**エラー1: ポート使用エラー**
```
Error: Port 8000 is already in use
```
**原因**: `PORT`環境変数が手動設定されている

**エラー2: データベース接続エラー**
```
✗ Error: Could not connect to database
```
**原因**: データベース接続情報が正しくない

**エラー3: ビルドエラー**
```
error TS2307: Cannot find module
```
**原因**: TypeScriptコンパイルエラー

**エラー4: サーバーが起動しない**
ログに「Server is running」が表示されない
**原因**: サーバー起動コードに問題がある

### ステップ2: 環境変数の確認

Railwayダッシュボードで：
1. バックエンドサービス → 「**Variables**」タブ
2. 以下を確認：

#### ✅ 設定すべき環境変数
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

#### ❌ 削除すべき環境変数
- **`PORT`** - Railwayが自動設定するため、手動設定は削除

### ステップ3: 公開設定の確認

1. 「**Settings**」→「**Networking**」を開く
2. 以下を確認：
   - 公開ドメインが生成されているか
   - **「Public」トグルがONになっているか**（完全公開モード）

### ステップ4: データベース接続の確認

1. PostgreSQLサービスが起動しているか確認
2. バックエンドの環境変数で：
   - `DB_HOST=${{Postgres.PGHOST}}` の`Postgres`が実際のサービス名と一致しているか確認
3. ログにデータベース接続エラーがないか確認

## 🛠️ 解決方法

### 解決方法1: PORT環境変数を削除

1. Railwayダッシュボードでバックエンドサービスを開く
2. 「**Variables**」タブを開く
3. `PORT`環境変数が設定されている場合は**削除**
4. 「**Settings**」→「**Deployments**」→「**Redeploy**」をクリック
5. デプロイが完了するまで待つ（5-10分）
6. ログを確認

### 解決方法2: 環境変数を再設定

1. 「**Variables**」タブで以下を確認・設定：

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

2. **重要**: `PORT`環境変数は設定しない
3. 保存すると自動的に再デプロイが開始されます
4. デプロイが完了するまで待つ
5. ログを確認

### 解決方法3: データベース接続を修正

1. PostgreSQLサービス名を確認（通常は`Postgres`）
2. バックエンドの環境変数で：
   - `DB_HOST=${{Postgres.PGHOST}}` の`Postgres`を実際のサービス名に変更
   - すべてのデータベース関連環境変数を確認
3. 再デプロイ

### 解決方法4: 公開設定を確認

1. 「**Settings**」→「**Networking**」を開く
2. 「**Generate Domain**」がクリックされているか確認
3. **「Public」トグルがONになっているか確認**（完全公開モード）
4. 再デプロイ

### 解決方法5: 完全リセット

すべてがうまくいかない場合：

1. **バックエンドサービスを削除**
   - バックエンドサービス → 「Settings」→「Delete Service」

2. **バックエンドサービスを再作成**
   - 「New」→「GitHub Repo」
   - Root Directory: `backend`
   - Dockerfile Path: `Dockerfile.prod`

3. **環境変数を設定**
   - `railway-env-setup.md`を参照

4. **公開設定を確認**
   - 「Settings」→「Networking」
   - 「Generate Domain」をクリック
   - **「Public」トグルをONにする**

5. **デプロイを待つ**

## 📋 チェックリスト

502エラーを解決するために、以下を順番に確認してください：

- [ ] Railwayデプロイログを確認（「Deployments」→「View Logs」）
- [ ] `PORT`環境変数が設定されていない（削除する）
- [ ] すべての必須環境変数が設定されている
- [ ] PostgreSQLサービスが起動している
- [ ] データベース環境変数のサービス参照が正しい（`${{Postgres.*}}`）
- [ ] 公開ドメインが生成されている
- [ ] **「Public」トグルがONになっている**（完全公開モード）
- [ ] デプロイが完了している
- [ ] ログに「Server is running」が表示されている
- [ ] `/api/health`エンドポイントが応答している

## 🚀 動作確認

修正後、以下で動作確認してください：

1. **バックエンドヘルスチェック**
   ```
   https://<バックエンドのURL>/api/health
   ```
   正常な場合、以下のJSONが返されます：
   ```json
   {
     "status": "healthy",
     "timestamp": "2026-02-08T..."
   }
   ```

2. **ルートエンドポイント**
   ```
   https://<バックエンドのURL>/
   ```
   正常な場合、以下のJSONが返されます：
   ```json
   {
     "message": "Crowdfunding API",
     "version": "1.0.0",
     "status": "running"
   }
   ```

3. **Railway HTTPログ**
   - 「**HTTP Logs**」タブで、502エラーが解消されているか確認
   - ステータスコードが200になっているか確認

## 📞 追加のサポート

問題が解決しない場合：

1. **Railwayのデプロイログを確認**
   - 「Deployments」→「View Logs」
   - エラーメッセージをコピー

2. **環境変数を再確認**
   - 「Variables」タブですべての環境変数を確認
   - `PORT`環境変数が設定されていないか確認

3. **参考資料を確認**
   - `RAILWAY_QUICK_FIX_502.md` - クイック修正ガイド
   - `RAILWAY_PUBLIC_DEPLOY.md` - 完全公開デプロイガイド
   - `RAILWAY_502_FIX.md` - 502エラー解決ガイド

4. **Railwayの「Help Station」を確認**
   - Railwayダッシュボードの「Help Station」を参照

## 🔍 よくある原因と解決方法

### 原因1: PORT環境変数の競合

**症状**: ログに「Port is already in use」が表示される

**解決方法**: 
1. `PORT`環境変数を削除
2. 再デプロイ

### 原因2: データベース接続エラー

**症状**: ログに「Could not connect to database」が表示される

**解決方法**: 
1. PostgreSQLサービスが起動しているか確認
2. 環境変数のサービス参照を確認（`${{Postgres.*}}`）
3. 再デプロイ

### 原因3: サーバーが起動しない

**症状**: ログに「Server is running」が表示されない

**解決方法**: 
1. 環境変数を再確認
2. デプロイログでエラーメッセージを確認
3. エラーに従って修正
4. 再デプロイ

### 原因4: 公開設定がOFF

**症状**: 502エラーが発生する

**解決方法**: 
1. 「Settings」→「Networking」を開く
2. **「Public」トグルをONにする**
3. 再デプロイ
