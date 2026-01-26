# Railway 502 Bad Gateway エラー解決ガイド

## 🔴 問題: 502 Bad Gateway エラー

「Application failed to respond」エラーが表示される場合、バックエンドサーバーが起動していないか、正しく応答していません。

## 🔍 原因の確認

### ステップ1: デプロイログの確認

1. Railwayダッシュボードでバックエンドサービスを開く
2. 「**Deployments**」タブを開く
3. 最新のデプロイメントをクリック
4. 「**View Logs**」をクリック
5. エラーメッセージを確認

### ステップ2: 確認すべきエラー

#### エラー1: ポート設定エラー
```
Error: Port 8000 is already in use
```
**解決方法**: Railwayは自動的にPORT環境変数を設定するため、`PORT`環境変数を削除するか、`process.env.PORT`を使用する

#### エラー2: データベース接続エラー
```
✗ Error: Could not connect to database
```
**解決方法**: 環境変数の`${{Postgres.*}}`参照が正しいか確認

#### エラー3: TypeScriptコンパイルエラー
```
error TS2307: Cannot find module
```
**解決方法**: 依存関係が正しくインストールされているか確認

#### エラー4: サーバーが起動しない
ログに「Server is running」が表示されない
**解決方法**: サーバー起動コードを確認

## ✅ 解決方法

### 方法1: ポート設定の修正

Railwayは自動的に`PORT`環境変数を設定します。コードで`PORT`環境変数を使用していることを確認してください。

**確認ポイント:**
- `backend/src/app.ts`で`process.env.PORT || 8000`を使用しているか
- 環境変数で`PORT=8000`を設定していないか（削除する）

### 方法2: サーバーのリスニングアドレス確認

サーバーが`0.0.0.0`でリッスンしていることを確認：

```typescript
app.listen(PORT, '0.0.0.0', () => {
  // ...
});
```

### 方法3: 環境変数の再確認

バックエンドサービスの「**Variables**」タブで以下を確認：

1. **必須環境変数:**
   - `NODE_ENV=production`
   - `DB_HOST=${{Postgres.PGHOST}}` （サービス名を確認）
   - `DB_PORT=${{Postgres.PGPORT}}`
   - `DB_NAME=${{Postgres.PGDATABASE}}`
   - `DB_USER=${{Postgres.PGUSER}}`
   - `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
   - `JWT_SECRET=<強力なランダム文字列>`

2. **PORT環境変数:**
   - Railwayが自動設定するため、**削除**してください
   - または、`PORT`を設定しないでください

### 方法4: デプロイの再実行

1. バックエンドサービスの「**Settings**」→「**Deployments**」を開く
2. 「**Redeploy**」をクリック
3. デプロイが完了するまで待つ（5-10分）
4. ログを確認

### 方法5: コンテナの再ビルド

1. バックエンドサービスの「**Settings**」を開く
2. 「**Deploy**」タブで「**Clear Build Cache**」をクリック
3. 「**Redeploy**」をクリック

## 🛠️ トラブルシューティング手順

### 手順1: ログの確認

Railwayダッシュボードで：
1. バックエンドサービス → 「**Deployments**」
2. 最新のデプロイメント → 「**View Logs**」
3. エラーメッセージをコピー

### 手順2: 環境変数の確認

1. バックエンドサービス → 「**Variables**」
2. すべての環境変数が正しく設定されているか確認
3. `PORT`環境変数が設定されている場合は**削除**

### 手順3: バックエンドの動作確認

1. バックエンドサービスの「**Settings**」→「**Networking**」でURLを確認
2. ブラウザで `https://<バックエンドURL>/api/health` にアクセス
3. JSONレスポンスが返れば正常

### 手順4: データベース接続の確認

ログにデータベース接続エラーが表示される場合：

1. PostgreSQLサービスが起動しているか確認
2. 環境変数の`${{Postgres.*}}`参照が正しいか確認
3. PostgreSQLサービス名が正しいか確認（通常は`Postgres`）

## 📝 よくある問題と解決方法

### 問題1: PORT環境変数の競合

**症状**: サーバーが起動しない

**原因**: Railwayが自動設定する`PORT`と手動設定の`PORT`が競合

**解決方法**: 
- Railwayダッシュボードで`PORT`環境変数を**削除**
- コードで`process.env.PORT || 8000`を使用

### 問題2: データベース接続エラー

**症状**: ログに「Could not connect to database」が表示

**原因**: 環境変数のサービス参照が間違っている

**解決方法**:
1. PostgreSQLサービス名を確認
2. `${{Postgres.PGHOST}}`の`Postgres`を実際のサービス名に変更
3. すべてのデータベース関連環境変数を確認

### 問題3: ビルドエラー

**症状**: デプロイが失敗する

**原因**: TypeScriptコンパイルエラーや依存関係の問題

**解決方法**:
1. ログでエラーメッセージを確認
2. ローカルで`npm run build`を実行してエラーを確認
3. エラーを修正してコミット・プッシュ

### 問題4: サーバーが起動しない

**症状**: ログに「Server is running」が表示されない

**原因**: サーバー起動コードに問題がある

**解決方法**:
1. `backend/src/app.ts`のサーバー起動コードを確認
2. `app.listen(PORT, '0.0.0.0', ...)`を使用しているか確認
3. エラーハンドリングが正しく実装されているか確認

## 🔄 完全リセット手順

すべてがうまくいかない場合：

1. **バックエンドサービスを削除**
   - バックエンドサービス → 「**Settings**」→「**Delete Service**」

2. **バックエンドサービスを再作成**
   - 「**+ New**」→「**GitHub Repo**」
   - Root Directory: `backend`
   - Dockerfile Path: `Dockerfile.prod`

3. **環境変数を再設定**
   - `railway-env-setup.md`を参照

4. **デプロイを待つ**

## 📞 サポート

問題が解決しない場合：

1. Railwayのデプロイログを確認
2. エラーメッセージをコピー
3. `TROUBLESHOOTING.md`を参照
4. Railwayの「**Help Station**」を確認
