# Railway 502エラー 緊急修正ガイド

## 🚨 現在の状況

ブラウザのコンソールで502エラーが継続しています。これは、バックエンドサーバーが起動していないか、正しく応答していないことを示しています。

## ⚡ 今すぐ実行すべき3つのステップ

### ステップ1: PORT環境変数を削除（最重要・2分）

**これが502エラーの最も一般的な原因です。**

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. プロジェクトを選択
3. **バックエンドサービス**をクリック
4. 「**Variables**」タブを開く
5. **`PORT`という名前の環境変数を探す**
   - 存在する場合：
     - `PORT`の行の右側の「**...**」をクリック
     - 「**Delete**」をクリック
     - 確認ダイアログで「**Delete**」をクリック
   - **重要**: `PORT`環境変数は**必ず削除してください**

### ステップ2: 公開設定を確認（1分）

1. 「**Settings**」タブを開く
2. 「**Networking**」をクリック
3. **「Public」トグルがONになっているか確認**
   - OFFの場合は、**ONに切り替える**（完全公開モード）

### ステップ3: 再デプロイ（1分）

1. 「**Settings**」タブを開く
2. 「**Deployments**」をクリック
3. 「**Redeploy**」ボタンをクリック
4. デプロイが完了するまで待つ（5-10分）

## 🔍 デプロイログの確認方法

デプロイが完了したら、以下を確認してください：

1. 「**Deployments**」タブで最新のデプロイメントをクリック
2. 「**View Logs**」ボタンをクリック
3. 以下のメッセージが表示されれば成功：

```
✓ Server is running on port <PORT>
✓ Listening on 0.0.0.0:<PORT>
✓ Database connection successful.
```

**エラーメッセージが表示される場合：**

### エラー1: ポート使用エラー
```
Error: Port 8000 is already in use
```
**解決方法**: ステップ1で`PORT`環境変数を削除したことを確認し、再度再デプロイ

### エラー2: データベース接続エラー
```
✗ Error: Could not connect to database
```
**解決方法**: 
1. PostgreSQLサービスが起動しているか確認
2. 環境変数の`${{Postgres.*}}`の`Postgres`が実際のサービス名と一致しているか確認
3. 環境変数を修正して再デプロイ

## ✅ 動作確認

修正後、以下で動作確認してください：

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

### 2. ブラウザのコンソール

1. F12キーで開発者ツールを開く
2. 「Console」タブを確認
3. 502エラーが解消されているか確認

### 3. Railway HTTPログ

1. Railwayダッシュボードでバックエンドサービスを開く
2. 「**HTTP Logs**」タブをクリック
3. 最新のリクエストを確認
4. ステータスコードが**200**になっているか確認

## 🛠️ まだ502エラーが発生する場合

### 追加確認事項

#### 1. 環境変数の完全確認

「Variables」タブで以下が設定されているか確認：

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
- `PORT`環境変数は**設定しない**
- `Postgres`は実際のPostgreSQLサービス名に合わせて変更

#### 2. PostgreSQLサービスの確認

1. プロジェクト内のサービス一覧でPostgreSQLサービスを確認
2. サービスが起動しているか確認
3. 起動していない場合は、サービスをクリックして起動

#### 3. サービス名の確認

1. PostgreSQLサービスの名前を確認（通常は`Postgres`）
2. バックエンドの環境変数で`${{Postgres.*}}`の`Postgres`が実際のサービス名と一致しているか確認
3. 一致していない場合は、環境変数を修正

#### 4. デプロイログの詳細確認

1. 「Deployments」→「View Logs」でエラーメッセージを確認
2. エラーメッセージに従って修正
3. 特に以下のエラーに注意：
   - TypeScriptコンパイルエラー
   - 依存関係のインストールエラー
   - データベース接続エラー

## 🔄 完全リセット手順（最後の手段）

すべてがうまくいかない場合：

### 1. バックエンドサービスを削除

1. バックエンドサービス → 「Settings」
2. 一番下の「**Delete Service**」をクリック
3. 確認ダイアログで「**Delete**」をクリック

### 2. バックエンドサービスを再作成

1. プロジェクトページで「**+ New**」をクリック
2. 「**GitHub Repo**」を選択
3. リポジトリを選択
4. 「**Settings**」タブで以下を設定：
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile.prod`

### 3. 環境変数を設定

「Variables」タブで以下を設定（`PORT`は設定しない）：

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

### 4. 公開設定を確認

1. 「Settings」→「Networking」
2. 「Generate Domain」をクリック
3. **「Public」トグルをONにする**

### 5. デプロイを待つ

デプロイが完了するまで待ち、ログを確認してください。

## 📋 チェックリスト

502エラーを解決するために、以下を確認してください：

- [ ] `PORT`環境変数が設定されていない（削除済み）
- [ ] すべての必須環境変数が設定されている
- [ ] PostgreSQLサービスが起動している
- [ ] データベース環境変数のサービス参照が正しい（`${{Postgres.*}}`）
- [ ] 公開ドメインが生成されている
- [ ] **「Public」トグルがONになっている**（完全公開モード）
- [ ] デプロイが完了している
- [ ] ログに「Server is running」が表示されている
- [ ] `/api/health`エンドポイントが応答している
- [ ] HTTPログでステータスコードが200になっている
- [ ] ブラウザのコンソールで502エラーが解消されている

## 🎯 最も可能性の高い原因

502エラーの**90%以上**は以下のいずれかが原因です：

1. **`PORT`環境変数が手動設定されている**（最も一般的）
2. **「Public」トグルがOFFになっている**
3. **データベース接続エラーでサーバーが起動に失敗している**

まずは上記の3つを確認してください。

## 📞 参考資料

- **ステップバイステップ**: `RAILWAY_FIX_502_STEPS.md`
- **今すぐ修正**: `RAILWAY_502_FIX_NOW.md`
- **詳細診断**: `RAILWAY_502_DIAGNOSIS.md`
- **クイック修正**: `RAILWAY_QUICK_FIX_502.md`
- **完全公開デプロイ**: `RAILWAY_PUBLIC_DEPLOY.md`
- **環境変数設定**: `railway-env-setup.md`
