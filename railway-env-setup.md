# Railway 環境変数設定ガイド

このガイドでは、Railwayダッシュボードで環境変数を設定する具体的な手順を説明します。

## 📍 環境変数の設定場所

Railwayダッシュボードで環境変数を設定する方法：

1. Railway Dashboardにログイン: https://railway.app/dashboard
2. プロジェクトを選択
3. サービス（バックエンドまたはフロントエンド）をクリック
4. 「**Variables**」タブを開く
5. 「**+ New Variable**」ボタンをクリック
6. 変数名と値を入力して「**Add**」をクリック

## 🔧 バックエンド環境変数

### 必須環境変数

以下の環境変数を**順番に**追加してください：

#### 1. NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

#### 2. PORT（設定不要）
- **重要**: `PORT`環境変数は**設定しないでください**
- Railwayが自動的に`PORT`環境変数を設定します
- コードで`process.env.PORT`を使用しているため、手動設定は不要です

#### 3. DB_HOST
- **Key**: `DB_HOST`
- **Value**: `${{Postgres.PGHOST}}`
- **注意**: `Postgres` は、実際のPostgreSQLサービス名に合わせて変更してください

#### 4. DB_PORT
- **Key**: `DB_PORT`
- **Value**: `${{Postgres.PGPORT}}`

#### 5. DB_NAME
- **Key**: `DB_NAME`
- **Value**: `${{Postgres.PGDATABASE}}`

#### 6. DB_USER
- **Key**: `DB_USER`
- **Value**: `${{Postgres.PGUSER}}`

#### 7. DB_PASSWORD
- **Key**: `DB_PASSWORD`
- **Value**: `${{Postgres.PGPASSWORD}}`

#### 8. JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: （強力なランダム文字列 - 下記参照）

**JWT_SECRETの生成方法:**

PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Git Bash / WSL:
```bash
openssl rand -base64 32
```

#### 9. FRONTEND_URL（一時的）
- **Key**: `FRONTEND_URL`
- **Value**: `https://localhost:3000` （後で更新）

#### 10. CORS_ORIGIN（一時的）
- **Key**: `CORS_ORIGIN`
- **Value**: `https://localhost:3000` （後で更新）

### フロントエンドデプロイ後の更新

フロントエンドがデプロイされたら、以下を更新：

- **FRONTEND_URL**: フロントエンドのRailway URLに変更
- **CORS_ORIGIN**: フロントエンドのRailway URLに変更

## 🎨 フロントエンド環境変数

### 必須環境変数

#### 1. VITE_API_URL
- **Key**: `VITE_API_URL`
- **Value**: `https://<バックエンドのRailway URL>/api`
- **例**: `https://crowdfunding-backend-production.up.railway.app/api`

**重要**: 
- バックエンドのURLは、バックエンドサービスの「Settings」→「Networking」で確認できます
- `/api` を必ず含めてください

## 🔍 環境変数の確認方法

### Railwayダッシュボードで確認

1. サービスの「**Variables**」タブを開く
2. 設定したすべての環境変数が表示されます
3. 変数名の横の「**...**」をクリックして編集・削除できます

### Railway CLIで確認

```bash
railway variables
```

## ⚠️ よくある間違い

### 1. サービス参照構文の間違い

**間違い:**
```
DB_HOST=$Postgres.PGHOST
DB_HOST={{Postgres.PGHOST}}
DB_HOST=${{Postgres.PGHOST}}
```

**正しい:**
```
DB_HOST=${{Postgres.PGHOST}}
```

### 2. フロントエンドURLの間違い

**間違い:**
```
VITE_API_URL=https://backend.railway.app
VITE_API_URL=https://backend.railway.app/api/
```

**正しい:**
```
VITE_API_URL=https://backend.railway.app/api
```

### 3. JWT_SECRETが弱い

**間違い:**
```
JWT_SECRET=secret
JWT_SECRET=123456
```

**正しい:**
```
JWT_SECRET=<32文字以上のランダム文字列>
```

## 📋 環境変数設定チェックリスト

### バックエンド
- [ ] `NODE_ENV=production`
- [ ] `PORT`環境変数は**設定しない**（Railwayが自動設定）
- [ ] `DB_HOST=${{Postgres.PGHOST}}` （サービス名を確認）
- [ ] `DB_PORT=${{Postgres.PGPORT}}`
- [ ] `DB_NAME=${{Postgres.PGDATABASE}}`
- [ ] `DB_USER=${{Postgres.PGUSER}}`
- [ ] `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
- [ ] `JWT_SECRET=<強力なランダム文字列>`
- [ ] `FRONTEND_URL=<フロントエンドのURL>`
- [ ] `CORS_ORIGIN=<フロントエンドのURL>`

### フロントエンド
- [ ] `VITE_API_URL=https://<バックエンドのURL>/api`

## 🔄 環境変数の更新

環境変数を更新すると、自動的に再デプロイが開始されます。

1. 「**Variables**」タブで変数を編集
2. 「**Save**」をクリック
3. 「**Deployments**」タブで再デプロイの進行を確認

## 🆘 トラブルシューティング

### 環境変数が反映されない

1. 変数名のタイプミスを確認
2. 値の前後に余分なスペースがないか確認
3. サービスを再デプロイ

### サービス参照が機能しない

1. PostgreSQLサービス名を確認
2. サービス参照構文 `${{ServiceName.VARIABLE}}` が正しいか確認
3. PostgreSQLサービスが同じプロジェクト内にあるか確認
