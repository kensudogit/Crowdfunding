# Railway 完全公開デプロイ チェックリスト

このチェックリストを使用して、Railwayへの完全公開デプロイを確実に完了してください。

## 📋 事前準備

- [ ] Railwayアカウントを作成済み
- [ ] GitHubリポジトリにコードがプッシュ済み
- [ ] Railwayプロジェクトを作成済み

## 🗄️ ステップ1: PostgreSQLデータベース

- [ ] 「New」→「Database」→「Add PostgreSQL」でデータベースを作成
- [ ] データベースサービス名を確認（通常は`Postgres`）
- [ ] データベースが起動していることを確認

## 🔧 ステップ2: バックエンドサービス

### サービス作成
- [ ] 「New」→「GitHub Repo」でサービスを作成
- [ ] Root Directory: `backend` に設定
- [ ] Dockerfile Path: `Dockerfile.prod` に設定

### 環境変数設定
- [ ] `NODE_ENV=production`
- [ ] `PORT`環境変数は**設定しない**（重要！）
- [ ] `DB_HOST=${{Postgres.PGHOST}}` （サービス名を確認）
- [ ] `DB_PORT=${{Postgres.PGPORT}}`
- [ ] `DB_NAME=${{Postgres.PGDATABASE}}`
- [ ] `DB_USER=${{Postgres.PGUSER}}`
- [ ] `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
- [ ] `JWT_SECRET=<強力なランダム文字列>` （32文字以上）
- [ ] `FRONTEND_URL=https://<一時的なURL>` （後で更新）
- [ ] `CORS_ORIGIN=https://<一時的なURL>` （後で更新）

### 公開設定（完全公開モード）
- [ ] 「Settings」→「Networking」を開く
- [ ] 「Generate Domain」をクリック
- [ ] 生成されたURLをコピー（例: `https://crowdfunding-backend-production.up.railway.app`）
- [ ] **「Public」トグルをONにする**（完全公開モード）
- [ ] バックエンドURLをメモ: `___________________________`

### デプロイ確認
- [ ] 「Deployments」タブでデプロイが開始された
- [ ] デプロイが完了した（緑色のチェックマーク）
- [ ] 「View Logs」で以下が表示される：
  - `✓ Server is running on port <PORT>`
  - `✓ Listening on 0.0.0.0:<PORT>`
- [ ] ブラウザで `https://<バックエンドURL>/api/health` にアクセス
- [ ] JSONレスポンスが返される（`{"status":"healthy",...}`）

## 🎨 ステップ3: フロントエンドサービス

### サービス作成
- [ ] 「New」→「GitHub Repo」でサービスを作成（同じリポジトリ）
- [ ] Root Directory: `frontend` に設定
- [ ] Dockerfile Path: `Dockerfile.prod` に設定

### 環境変数設定
- [ ] `VITE_API_URL=https://<バックエンドURL>/api` （ステップ2でコピーしたURLを使用）
- [ ] `/api`を必ず含めている

### 公開設定（完全公開モード）
- [ ] 「Settings」→「Networking」を開く
- [ ] 「Generate Domain」をクリック
- [ ] 生成されたURLをコピー（例: `https://crowdfunding-frontend-production.up.railway.app`）
- [ ] **「Public」トグルをONにする**（完全公開モード）
- [ ] フロントエンドURLをメモ: `___________________________`

### デプロイ確認
- [ ] 「Deployments」タブでデプロイが開始された
- [ ] デプロイが完了した（緑色のチェックマーク）
- [ ] 「View Logs」でエラーがないことを確認

## 🔄 ステップ4: バックエンド環境変数の更新

- [ ] バックエンドサービスの「Variables」タブを開く
- [ ] `FRONTEND_URL`を更新: `https://<フロントエンドURL>` （ステップ3でコピーしたURL）
- [ ] `CORS_ORIGIN`を更新: `https://<フロントエンドURL>` （ステップ3でコピーしたURL）
- [ ] 保存して再デプロイが開始された

## 🗃️ ステップ5: データベース初期化

- [ ] 方法1: APIエンドポイントを使用
  - [ ] `POST https://<バックエンドURL>/api/sample-data/generate` にアクセス
  - [ ] 成功レスポンスが返される
- [ ] または方法2: Railway CLIを使用
  - [ ] `railway connect postgres` で接続
  - [ ] SQLファイルを実行

## ✅ ステップ6: 動作確認

### バックエンド
- [ ] `https://<バックエンドURL>/api/health` が応答する
- [ ] `https://<バックエンドURL>/` が応答する

### フロントエンド
- [ ] `https://<フロントエンドURL>` が表示される
- [ ] ブラウザのコンソールにエラーがない
- [ ] ネットワークタブでAPIリクエストが成功している

### 機能テスト
- [ ] ユーザー登録が動作する
- [ ] ログインが動作する
- [ ] プロジェクト一覧が表示される
- [ ] プロジェクト作成が動作する
- [ ] プロジェクト詳細が表示される
- [ ] 支援機能が動作する

## 🔒 セキュリティ確認

- [ ] `JWT_SECRET`が強力なランダム文字列になっている
- [ ] 環境変数に機密情報が含まれていない（コードに直接書かれていない）
- [ ] HTTPSでアクセスできる（HTTPは自動的にHTTPSにリダイレクト）

## 🐛 トラブルシューティング

### 502エラーが発生する場合
- [ ] バックエンドのログを確認（「Deployments」→「View Logs」）
- [ ] 環境変数が正しく設定されているか確認
- [ ] `PORT`環境変数が設定されていないか確認（削除する）
- [ ] データベース接続エラーがないか確認

### フロントエンドがAPIに接続できない場合
- [ ] `VITE_API_URL`が正しく設定されているか確認
- [ ] バックエンドの`FRONTEND_URL`と`CORS_ORIGIN`が正しく設定されているか確認
- [ ] ブラウザのコンソールでエラーを確認

### デプロイが失敗する場合
- [ ] ビルドログを確認（「Deployments」→「View Logs」）
- [ ] Dockerfileが正しく配置されているか確認
- [ ] 必要なファイルが`.railwayignore`で除外されていないか確認

## 📝 デプロイ完了後のメモ

### URL情報
- **バックエンドURL**: `_________________________________`
- **フロントエンドURL**: `_________________________________`
- **データベース**: Railwayダッシュボードで確認

### 重要な情報
- **JWT_SECRET**: `_________________________________` （安全に保管）
- **デプロイ日時**: `_________________________________`

## 🎉 完了！

すべてのチェック項目が完了したら、アプリケーションは完全公開モードで動作しています。

## 📚 参考資料

- **詳細ガイド**: `RAILWAY_PUBLIC_DEPLOY.md`
- **502エラー解決**: `RAILWAY_502_FIX.md`
- **トラブルシューティング**: `TROUBLESHOOTING.md`
- **環境変数設定**: `railway-env-setup.md`
