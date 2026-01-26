@echo off
echo ========================================
echo サンプルデータをデータベースに投入します
echo ========================================
echo.

echo データベースコンテナの状態を確認中...
docker ps | findstr crowdfunding_postgres >nul
if %ERRORLEVEL% NEQ 0 (
    echo エラー: データベースコンテナが起動していません
    echo 先に start-dev.bat を実行してください
    pause
    exit /b 1
)

echo.
echo サンプルデータSQLファイルをデータベースに投入中...
REM 絶対パスを使用して確実に実行
cd /d "%~dp0"
type database\init\02_sample_data.sql | docker exec -i crowdfunding_postgres psql -U postgres -d crowdfunding

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo サンプルデータの投入が完了しました！
    echo ========================================
    echo.
    echo 以下のデータが追加されました:
    echo - 8人のユーザー
    echo - 10個のプロジェクト
    echo - 50件以上の支援
    echo - 複数のコメント
    echo.
    echo ブラウザで http://localhost:3000 にアクセスして確認してください
    echo.
) else (
    echo.
    echo エラーが発生しました。
    echo データベースが既に初期化されている場合は、管理画面からサンプルデータを生成してください
    echo.
)

pause
