# Railway で 404 / CORS が出るときのチェックリスト

登録やプロジェクト一覧で「ネットワークエラー」「CORS」「404」が出る場合、**バックエンドのデプロイ設定**を次の順で確認してください。

---

## 1. バックエンドの URL を直接開く

ブラウザで **新しいタブ** を開き、次を入力してアクセスする（実際のバックエンド URL に読み替えてください）:

```
https://crowdfunding-backend-production.up.railway.app/
```

**結果の見方:**

| 表示 | 意味 | 次にやること |
|------|------|----------------|
| **JSON**（`{"message":"Crowdfunding API",...}`） | ✅ バックエンドは動いている | ステップ 4 へ |
| **404 Not Found** | ❌ この URL で動いているのは **Crowdfunding の Express ではない** | ステップ 2 へ |
| **502 Bad Gateway** や **接続できない** | ❌ バックエンドが起動していない | ステップ 2 と 3 へ |

---

## 2. Root Directory を `backend` に設定する

1. Railway のダッシュボードで **Crowdfunding-backend** サービスを開く。
2. **Settings** → **Source**（または **Build**）を開く。
3. **Root Directory** の欄を確認する。
   - **空** または **ルート** のまま → ここが原因で 404 になっていることが多いです。
4. **Root Directory** に **`backend`** と入力する。
5. 保存する。

---

## 3. データベース用の変数を設定する

1. **Crowdfunding-backend** の **Variables** を開く。
2. **`DATABASE_URL`** があるか確認する。
   - **ない場合**: Postgres サービスをバックエンドに「接続」するか、Postgres の **Variables** にある接続 URL をコピーし、**`DATABASE_URL`** という名前でバックエンドに追加する。
   - または **`DB_HOST`**・**`DB_PORT`**・**`DB_NAME`**・**`DB_USER`**・**`DB_PASSWORD`** を個別に設定する（詳細は `RAILWAY_DEPLOY.md` の「バックエンドの Variables」参照）。

---

## 4. 再デプロイして確認する

1. **Crowdfunding-backend** の **Deployments** を開く。
2. **Redeploy** を実行する（またはコードを push して自動デプロイを待つ）。
3. デプロイが **Success** になったら、もう一度 **ステップ 1** の URL を開く。
4. **JSON が表示されれば**、フロントの **登録** ページを開き直して（ハードリロード: Ctrl+Shift+R）登録を試す。

---

## 5. まだ 404 / CORS が出る場合

- **Crowdfunding-backend** の **Deployments** → 最新のデプロイ → **View Logs** を開く。
- 起動直後に **エラー**（DB 接続失敗、Cannot find module など）が出ていないか確認する。
- エラーがあれば、その内容に合わせて **Variables**（`DATABASE_URL` など）を見直す。

---

## フロントの `API_URL` について

- **Crowdfunding**（フロント）の **Variables** の **`API_URL`** は、**バックエンドの URL** にすること。
- 例: `https://crowdfunding-backend-production.up.railway.app`  
  （**フロント**の URL `crowdfunding-production-7caf...` は入れない。）

---

## 「Database connection error」・503 が出る場合

バックエンドは動いているが、登録やログインで **503** と「Database connection error」が出る場合、**DB 接続はできているがテーブルがまだない**可能性があります。

1. **バックエンドの Variables** で **`DATABASE_URL` または `DATABASE_URI`** が設定されているか確認する（前出の「データベース用の変数」を参照）。
2. **Railway の Postgres** に対して、**`database/init/01_init.sql`** を 1 回実行する。  
   - **Railway の画面上には SQL 実行画面はありません。** Postgres サービス → **「Connect」** を開き、表示される **psql コマンド** と **Connection URL** を使う。  
   - **ターミナル:** Connect の「Raw」の `psql` コマンドで接続し、`psql ... -d railway -f "Crowdfunding\database\init\01_init.sql"` のようにファイルを指定して実行。  
   - **GUI（DBeaver 等）:** Connection URL で接続し、クエリ画面に `01_init.sql` の内容を貼り付けて実行。  
   - 詳細は **`RAILWAY_DEPLOY.md`** の「Database connection error」の節を参照。
3. 実行後、再度登録を試す。

詳しい説明は **`RAILWAY_DEPLOY.md`** を参照してください。

---

## ローカル Docker で pgAdmin から接続する場合（Connection refused 対策）

**接続元**によって Host と Port が違います。どちらか一方だけ正しく設定してください。

### パターン A: ブラウザの pgAdmin（http://localhost:8082）を使っている場合

pgAdmin は **Docker コンテナ内**で動いています。ここから「localhost」でつなぐと、**pgAdmin 自身のコンテナ**に接続してしまい、Postgres には届きません。

| 項目 | 設定値 |
|------|--------|
| **Host name/address** | **`postgres`**（サービス名。`localhost` は不可） |
| **Port** | **`5432`**（コンテナ同士の内部ポート） |
| Maintenance database | `crowdfunding` |
| Username | `postgres` |
| Password | `password` |

### パターン B: Windows にインストールした pgAdmin / DBeaver を使っている場合

**ホストの PC** から接続するので、ホストに公開されているポートを使います。

| 項目 | 設定値 |
|------|--------|
| **Host name/address** | `localhost` |
| **Port** | **`5434`**（**5432 ではない**） |
| Maintenance database | `crowdfunding` |
| Username | `postgres` |
| Password | `password` |

### まだつながらないとき（ホストから 5434 を確認）

PowerShell で次を実行し、ポート 5434 が開いているか確認します。

```powershell
Test-NetConnection -ComputerName localhost -Port 5434
```

`TcpTestSucceeded : True` ならホストから 5434 は届いています。False の場合は、ファイアウォールや Docker Desktop の設定を確認してください。
