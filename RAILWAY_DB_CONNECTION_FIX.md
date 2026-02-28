# Railway データベース接続設定 修正ガイド

## 🔴 発見された問題

RailwayダッシュボードのPostgresサービスの「Variables」タブに以下の警告が表示されています：

> **"Trying to connect this database to a service? Add a Variable Reference"**

これは、CrowdfundingサービスがPostgresデータベースに接続するための環境変数が正しく設定されていないことを示しています。

## ✅ 修正手順

### ステップ1: CrowdfundingサービスのVariablesタブを開く

1. Railwayダッシュボードで**Crowdfundingサービス**をクリック
2. 「**Variables**」タブを開く

### ステップ2: データベース接続用の環境変数を確認

現在設定されている環境変数を確認してください。以下の環境変数が設定されている必要があります：

| 変数名 | 値 | 必須 |
|--------|-----|------|
| `DB_HOST` | `${{Postgres.PGHOST}}` | ✅ |
| `DB_PORT` | `${{Postgres.PGPORT}}` | ✅ |
| `DB_NAME` | `${{Postgres.PGDATABASE}}` | ✅ |
| `DB_USER` | `${{Postgres.PGUSER}}` | ✅ |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` | ✅ |

### ステップ3: Variable Referenceを追加（推奨方法）

**方法A: Variable Referenceを使用（推奨）**

1. Crowdfundingサービスの「Variables」タブで「**+ New Variable**」をクリック
2. 変数名を入力（例: `DB_HOST`）
3. 値の入力欄の右側にある「**Reference**」ボタンをクリック
4. 「**Postgres**」サービスを選択
5. 参照する変数を選択（例: `PGHOST`）
6. 自動的に`${{Postgres.PGHOST}}`という形式で入力されます
7. 「**Add**」をクリック

**以下の環境変数を追加してください：**

1. **DB_HOST**
   - Reference: Postgres → `PGHOST`
   - 値: `${{Postgres.PGHOST}}`

2. **DB_PORT**
   - Reference: Postgres → `PGPORT`
   - 値: `${{Postgres.PGPORT}}`

3. **DB_NAME**
   - Reference: Postgres → `PGDATABASE`
   - 値: `${{Postgres.PGDATABASE}}`

4. **DB_USER**
   - Reference: Postgres → `PGUSER`
   - 値: `${{Postgres.PGUSER}}`

5. **DB_PASSWORD**
   - Reference: Postgres → `PGPASSWORD`
   - 値: `${{Postgres.PGPASSWORD}}`

**方法B: 手動で環境変数を設定**

もしReference機能が使えない場合は、手動で設定してください：

1. 「**+ New Variable**」をクリック
2. 変数名と値を入力：

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

**重要**: 
- `Postgres`は実際のPostgresサービスの名前と一致している必要があります
- サービス名が異なる場合は、実際のサービス名に置き換えてください

### ステップ4: その他の必須環境変数を確認

データベース接続以外の環境変数も確認してください：

| 変数名 | 値 | 必須 |
|--------|-----|------|
| `NODE_ENV` | `production` | ✅ |
| `JWT_SECRET` | `<強力なランダム文字列>` | ✅ |
| `FRONTEND_URL` | `https://<フロントエンドのURL>` | ✅ |
| `CORS_ORIGIN` | `https://<フロントエンドのURL>` | ✅ |

**重要**: 
- `PORT`環境変数は**設定しないでください**（Railwayが自動設定）

### ステップ5: 環境変数の確認

設定が完了したら、以下の形式になっていることを確認してください：

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
NODE_ENV=production
JWT_SECRET=<強力なランダム文字列>
FRONTEND_URL=https://<フロントエンドのURL>
CORS_ORIGIN=https://<フロントエンドのURL>
```

### ステップ6: 再デプロイ

1. 「**Settings**」タブを開く
2. 「**Deployments**」をクリック
3. 「**Redeploy**」ボタンをクリック
4. デプロイが完了するまで待つ（5-10分）

### ステップ7: デプロイログを確認

1. 「**Deployments**」タブで最新のデプロイメントをクリック
2. 「**View Logs**」ボタンをクリック
3. 以下のメッセージが表示されれば成功：

```
✓ Server is running on port <PORT>
✓ Listening on 0.0.0.0:<PORT>
✓ Database connection successful.
```

**データベース接続エラーが表示される場合：**

```
✗ Error: Could not connect to database
```

**解決方法**: 
1. 環境変数のサービス参照が正しいか確認（`${{Postgres.*}}`の`Postgres`が実際のサービス名と一致しているか）
2. PostgreSQLサービスが起動しているか確認
3. 環境変数を再確認して再デプロイ

## 🔍 サービス名の確認方法

Postgresサービスの実際の名前を確認する方法：

1. Railwayダッシュボードの左側のサイドバーでPostgresサービスを確認
2. サービス名が`Postgres`以外の場合（例: `postgres`、`PostgreSQL`など）、環境変数の参照を実際のサービス名に合わせて変更

例：
- サービス名が`postgres`の場合: `${{postgres.PGHOST}}`
- サービス名が`PostgreSQL`の場合: `${{PostgreSQL.PGHOST}}`

## ✅ 動作確認

修正後、以下で動作確認してください：

1. **バックエンドヘルスチェック**
   ```
   https://<バックエンドのURL>/api/health
   ```

2. **デプロイログ**
   - 「Deployments」→「View Logs」で「Database connection successful」が表示されるか確認

3. **ブラウザのコンソール**
   - F12キーで開発者ツールを開く
   - 「Console」タブで502エラーが解消されているか確認

## 📋 チェックリスト

データベース接続を修正するために、以下を確認してください：

- [ ] Crowdfundingサービスの「Variables」タブを開いた
- [ ] `DB_HOST=${{Postgres.PGHOST}}`が設定されている
- [ ] `DB_PORT=${{Postgres.PGPORT}}`が設定されている
- [ ] `DB_NAME=${{Postgres.PGDATABASE}}`が設定されている
- [ ] `DB_USER=${{Postgres.PGUSER}}`が設定されている
- [ ] `DB_PASSWORD=${{Postgres.PGPASSWORD}}`が設定されている
- [ ] Postgresサービスの名前が正しい（`Postgres`または実際のサービス名）
- [ ] `PORT`環境変数が設定されていない（削除済み）
- [ ] その他の必須環境変数が設定されている
- [ ] 再デプロイが完了している
- [ ] ログに「Database connection successful」が表示されている
- [ ] `/api/health`エンドポイントが応答している

## 🎯 502エラーの原因

502エラーの原因として、データベース接続エラーが考えられます：

1. **データベース接続環境変数が設定されていない**
   - CrowdfundingサービスがPostgresに接続できない
   - サーバーが起動に失敗する

2. **サービス参照が間違っている**
   - `${{Postgres.*}}`の`Postgres`が実際のサービス名と一致していない

3. **PostgreSQLサービスが起動していない**
   - データベース自体が起動していない

## 📞 参考資料

- **緊急修正**: `RAILWAY_502_URGENT_FIX.md`
- **ステップバイステップ**: `RAILWAY_FIX_502_STEPS.md`
- **環境変数設定**: `railway-env-setup.md`
- **完全公開デプロイ**: `RAILWAY_PUBLIC_DEPLOY.md`
