@echo off
REM サンプルデータSQLを直接実行するスクリプト
echo ========================================
echo サンプルデータSQLを実行します
echo ========================================
echo.

REM スクリプトのディレクトリに移動
cd /d "%~dp0"

REM データベースコンテナの状態を確認
echo データベースコンテナの状態を確認中...
docker ps | findstr crowdfunding_postgres >nul
if %ERRORLEVEL% NEQ 0 (
    echo エラー: データベースコンテナが起動していません
    echo 先に start-dev.bat を実行してください
    pause
    exit /b 1
)

REM データベーススキーマが存在するか確認
echo.
echo データベーススキーマを確認中...
docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "\dt" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 警告: データベーススキーマが存在しない可能性があります
    echo 先に database\init\01_init.sql を実行してください
    echo.
    set /p continue="続行しますか？ (y/N): "
    if /i not "!continue!"=="y" (
        echo キャンセルしました。
        pause
        exit /b
    )
)

REM SQLファイルを実行
echo.
echo サンプルデータSQLファイルを実行中...
echo ファイル: database\init\02_sample_data.sql
echo.

REM typeコマンドでファイルを読み込んでパイプで渡す（Windowsで確実に動作）
type database\init\02_sample_data.sql | docker exec -i crowdfunding_postgres psql -U postgres -d crowdfunding

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo サンプルデータの投入が完了しました！
    echo ========================================
    echo.
    echo データを確認中...
    docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as user_count FROM users;"
    docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as project_count FROM projects;"
    docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as pledge_count FROM pledges;"
    docker exec crowdfunding_postgres psql -U postgres -d crowdfunding -c "SELECT COUNT(*) as comment_count FROM comments;"
    echo.
) else (
    echo.
    echo エラーが発生しました。
    echo.
    echo 考えられる原因:
    echo 1. データベーススキーマが初期化されていない
    echo    解決方法: database\init\01_init.sql を先に実行してください
    echo 2. 既にデータが存在して重複エラーが発生
    echo    解決方法: reset-db.bat を実行してデータベースをリセットしてください
    echo 3. データベースコンテナが正常に動作していない
    echo    解決方法: docker-compose restart postgres を実行してください
    echo.
)

pause
