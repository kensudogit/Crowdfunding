# Railway デプロイ手順（Crowdfunding）

## 構成

- **フロントエンド**: 1 サービス（Vite ビルド + nginx で静的配信）
- **バックエンド**: 1 サービス（Express API）
- **Postgres**: Railway の Postgres を追加するか、別サービスで利用

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

- **`DATABASE_URL` を使う（推奨）**  
  Railway で Postgres をバックエンドに「接続」すると、**`DATABASE_URL`** が自動で入ることがあります。その場合は **Variables に `DATABASE_URL` が含まれているか** を確認するだけでOKです（追加で `DB_*` は不要）。  
  手動で入れる場合: Postgres の **Variables** または **Connect** で表示される接続文字列をコピーし、バックエンドの Variables に **`DATABASE_URL`** として追加します。

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

### 3. その他

- **`JWT_SECRET`** … 本番用のランダムな文字列を設定する（未設定時はコード内のデフォルトになるが、本番では必ず設定すること）。
- **`NODE_ENV`** … 本番なら `production`。Railway が自動で設定している場合もあります。
- **`PORT`** … Railway が自動で設定するため、通常は追加不要です。
