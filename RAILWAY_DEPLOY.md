# Railway デプロイ手順（Crowdfunding）

## 構成

- **フロントエンド**: 1 サービス（Vite ビルド + nginx で静的配信）
- **バックエンド**: 1 サービス（Express API）
- **Postgres**: Railway の Postgres を追加するか、別サービスで利用

## 405 Method Not Allowed になるとき（登録・ログインできない）

ログインや新規登録で「405」が出る場合は、**フロントの API 向き先がバックエンドになっていない**ことが原因です。

### やること

1. **バックエンドを Railway にデプロイ**
   - リポジトリの `backend` をデプロイするサービスにする（または backend 用のサービスを追加）。
   - Postgres を利用する場合は、Railway の Postgres を追加し、接続用の環境変数（`DATABASE_URL` など）をバックエンドの Variables に設定。
   - **Settings → Networking → Generate Domain** でバックエンドの公開 URL を取得（例: `https://crowdfunding-backend-xxxx.up.railway.app`）。

2. **フロントエンドの Variables に `VITE_API_URL` を設定**
   - フロントエンドのサービス → **Variables** で追加:
     - 名前: `VITE_API_URL`
     - 値: バックエンドの URL（**末尾に `/api` は付けない**）
     - 例: `https://crowdfunding-backend-xxxx.up.railway.app`

3. **フロントエンドを再デプロイ**
   - `VITE_API_URL` はビルド時に埋め込まれるため、変数を追加・変更したあとは**再デプロイ（再ビルド）**が必要です。

4. **バックエンドの CORS**
   - バックエンドの Variables に、フロントの本番 URL を設定:
     - 例: `FRONTEND_URL=https://あなたのフロントのドメイン.up.railway.app`

### 動作確認

- ブラウザの開発者ツールの **Network** で、登録・ログイン時の POST が**バックエンドの URL** に飛んでいるか確認する。
- 直接 `https://<バックエンドURL>/api/health` を開き、JSON が返るか確認する。

詳しくは `502_ERROR_FIX.md` の「405 Method Not Allowed」の節を参照してください。
