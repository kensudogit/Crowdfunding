# Railway デプロイ手順（Crowdfunding）

## 404 と CORS が両方出るとき（まずここを確認）

「登録で CORS エラー」「バックエンドに接続できません」が出る場合、**バックエンドがこのリポジトリの Express アプリとして動いていません**。以下を順に実行してください。

### ステップ 1: Root Directory の設定（必須）

1. Railway で **Crowdfunding-backend** サービスを開く。
2. **Settings** → **Source** または **Build** を開く。
3. **Root Directory** に **`backend`** を入力（未設定のままにしない）。
4. 保存する。

### ステップ 2: データベース変数の設定（必須）

1. **Crowdfunding-backend** の **Variables** を開く。
2. **`DATABASE_URL`** があるか確認。  
   - ない場合: Postgres サービスを「接続」するか、Postgres の **Variables** で接続 URL をコピーし、**`DATABASE_URL`** として追加。
   - または **`DB_HOST`**・**`DB_PORT`**・**`DB_NAME`**・**`DB_USER`**・**`DB_PASSWORD`** を設定（RAILWAY_DEPLOY の「バックエンドの Variables」参照）。

### ステップ 3: 再デプロイと動作確認

1. **Deployments** から **Redeploy** する（または変更を push して自動デプロイを待つ）。
2. デプロイ完了後、ブラウザで **`https://crowdfunding-backend-production.up.railway.app/`** を開く（自分のバックエンド URL に読み替えてください）。
3. **`{"message":"Crowdfunding API","version":"1.0.0","status":"running"}`** のような JSON が表示されれば、バックエンドは起動済みです。
4. その状態でフロントの **登録** を再度試す。CORS はバックエンドのコードで対応済みのため、上記のとおり動いていれば通ります。

**まだ CORS が出る場合:** 上記の URL で JSON が表示されていない（404/502/接続できない）なら、**Root Directory** と **DATABASE_URL**（または DB_*）を再度確認し、**View Logs** で起動エラーがないか確認してください。

### CORS がまだ出る場合の最終確認（ブラウザで証明する）

1. **バックエンドのルートを開く**  
   `https://crowdfunding-backend-production.up.railway.app/` を新しいタブで開く。
2. **表示を確認**
   - **JSON**（`{"message":"Crowdfunding API",...}`）がそのまま表示される → バックエンドは動いている。この状態なら CORS も返しているはずなので、ハードリロード（Ctrl+Shift+R）や別ブラウザで登録を再試行。
   - **「Not Found」や 404** → このドメインで動いているのは **Crowdfunding の Express ではない**。**Root Directory = `backend`** に設定して再デプロイ。
   - **502 Bad Gateway / 接続できない** → バックエンドが落ちている。**Variables** の **DATABASE_URL**（または DB_*）と **View Logs** の起動エラーを確認。
3. **DevTools でレスポンスヘッダーを確認（任意）**  
   上記のタブで F12 → **Network** → そのページのリクエストを選択 → **Headers** の **Response Headers** に **`Access-Control-Allow-Origin`** があれば、バックエンドは CORS を返しています。ない場合や 404/502 の場合は、上記 2 のとおり Root Directory と DB 設定を直してください。

---

## 構成

- **フロントエンド**: 1 サービス（Vite ビルド + nginx で静的配信）
- **バックエンド**: 1 サービス（Express API）
- **Postgres**: **Railway で DB サービスを 1 つ追加する必要があります**（下記手順参照）

### ローカル Docker と Railway の違い

| 環境 | DB の扱い |
|------|------------|
| **ローカル（docker-compose）** | Postgres が 1 コンテナとして同じ `docker-compose.yml` に含まれており、バックエンド・フロント・pgAdmin と一緒に起動する。 |
| **Railway** | DB は**別サービス**です。アプリ用のサービス（フロント・バックエンド）だけでは DB は動きません。**Postgres サービスをプロジェクトに追加**し、バックエンドの Variables で接続情報を設定する必要があります。 |

---

## Railway で DB サービス（Postgres）を作成する手順

Railway にデプロイする場合、**必ず Postgres を 1 サービスとして追加**してください。

1. **プロジェクトのダッシュボードを開く**  
   Crowdfunding 用の Railway プロジェクトを開く。

2. **「+ New」でサービスを追加**  
   画面上の **「+ New」** をクリックし、**「Database」** または **「Add Plugin」** から **「PostgreSQL」** を選択する。  
   （表示名は「Postgres」や「PostgreSQL」など。Railway の画面に応じて「Database」→「PostgreSQL」を選ぶ。）

3. **Postgres サービスが作成される**  
   作成されると、左のサービス一覧に **Postgres** が表示され、Variables に接続用の変数（`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` や `DATABASE_URL` など）が自動で入ります。

4. **バックエンドに接続情報を渡す**  
   - **方法 A（推奨）:** バックエンドのサービス画面で **「Variables」** を開き、**「Connect」** や **「Add Reference」** などで **Postgres を選択**すると、`DATABASE_URL` や `DATABASE_URI` が自動でバックエンドに追加されます。  
   - **方法 B:** Postgres の **Variables** または **Connect** で表示される接続 URL をコピーし、バックエンドの Variables に **`DATABASE_URL`** または **`DATABASE_URI`** として手動で追加する。

5. **テーブルの初期化**  
   Railway の Postgres は**空のデータベース**なので、**`database/init/01_init.sql` を 1 回実行**してテーブル（users, projects, pledges, comments）を作成する。手順は本ドキュメントの「Database connection error」の節および `TROUBLESHOOTING_RAILWAY.md` を参照。

以上で、Railway 上でも「DB サービス + バックエンド + フロント」の構成が揃います。

## Generate Domain（デフォルトドメイン）の手順

デフォルトの `*.up.railway.app` の URL を取得する流れです。

1. **対象のサービスを開く**  
   左のアーキテクチャ図で、ドメインを発行したいサービス（例: Crowdfunding やバックエンド）をクリックして選択する。

2. **Settings を開く**  
   上部タブの **Settings** をクリックする。

3. **Networking を開く**  
   Settings 内の **Networking**（または **Public Networking**）までスクロールする。

4. **デフォルトドメインの有無を確認する**  
   - **すでに `〇〇.up.railway.app` のような URL が表示されている場合**  
     → そのサービスにはすでにデフォルトドメインが付いています。その URL をコピーして使えばOKです（**+ Custom Domain** は押さない）。  
   - **何も表示されていない、または「Generate Domain」のようなボタンがある場合**  
     → そのボタンをクリックすると、Railway が自動で `https://＜サービス名＞-xxxx.up.railway.app` を発行します。

5. **URL をコピーする**  
   表示されているドメインの横のコピーアイコンで URL をコピーし、フロントの **Variables** の `API_URL` などに貼り付けて使う。

**注意:** **+ Custom Domain** は「自分で取得した独自ドメイン（例: example.com）」を追加するためのものです。`*.up.railway.app` の URL はここでは登録しません。

---

## 「カスタムドメイン」と「デフォルトドメイン」の違い

- **`*.up.railway.app`** … Railway が各サービスに自動で付ける **デフォルトの URL** です。  
  **「Add Custom Domain」には入力しません。** カスタムドメインは「自分で取得した独自ドメイン（例: `api.example.com`）」用です。  
  「Custom domain cannot end with up.railway.app」は、このデフォルトのドメインをカスタムドメイン欄に入れたために出るエラーです。

- **バックエンドの URL の取り方**
  1. プロジェクトで **バックエンド用のサービス** を開く（フロントエンドとは別サービス）。
  2. **Settings** → **Networking**（または **Public Networking**）の **「Generate Domain」**（または「ドメインを生成」）をクリックする。
  3. Railway が自動で `https://＜サービス名＞-xxxx.up.railway.app` のような URL を発行します。これがバックエンドの URL です。
  4. フロントエンドの Variables の **`API_URL`** に、この **バックエンド用サービスに表示されている URL** をそのまま貼る（`https://` から始まるもの）。  
  「Add Custom Domain」は使わず、上記の手順だけで大丈夫です。

## 405 Method Not Allowed になるとき（登録・ログインできない）

ログインや新規登録で「405」が出る場合は、**フロントの API 向き先がバックエンドになっていない**ことが原因です。

### よくある間違い（ここを直すと直ります）

- **`API_URL` にフロントの URL を入れている**  
  例: `API_URL = https://crowdfunding-production-7caf.up.railway.app`  
  → これは**フロント（今見ている画面のサービス）の URL**です。ここにすると API リクエストが同じ nginx に飛び、POST が 405 になります。

- **正しくは**  
  `API_URL` には**バックエンド用の「別サービス」の URL**を入れます。  
  例: バックエンド用サービスに付いた `https://crowdfunding-backend-xxxx.up.railway.app` のような URL。

- **バックエンド用のサービスがまだない場合**  
  今ある「Crowdfunding」はフロント用なので、**バックエンド用のサービスを新規追加**し、そこに `backend` フォルダをデプロイして、そのサービスのドメインを `API_URL` に設定する必要があります（下記「やること」参照）。

### やること

1. **バックエンドを Railway にデプロイ**
   - リポジトリの `backend` をデプロイするサービスにする（または backend 用のサービスを追加）。
   - Postgres を利用する場合は、Railway の Postgres を追加し、接続用の環境変数（`DATABASE_URL` など）をバックエンドの Variables に設定。
   - **Settings → Networking → Generate Domain** でバックエンドの公開 URL を取得（例: `https://crowdfunding-backend-xxxx.up.railway.app`）。

2. **フロントエンドの Variables に `API_URL` を設定（推奨）**
   - フロントエンドのサービス → **Variables** で追加:
     - 名前: `API_URL`
     - 値: バックエンドの URL（**末尾に `/api` は付けない**）
     - 例: `https://crowdfunding-backend-xxxx.up.railway.app`
   - コンテナ起動時に `config.json` へ書き込まれるため、**再ビルド不要**で反映されます。変更後は「再デプロイ」（コンテナの再起動）だけでOKです。

   - 代替: ビルド時に埋め込む場合は `VITE_API_URL` を同じ形式で設定し、フロントエンドを**再ビルド・再デプロイ**してください。

4. **バックエンドの CORS**
   - バックエンドの Variables に、フロントの本番 URL を設定:
     - 例: `FRONTEND_URL=https://あなたのフロントのドメイン.up.railway.app`

### 動作確認

- ブラウザの開発者ツールの **Network** で、登録・ログイン時の POST が**バックエンドの URL** に飛んでいるか確認する。
- 直接 `https://<バックエンドURL>/api/health` を開き、JSON が返るか確認する。

詳しくは `502_ERROR_FIX.md` の「405 Method Not Allowed」の節を参照してください。

---

## 設定チェックリスト（Variables でよくある誤り）

- **URL の typo**  
  `crowdfunding-production-?caf.up.railway.app` のように **`?` が入っている**とドメインとして不正です。正しくは **`7caf`** のように英数字だけにしてください。ただし `API_URL` は下記のとおり**バックエンドの URL** にすること。

- **`API_URL`（フロントエンドのサービスで設定）**  
  - ❌ フロントの URL: `https://crowdfunding-production-7caf.up.railway.app`  
  - ✅ **バックエンド**の URL: `https://crowdfunding-backend-xxxx.up.railway.app`（Crowdfunding-backend の Networking で表示されている URL をコピー）

- **`CORS_ORIGIN`**  
  - バックエンドのサービスで設定する場合: フロントのオリジン（例: `https://crowdfunding-production-7caf.up.railway.app`）を指定。URL に `?` などの誤字がないか確認。

- **`VITE_API_URL`**  
  - フロントでビルド時に使う場合は**バックエンドの URL**（末尾に `/api` を付けても可。コード側で正規化します）。フロントの URL にしないこと。

- **`FRONTEND_URI`**  
  - 値が `${VTTF_API_URI}` のままになっていると未定義になります。  
  - **フロントの公開 URL** を直接指定してください（例: `https://crowdfunding-production-7caf.up.railway.app`）。`VTTF_API_URI` は Railway の標準変数ではないため、別途変数を作るか、上記の URL をそのまま入力してください。

---

## バックエンド（Crowdfunding-backend）の Variables

バックエンドのコードが参照する環境変数に合わせて設定してください。

### 1. データベース接続（必須）

「Trying to connect a database? Add Variable」や、画面で「バックエンドに接続できません」・コンソールで **CORS エラー** が出る場合は、バックエンドが起動していないか DB 接続に失敗していることが多いです。まず DB 用の変数を設定してください。

バックエンドは次の **どちらか** で接続します。

- **`DATABASE_URL` または `DATABASE_URI` を使う（推奨）**  
  Railway で Postgres をバックエンドに「接続」すると、**`DATABASE_URL`** や **`DATABASE_URI`** が自動で入ることがあります。バックエンドのコードは **どちらの変数名にも対応**しています。Variables にいずれかが含まれていればOKです（追加で `DB_*` は不要）。  
  手動で入れる場合: Postgres の **Variables** または **Connect** で表示される接続文字列をコピーし、**`DATABASE_URL`** または **`DATABASE_URI`** として追加します。

- **「Database connection error」や 503 が出る・メッセージに「tables not initialized」と出る**  
  接続はできているが **テーブルがまだない**状態です。Railway の Postgres は空の DB なので、**初期 SQL（`database/init/01_init.sql`）を 1 回実行**する必要があります。  
  **Railway の画面上には SQL を実行するエディタはありません。** 次のいずれかで実行してください。

  **方法 A: ターミナルで psql を使う（推奨）**  
  1. Railway の **Postgres** サービス → **「Connect」** ボタンをクリック。  
  2. モーダル内の **「Public Network」** タブで、**「Raw」の `psql` コマンド**をコピー（例: `PGPASSWORD=***** psql -h gondola.proxy.rlwy.net -U postgres -p 46224 -d railway`）。  
  3. パスワードの **「show」** をクリックして表示し、`*****` の部分を実際のパスワードに置き換えたコマンドをメモ。  
  4. ローカルでターミナル（PowerShell や CMD）を開き、**プロジェクトのルート**（`Crowdfunding` があるフォルダ）に移動する。  
  5. 次のように実行する（パスワードとホストは Connect で表示された値に合わせる）:
     ```powershell
     $env:PGPASSWORD="ここにConnectで表示したパスワード"
     psql -h gondola.proxy.rlwy.net -U postgres -p 46224 -d railway -f "Crowdfunding\database\init\01_init.sql"
     ```
     （`psql` が入っていない場合は、PostgreSQL をインストールするか、方法 B を使う。）  
  6. エラーが出ずに終われば成功。フロントから再度登録を試す。

  **方法 B: GUI ツール（DBeaver / pgAdmin など）を使う**  
  1. **Connect** モーダルの **Connection URL** の **「show」** をクリックして URL をコピー。  
  2. DBeaver や pgAdmin で「新規接続」を作り、その URL（またはホスト・ポート・DB 名・ユーザー・パスワード）を入力して接続。  
  3. 「SQL を実行」や「クエリ」ウィンドウを開き、**`database/init/01_init.sql`** の内容をすべて貼り付けて実行。  
  4. 実行後、フロントから再度登録を試す。

- **`DB_HOST` など個別変数**  
  `DATABASE_URL` がない場合は、次を追加します:
  - `DB_HOST` … 例: `${Postgres.PGHOST}` または Postgres のホスト名
  - `DB_PORT` … 例: `${Postgres.PGPORT}` または `5432`
  - `DB_NAME` … 例: `${Postgres.PGDATABASE}` または `crowdfunding`
  - `DB_USER` … 例: `${Postgres.PGUSER}` または `postgres`
  - `DB_PASSWORD` … 例: `${Postgres.PGPASSWORD}` または Postgres のパスワード

**参照の仕方:** Postgres サービス → **Variables** または **Connect** で変数名を確認し、バックエンドの **「+ New Variable」** で上記を追加。必要に応じて `${Postgres.PGHOST}` のように参照します。

### 2. CORS（フロントからのアクセス許可）

バックエンドは **`FRONTEND_URL`** または **`CORS_ORIGIN`** がなくても、**`*.up.railway.app`** のオリジンは許可するようにしてあります。  
明示的に入れたい場合は、**フロントの公開 URL**（例: `https://crowdfunding-production-1caf.up.railway.app`）を **`FRONTEND_URL`** または **`CORS_ORIGIN`** に設定してください。

**補足:** ブラウザで「CORS policy: No 'Access-Control-Allow-Origin' header」と出る場合:

このメッセージは、**バックエンドが応答していない**ときにも出ます（502 やエラー応答には CORS ヘッダーが付かないため）。

1. **バックエンドの URL を直接開いて確認**  
   コンソールに表示されているバックエンドの URL をそのまま開く（例: `https://crowdfunding-backend-production.us.railway.app/api/health` や `...up.railway.app/api/health`）。
   - **`{"status":"healthy",...}` のような JSON が表示される** → バックエンドは起動している。最新コードで再デプロイすれば CORS は通る想定です。
   - **502 Bad Gateway / 接続できない / タイムアウト** → **バックエンドが起動していません。**
     - **Crowdfunding-backend** → **Variables**: `DATABASE_URL` または `DB_HOST`・`DB_PORT`・`DB_NAME`・`DB_USER`・`DB_PASSWORD` が正しく設定されているか確認。
     - **Crowdfunding-backend** → **Deployments** → 最新デプロイ → **View Logs**: 起動直後のエラーや DB 接続エラーが出ていないか確認。
2. 上記を直したうえで、**バックエンドを再デプロイ**（push で自動デプロイされる場合は push）。

---

## `/api/health` が 404 になる場合

「404 Not Found」が出る = **その URL にはサーバーが応答しているが、ルートが存在しない**状態です。Crowdfunding の Express バックエンドが動いていないか、別のアプリが動いている可能性があります。

**確認すること:**

1. **ルート URL を開く**  
   `https://crowdfunding-backend-production.us.railway.app/` （末尾の `/api/health` を外す）を開く。  
   - **`{"message":"Crowdfunding API","version":"1.0.0","status":"running"}` のような JSON** が出る → バックエンドは動いている。その場合は `/api/health` も同じホストなら動くはずなので、キャッシュや別サービスで見ていないか確認。  
   - **同じく 404** → このドメインで動いているのは **Crowdfunding の Node/Express バックエンドではない**可能性が高いです。

2. **Railway の「Crowdfunding-backend」の設定**  
   - **Settings** → **Build** または **Source**:  
     - **Root Directory** が **`backend`**（またはリポジトリ内のバックエンドフォルダのパス）になっているか確認。  
     - ルートのまま（空や `/`）だとリポジトリ直下がビルドされ、`backend/` の Express が動きません。  
   - **Settings** → **Deploy**: **Start Command** が **`npm start`**（＝ `node dist/app.js`）になっているか確認。  
   - **Dockerfile でビルドしている場合**: 使用する **Dockerfile が `backend` フォルダ内のもの**（例: `backend/Dockerfile.prod`）で、**コンテキストが `backend`** になっているか確認。

3. **修正後**  
   Root Directory を **`backend`** に変更し、**再デプロイ**する。デプロイ後、もう一度 `https://＜バックエンドのURL＞/` と `https://＜バックエンドのURL＞/api/health` を開いて JSON が返るか確認する。

### 3. その他

- **`JWT_SECRET`** … 本番用のランダムな文字列を設定する（未設定時はコード内のデフォルトになるが、本番では必ず設定すること）。
- **`NODE_ENV`** … 本番なら `production`。Railway が自動で設定している場合もあります。
- **`PORT`** … Railway が自動で設定するため、通常は追加不要です。
