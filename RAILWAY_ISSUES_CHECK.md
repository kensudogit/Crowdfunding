# Railway 設定 問題チェックリスト

## 🔴 発見された問題

RailwayダッシュボードのCrowdfundingサービスの「Variables」タブを確認した結果、以下の問題が発見されました：

### 問題1: データベース接続環境変数が設定されていない（最重要）

**現状**: 「Trying to connect a database? Add Variable」というメッセージが表示されています。

**必要な環境変数**:
以下の環境変数が**設定されていません**：

- `DB_HOST=${{Postgres.PGHOST}}`
- `DB_PORT=${{Postgres.PGPORT}}`
- `DB_NAME=${{Postgres.PGDATABASE}}`
- `DB_USER=${{Postgres.PGUSER}}`
- `DB_PASSWORD=${{Postgres.PGPASSWORD}}`

**影響**: これが502エラーの主な原因です。バックエンドがデータベースに接続できず、サーバーが起動に失敗しています。

### 問題2: JWT_SECRETがプレースホルダーのまま

**現状**: `JWT_SECRET=your-very-secure-secret-key-change-this-in-production`

**問題**: これはプレースホルダー値のままです。本番環境では強力なランダム文字列に変更する必要があります。

**影響**: セキュリティ上の問題があります。

### 問題3: FRONTEND_URLとCORS_ORIGINがプレースホルダーのまま

**現状**: 
- `FRONTEND_URL=https://your-frontend-service.railway.app`
- `CORS_ORIGIN=https://your-frontend-service.railway.app`

**問題**: プレースホルダー値のままです。実際のフロントエンドのURLに変更する必要があります。

**影響**: CORSエラーが発生する可能性があります。

### 問題4: VITE_API_URLがプレースホルダーのまま

**現状**: `VITE_API_URL=https://your-backend-service.railway.app/api`

**問題**: プレースホルダー値のままです。実際のバックエンドのURLに変更する必要があります。

**影響**: フロントエンドがAPIに接続できません。

## ✅ 修正手順

### ステップ1: データベース接続環境変数を追加（最重要）

1. Crowdfundingサービスの「Variables」タブで「**+ New Variable**」をクリック
2. 以下の環境変数を追加：

#### 方法A: Reference機能を使用（推奨）

1. **DB_HOST**
   - 変数名: `DB_HOST`
   - 「Reference」ボタンをクリック
   - 「Postgres」サービスを選択
   - `PGHOST`を選択
   - 値: `${{Postgres.PGHOST}}`

2. **DB_PORT**
   - 変数名: `DB_PORT`
   - 「Reference」ボタンをクリック
   - 「Postgres」サービスを選択
   - `PGPORT`を選択
   - 値: `${{Postgres.PGPORT}}`

3. **DB_NAME**
   - 変数名: `DB_NAME`
   - 「Reference」ボタンをクリック
   - 「Postgres」サービスを選択
   - `PGDATABASE`を選択
   - 値: `${{Postgres.PGDATABASE}}`

4. **DB_USER**
   - 変数名: `DB_USER`
   - 「Reference」ボタンをクリック
   - 「Postgres」サービスを選択
   - `PGUSER`を選択
   - 値: `${{Postgres.PGUSER}}`

5. **DB_PASSWORD**
   - 変数名: `DB_PASSWORD`
   - 「Reference」ボタンをクリック
   - 「Postgres」サービスを選択
   - `PGPASSWORD`を選択
   - 値: `${{Postgres.PGPASSWORD}}`

#### 方法B: 手動で設定

もしReference機能が使えない場合は、手動で以下を設定：

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

**重要**: `Postgres`は実際のPostgresサービスの名前と一致している必要があります。

### ステップ2: JWT_SECRETを更新

1. `JWT_SECRET`環境変数を編集
2. プレースホルダー値を削除
3. 強力なランダム文字列を設定

**JWT_SECRETの生成方法（PowerShell）:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**JWT_SECRETの生成方法（Git Bash / WSL）:**
```bash
openssl rand -base64 32
```

### ステップ3: FRONTEND_URLとCORS_ORIGINを更新

1. フロントエンドサービスのURLを確認
   - Railwayダッシュボードでフロントエンドサービスを開く
   - 「Settings」→「Networking」でURLを確認
   - 例: `https://crowdfunding-frontend-production.up.railway.app`

2. `FRONTEND_URL`環境変数を編集
   - 値: `https://<実際のフロントエンドのURL>`

3. `CORS_ORIGIN`環境変数を編集
   - 値: `https://<実際のフロントエンドのURL>`

### ステップ4: VITE_API_URLを更新（フロントエンドサービス）

1. フロントエンドサービスの「Variables」タブを開く
2. `VITE_API_URL`環境変数を編集
3. バックエンドサービスのURLを確認
   - Railwayダッシュボードでバックエンドサービスを開く
   - 「Settings」→「Networking」でURLを確認
   - 例: `https://crowdfunding-backend-production.up.railway.app`
4. 値: `https://<実際のバックエンドのURL>/api`

### ステップ5: PORT環境変数の確認

**重要**: `PORT`環境変数が設定されている場合は**削除してください**。

- Railwayが自動的に`PORT`環境変数を設定します
- 手動設定は不要です

### ステップ6: 再デプロイ

1. 「Settings」タブ → 「Deployments」を開く
2. 「Redeploy」ボタンをクリック
3. デプロイが完了するまで待つ（5-10分）

### ステップ7: デプロイログを確認

1. 「Deployments」タブで最新のデプロイメントをクリック
2. 「View Logs」ボタンをクリック
3. 以下のメッセージが表示されれば成功：

```
✓ Server is running on port <PORT>
✓ Listening on 0.0.0.0:<PORT>
✓ Database connection successful.
```

## 📋 完全な環境変数チェックリスト

### バックエンドサービス（Crowdfunding）

- [ ] `NODE_ENV=production`
- [ ] `PORT`環境変数が**設定されていない**（削除済み）
- [ ] `DB_HOST=${{Postgres.PGHOST}}`
- [ ] `DB_PORT=${{Postgres.PGPORT}}`
- [ ] `DB_NAME=${{Postgres.PGDATABASE}}`
- [ ] `DB_USER=${{Postgres.PGUSER}}`
- [ ] `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
- [ ] `JWT_SECRET=<強力なランダム文字列>`（プレースホルダーではない）
- [ ] `FRONTEND_URL=https://<実際のフロントエンドのURL>`
- [ ] `CORS_ORIGIN=https://<実際のフロントエンドのURL>`

### フロントエンドサービス

- [ ] `VITE_API_URL=https://<実際のバックエンドのURL>/api`

## 🎯 優先順位

1. **最優先**: データベース接続環境変数の追加（問題1）
   - これが502エラーの主な原因です

2. **高優先度**: JWT_SECRETの更新（問題2）
   - セキュリティ上の問題です

3. **中優先度**: FRONTEND_URL、CORS_ORIGIN、VITE_API_URLの更新（問題3、4）
   - CORSエラーやAPI接続エラーの原因になります

## 📞 参考資料

- **データベース接続修正**: `RAILWAY_DB_CONNECTION_FIX.md`
- **緊急修正**: `RAILWAY_502_URGENT_FIX.md`
- **環境変数設定**: `railway-env-setup.md`
