FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ポート8000を公開
EXPOSE 8000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
