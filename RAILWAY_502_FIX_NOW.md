# Railway 502エラー 今すぐ修正手順

## 🚨 緊急対応（今すぐ実行）

RailwayのHTTPログで502エラーが発生しています。以下の手順で**今すぐ**修正してください。

## ⚡ 5分で解決する手順

### ステップ1: Railwayダッシュボードを開く（1分）

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. プロジェクトを選択
3. **バックエンドサービス**をクリック

### ステップ2: 環境変数を確認・修正（2分）

1. 「**Variables**」タブを開く
2. **`PORT`環境変数が設定されている場合は削除**（最重要！）
   - `PORT`環境変数の横の「...」をクリック
   - 「Delete」をクリック
3. 以下の環境変数が設定されているか確認：

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

**重要**: 
- `PORT`環境変数は**設定しないでください**（Railwayが自動設定）
- `Postgres`は実際のPostgreSQLサービス名に合わせて変更

### ステップ3: 公開設定を確認（1分）

1. 「**Settings**」タブを開く
2. 「**Networking**」をクリック
3. 以下を確認：
   - 公開ドメインが生成されているか
   - **「Public」トグルがONになっているか**（完全公開モード）
4. 「Public」トグルがOFFの場合は、**ONにする**

### ステップ4: 再デプロイ（1分）

1. 「**Settings**」タブを開く
2. 「**Deployments**」をクリック
3. 「**Redeploy**」ボタンをクリック
4. デプロイが完了するまで待つ（5-10分）

### ステップ5: ログを確認（1分）

1. 「**Deployments**」タブを開く
2. 最新のデプロイメントをクリック
3. 「**View Logs**」をクリック
4. 以下のメッセージが表示されれば成功：

```
✓ Server is running on port <PORT>
✓ Listening on 0.0.0.0:<PORT>
✓ Database connection successful.
```

## ✅ 動作確認

### 1. バックエンドヘルスチェック

ブラウザで以下にアクセス：
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

### 2. Railway HTTPログの確認

1. Railwayダッシュボードでバックエンドサービスを開く
2. 「**HTTP Logs**」タブを開く
3. 最新のリクエストを確認
4. ステータスコードが**200**になっているか確認

## 🔍 まだ502エラーが発生する場合

### 確認事項1: デプロイログにエラーがないか

1. 「**Deployments**」→「**View Logs**」を開く
2. エラーメッセージを確認

**よくあるエラー：**

#### エラー1: ポート使用エラー
```
Error: Port 8000 is already in use
```
**解決方法**: `PORT`環境変数を削除（ステップ2を再確認）

#### エラー2: データベース接続エラー
```
✗ Error: Could not connect to database
```
**解決方法**: 
1. PostgreSQLサービスが起動しているか確認
2. 環境変数の`${{Postgres.*}}`参照が正しいか確認
3. PostgreSQLサービス名が正しいか確認

#### エラー3: ビルドエラー
```
error TS2307: Cannot find module
```
**解決方法**: 
1. ビルドログを確認
2. エラーメッセージに従って修正
3. 再デプロイ

### 確認事項2: データベース接続

1. PostgreSQLサービスが起動しているか確認
2. バックエンドの環境変数で：
   - `DB_HOST=${{Postgres.PGHOST}}` の`Postgres`が実際のサービス名と一致しているか確認

### 確認事項3: 公開設定

1. 「**Settings**」→「**Networking**」を開く
2. **「Public」トグルがONになっているか確認**

## 🆘 それでも解決しない場合

### 完全リセット手順

1. **バックエンドサービスを削除**
   - バックエンドサービス → 「Settings」→「Delete Service」

2. **バックエンドサービスを再作成**
   - 「New」→「GitHub Repo」
   - Root Directory: `backend`
   - Dockerfile Path: `Dockerfile.prod`

3. **環境変数を設定**
   - `railway-env-setup.md`を参照
   - **`PORT`環境変数は設定しない**

4. **公開設定を確認**
   - 「Settings」→「Networking」
   - 「Generate Domain」をクリック
   - **「Public」トグルをONにする**

5. **デプロイを待つ**

## 📋 チェックリスト

502エラーを解決するために、以下を確認してください：

- [ ] `PORT`環境変数が設定されていない（削除済み）
- [ ] すべての必須環境変数が設定されている
- [ ] PostgreSQLサービスが起動している
- [ ] データベース環境変数のサービス参照が正しい
- [ ] 公開ドメインが生成されている
- [ ] **「Public」トグルがONになっている**（完全公開モード）
- [ ] デプロイが完了している
- [ ] ログに「Server is running」が表示されている
- [ ] `/api/health`エンドポイントが応答している
- [ ] HTTPログでステータスコードが200になっている

## 📞 参考資料

- **詳細診断**: `RAILWAY_502_DIAGNOSIS.md`
- **クイック修正**: `RAILWAY_QUICK_FIX_502.md`
- **完全公開デプロイ**: `RAILWAY_PUBLIC_DEPLOY.md`
- **環境変数設定**: `railway-env-setup.md`
