# Railway 502エラー クイック修正ガイド

502 Bad Gatewayエラーが発生している場合、以下の手順で迅速に解決できます。

## 🚨 緊急対応（5分で解決）

### ステップ1: バックエンドの環境変数を確認

1. Railwayダッシュボードでバックエンドサービスを開く
2. 「**Variables**」タブを開く
3. 以下を確認：

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
- **`PORT`** - Railwayが自動設定するため、手動設定は削除してください

### ステップ2: 公開設定を確認

1. 「**Settings**」→「**Networking**」を開く
2. 「**Generate Domain**」がクリックされているか確認
3. **「Public」トグルがONになっているか確認**（完全公開モード）
4. 生成されたURLをコピー

### ステップ3: ログを確認

1. 「**Deployments**」タブを開く
2. 最新のデプロイメントをクリック
3. 「**View Logs**」をクリック
4. 以下のエラーメッセージを確認：

#### エラー1: ポート使用エラー
```
Error: Port 8000 is already in use
```
**解決方法**: `PORT`環境変数を削除

#### エラー2: データベース接続エラー
```
✗ Error: Could not connect to database
```
**解決方法**: 
1. PostgreSQLサービスが起動しているか確認
2. 環境変数の`${{Postgres.*}}`参照が正しいか確認
3. PostgreSQLサービス名が正しいか確認

#### エラー3: サーバーが起動しない
ログに「Server is running」が表示されない
**解決方法**: 
1. 環境変数を再確認
2. 「Settings」→「Deployments」→「Redeploy」をクリック

### ステップ4: 再デプロイ

1. 「**Settings**」→「**Deployments**」を開く
2. 「**Redeploy**」をクリック
3. デプロイが完了するまで待つ（5-10分）
4. ログを確認

### ステップ5: 動作確認

ブラウザで以下にアクセス：
- `https://<バックエンドのURL>/api/health`

正常な場合、以下のJSONが返されます：
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T..."
}
```

## 🔍 詳細な診断

### 診断1: バックエンドが起動しているか確認

```bash
# Railway CLIを使用
railway logs backend

# または、Railwayダッシュボードで
# 「Deployments」→「View Logs」
```

**確認すべきログメッセージ：**
- `✓ Server is running on port <PORT>`
- `✓ Listening on 0.0.0.0:<PORT>`
- `✓ Database connection successful.`

### 診断2: 環境変数の確認

Railwayダッシュボードで：
1. バックエンドサービス → 「**Variables**」
2. すべての環境変数が正しく設定されているか確認
3. `PORT`環境変数が設定されている場合は**削除**

### 診断3: データベース接続の確認

1. PostgreSQLサービスが起動しているか確認
2. バックエンドの環境変数で：
   - `DB_HOST=${{Postgres.PGHOST}}` の`Postgres`が実際のサービス名と一致しているか確認
3. ログにデータベース接続エラーがないか確認

### 診断4: ネットワーク設定の確認

1. 「**Settings**」→「**Networking**」を開く
2. 公開ドメインが生成されているか確認
3. **「Public」トグルがONになっているか確認**

## 🛠️ よくある問題と解決方法

### 問題1: PORT環境変数の競合

**症状**: サーバーが起動しない

**原因**: Railwayが自動設定する`PORT`と手動設定の`PORT`が競合

**解決方法**: 
1. Railwayダッシュボードで`PORT`環境変数を**削除**
2. コードで`process.env.PORT || 8000`を使用（既に実装済み）
3. 再デプロイ

### 問題2: データベース接続エラー

**症状**: ログに「Could not connect to database」が表示

**原因**: 環境変数のサービス参照が間違っている

**解決方法**:
1. PostgreSQLサービス名を確認（通常は`Postgres`）
2. `${{Postgres.PGHOST}}`の`Postgres`を実際のサービス名に変更
3. すべてのデータベース関連環境変数を確認
4. 再デプロイ

### 問題3: 公開設定がOFF

**症状**: 502エラーが発生する

**原因**: 「Public」トグルがOFFになっている

**解決方法**:
1. 「Settings」→「Networking」を開く
2. **「Public」トグルをONにする**（完全公開モード）
3. 再デプロイ

### 問題4: ビルドエラー

**症状**: デプロイが失敗する

**原因**: Dockerfileまたはコードに問題がある

**解決方法**:
1. ビルドログを確認（「Deployments」→「View Logs」）
2. エラーメッセージに従って修正
3. ローカルで`docker build`を実行して確認
4. 再デプロイ

## 📋 クイックチェックリスト

502エラーが発生した場合、以下を順番に確認：

- [ ] `PORT`環境変数が設定されていない（削除する）
- [ ] すべての必須環境変数が設定されている
- [ ] PostgreSQLサービスが起動している
- [ ] データベース環境変数のサービス参照が正しい
- [ ] 公開ドメインが生成されている
- [ ] **「Public」トグルがONになっている**（完全公開モード）
- [ ] デプロイが完了している
- [ ] ログにエラーがない
- [ ] `/api/health`エンドポイントが応答している

## 🚀 完全リセット手順

すべてがうまくいかない場合：

1. **バックエンドサービスを削除**
   - バックエンドサービス → 「Settings」→「Delete Service」

2. **バックエンドサービスを再作成**
   - 「New」→「GitHub Repo」
   - Root Directory: `backend`
   - Dockerfile Path: `Dockerfile.prod`

3. **環境変数を再設定**
   - `railway-env-setup.md`を参照

4. **公開設定を確認**
   - 「Settings」→「Networking」
   - 「Generate Domain」をクリック
   - **「Public」トグルをONにする**

5. **デプロイを待つ**

## 📞 サポート

問題が解決しない場合：

1. Railwayのデプロイログを確認
2. エラーメッセージをコピー
3. `RAILWAY_502_FIX.md`を参照
4. `TROUBLESHOOTING.md`を参照
5. Railwayの「Help Station」を確認
