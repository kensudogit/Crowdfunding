#!/bin/bash
# Railway デプロイ用セットアップスクリプト

echo "=========================================="
echo "Railway デプロイセットアップ"
echo "=========================================="
echo ""

# JWT_SECRETの生成
echo "JWT_SECRETを生成中..."
JWT_SECRET=$(openssl rand -base64 32)
echo "生成されたJWT_SECRET: $JWT_SECRET"
echo ""
echo "この値をRailwayのバックエンド環境変数 'JWT_SECRET' に設定してください。"
echo ""

# 確認
read -p "続行しますか？ (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

echo ""
echo "=========================================="
echo "次のステップ:"
echo "=========================================="
echo "1. Railwayダッシュボードにログイン"
echo "2. 新しいプロジェクトを作成"
echo "3. PostgreSQLデータベースを追加"
echo "4. バックエンドサービスを追加（GitHubリポジトリから）"
echo "   - Root Directory: backend"
echo "   - Dockerfile Path: Dockerfile.prod"
echo "5. フロントエンドサービスを追加（GitHubリポジトリから）"
echo "   - Root Directory: frontend"
echo "   - Dockerfile Path: Dockerfile.prod"
echo "6. 環境変数を設定（.env.example.railwayを参照）"
echo "7. デプロイを開始"
echo ""
echo "詳細は RAILWAY_DEPLOY.md を参照してください。"
echo "=========================================="
