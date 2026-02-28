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

詳しい説明は **`RAILWAY_DEPLOY.md`** を参照してください。
