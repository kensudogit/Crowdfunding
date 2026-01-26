# Crowdfunding 開発環境

## 概要
Node.js/Express + React + TypeScript + PostgreSQL を使用したDocker開発環境

## 必要なソフトウェア

### 1. Docker Desktop
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) をインストール
- Docker Composeが含まれています

### 2. エディタ
- [Visual Studio Code](https://code.visualstudio.com/) 推奨
- または [Cursor](https://cursor.sh/) 推奨

## 環境構築手順

### 1. 初回セットアップ
```bash
# バックエンドプロジェクトを初期化
cd backend
npm install

# フロントエンドプロジェクトを初期化
cd ../frontend
npm install
```

### 2. Docker環境の起動
```bash
# 開発環境を起動
start-dev.bat

# または手動で起動
docker-compose up -d
```

### 3. アクセス先
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:8081

### 4. 開発環境の管理
```bash
# ログを確認
logs.bat

# 開発環境を停止
stop-dev.bat

# または手動で停止
docker-compose down
```

## プロジェクト構造
```
Crowdfunding/
├── backend/                    # Node.js/Express API
│   ├── src/                   # ソースコード
│   │   ├── controllers/       # コントローラー
│   │   ├── models/            # データモデル
│   │   ├── routes/            # ルート定義
│   │   ├── middleware/        # ミドルウェア
│   │   ├── config/            # 設定ファイル
│   │   └── app.js             # アプリケーションエントリーポイント
│   ├── Dockerfile             # Node.js用Dockerfile
│   └── package.json           # Node.js依存関係
├── frontend/                  # React + Vite
│   ├── src/                   # ソースコード
│   │   ├── components/        # Reactコンポーネント
│   │   ├── pages/             # ページコンポーネント
│   │   ├── hooks/             # カスタムフック
│   │   ├── services/          # APIサービス
│   │   ├── types/             # TypeScript型定義
│   │   └── utils/             # ユーティリティ
│   ├── public/                # 静的ファイル
│   ├── Dockerfile             # Node.js用Dockerfile
│   └── package.json           # Node.js依存関係
├── database/                   # データベース関連
│   └── init/                  # 初期化SQL
├── docker-compose.yml          # Docker環境定義
├── start-dev.bat              # 開発環境起動スクリプト
├── stop-dev.bat               # 開発環境停止スクリプト
├── logs.bat                   # ログ確認スクリプト
└── README.md                  # このファイル
```

## 技術スタック

### バックエンド
- **Node.js**: 18+
- **フレームワーク**: Express.js
- **言語**: TypeScript
- **データベース**: PostgreSQL 15
- **ORM**: Prisma または Sequelize

### フロントエンド
- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイリング**: CSS3 / Tailwind CSS

### インフラ
- **コンテナ**: Docker + Docker Compose
- **ネットワーク**: カスタムブリッジネットワーク

## 開発の流れ

### 1. 初回セットアップ
```bash
# プロジェクトをクローン後
cd Crowdfunding

# バックエンドの依存関係をインストール
cd backend
npm install

# フロントエンドの依存関係をインストール
cd ../frontend
npm install

# 開発環境を起動
cd ..
start-dev.bat
```

### 2. 日常的な開発
```bash
# 開発環境起動
start-dev.bat

# コード編集（ホットリロード対応）

# ログ確認（必要に応じて）
logs.bat

# 開発終了時
stop-dev.bat
```

### 3. データベース操作
- pgAdmin: http://localhost:8081
  - メール: admin@example.com
  - パスワード: admin
- 直接接続: localhost:5432
- データベース名: crowdfunding
- ユーザー名: postgres
- パスワード: password

## トラブルシューティング

### よくある問題
1. **ポートが使用中**: 他のアプリケーションがポートを使用している可能性
2. **Dockerが起動していない**: Docker Desktopが起動しているか確認
3. **コンテナが起動しない**: `docker-compose logs` でログを確認

### ログの確認方法
```bash
# 全サービスのログ
docker-compose logs

# 特定サービスのログ
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# リアルタイムログ
docker-compose logs -f
```

## 実装済み機能

### 認証機能
- ✅ ユーザー登録（ユーザー名、メール、パスワード）
- ✅ ログイン/ログアウト
- ✅ JWT認証
- ✅ プロフィール管理

### プロジェクト機能
- ✅ プロジェクト一覧表示（ページネーション対応）
- ✅ プロジェクト詳細表示
- ✅ プロジェクト作成（タイトル、説明、目標金額、カテゴリー、終了日）
- ✅ プロジェクト編集・削除（作成者のみ）
- ✅ マイプロジェクト一覧

### 支援機能
- ✅ プロジェクトへの支援（金額指定）
- ✅ 支援履歴表示
- ✅ マイ支援一覧
- ✅ 支援総額の自動計算

### コメント機能
- ✅ プロジェクトへのコメント投稿
- ✅ コメント一覧表示
- ✅ コメント編集・削除（投稿者のみ）

### UI/UX
- ✅ レスポンシブデザイン
- ✅ モダンなUI
- ✅ 進捗バー表示
- ✅ エラーハンドリング
- ✅ ローディング状態表示

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/profile` - プロフィール取得

### プロジェクト
- `GET /api/projects` - プロジェクト一覧
- `GET /api/projects/:id` - プロジェクト詳細
- `GET /api/projects/my` - マイプロジェクト一覧
- `POST /api/projects` - プロジェクト作成
- `PUT /api/projects/:id` - プロジェクト更新
- `DELETE /api/projects/:id` - プロジェクト削除

### 支援
- `POST /api/pledges/project/:projectId` - 支援作成
- `GET /api/pledges/project/:projectId` - プロジェクトの支援一覧
- `GET /api/pledges/my` - マイ支援一覧

### コメント
- `GET /api/comments/project/:projectId` - プロジェクトのコメント一覧
- `POST /api/comments/project/:projectId` - コメント作成
- `PUT /api/comments/:commentId` - コメント更新
- `DELETE /api/comments/:commentId` - コメント削除

## サンプルデータのセットアップ

### 画面にデータが表示されない場合

データベースにサンプルデータが登録されていない可能性があります。以下の方法で解決できます：

#### 方法1: 管理画面から生成（推奨・最も簡単）

1. アプリケーションにログイン（任意のアカウントでOK）
2. ヘッダーの「管理画面」をクリック
3. 「サンプルデータを生成」ボタンをクリック
4. 生成完了後、プロジェクト一覧ページをリロード

#### 方法2: 確認・投入スクリプトを使用

```bash
# データベースの状態を確認
check-db.bat

# サンプルデータを投入
init-sample-data.bat

# データベースをリセットしてサンプルデータを投入（既存データを削除）
reset-db.bat
```

#### 方法3: APIから直接生成

```bash
curl -X POST http://localhost:8000/api/sample-data/generate
```

詳細は `README_DATA_SETUP.md` を参照してください。

## Railwayへのデプロイ

本アプリケーションをRailwayに完全公開モードでデプロイできます。

### クイックスタート
詳細な手順は `RAILWAY_QUICK_START.md` を参照してください。

### デプロイ手順
1. Railwayアカウントを作成
2. PostgreSQLデータベースを追加
3. バックエンドサービスをデプロイ（`backend/Dockerfile.prod`を使用）
4. フロントエンドサービスをデプロイ（`frontend/Dockerfile.prod`を使用）
5. 環境変数を設定（`.env.example.railway`を参照）
6. データベースを初期化

詳細は `RAILWAY_DEPLOY.md` を参照してください。

## トラブルシューティング

### バックエンドサーバーが応答しない場合

`ERR_EMPTY_RESPONSE` エラーが発生する場合：

1. **Docker Desktopが起動しているか確認**
2. **バックエンドコンテナの状態を確認**:
   ```bash
   check-backend.bat
   ```
3. **バックエンドを再起動**:
   ```bash
   restart-backend.bat
   ```
   または
   ```bash
   docker-compose restart backend
   ```
4. **ログを確認**:
   ```bash
   docker-compose logs backend
   ```

詳細は `TROUBLESHOOTING.md` を参照してください。

## 注意事項
- Docker Desktopが起動している必要があります（ローカル開発時）
- 初回起動時はイメージのダウンロードに時間がかかります
- ポート3000, 8000, 5432, 8081が使用可能である必要があります（ローカル開発時）
- 開発環境用の設定のため、本番環境では適切な設定に変更してください
- バックエンドの`.env`ファイルを作成する必要があります（`.env.example`を参考に）
- サンプルデータは自動的には投入されません。上記の方法で投入してください
- Railwayデプロイ時は、`Dockerfile.prod`を使用してください
#   C r o w d f u n d i n g 
 
 