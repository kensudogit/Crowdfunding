@echo off
echo ========================================
echo バックエンドサーバーを再起動します
echo ========================================
echo.

echo Dockerコンテナの状態を確認中...
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo エラー: Dockerが起動していないか、アクセスできません
    echo Docker Desktopが起動しているか確認してください
    pause
    exit /b 1
)

echo.
echo バックエンドコンテナを再起動中...
docker-compose restart backend

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ バックエンドコンテナを再起動しました
    echo.
    echo 5秒待ってからログを表示します...
    timeout /t 5 /nobreak >nul
    echo.
    echo ========================================
    echo バックエンドのログ（最新20行）
    echo ========================================
    docker logs --tail 20 crowdfunding_backend
    echo.
    echo ========================================
    echo ログの確認が完了しました
    echo ========================================
) else (
    echo.
    echo ✗ バックエンドコンテナの再起動に失敗しました
    echo.
    echo コンテナを再ビルドして起動しますか？ (Y/N)
    set /p rebuild="> "
    if /i "%rebuild%"=="Y" (
        echo.
        echo コンテナを再ビルド中...
        docker-compose build backend
        docker-compose up -d backend
        echo.
        echo 5秒待ってからログを表示します...
        timeout /t 5 /nobreak >nul
        docker logs --tail 20 crowdfunding_backend
    )
)

echo.
pause
