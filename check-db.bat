@echo off
echo ========================================
echo データベースの状態を確認します
echo ========================================
echo.

echo データベースコンテナの状態を確認中...
docker ps | findstr crowdfunding_postgres >nul
if %ERRORLEVEL% NEQ 0 (
    echo エラー: データベースコンテナが起動していません
    pause
    exit /b 1
)

echo.
echo ユーザー数を確認中...
docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as user_count FROM users;"

echo.
echo プロジェクト数を確認中...
docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as project_count FROM projects;"

echo.
echo 支援数を確認中...
docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as pledge_count FROM pledges;"

echo.
echo コメント数を確認中...
docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as comment_count FROM comments;"

echo.
echo ========================================
echo 確認完了
echo ========================================
echo.
echo データが0件の場合は、以下のいずれかを実行してください:
echo 1. init-sample-data.bat - サンプルデータを投入
echo 2. reset-db.bat - データベースをリセットしてサンプルデータを投入
echo 3. 管理画面からサンプルデータを生成
echo.
pause
