@echo off
echo ========================================
echo データベースをリセットしてサンプルデータを投入します
echo ========================================
echo.
echo 警告: この操作は既存のデータベースを削除します
echo.
set /p confirm="続行しますか？ (y/N): "
if /i not "%confirm%"=="y" (
    echo キャンセルしました。
    pause
    exit /b
)

echo.
echo データベースコンテナを停止中...
docker-compose down

echo.
echo データベースボリュームを削除中...
for /f "tokens=*" %%i in ('docker volume ls -q ^| findstr crowdfunding') do docker volume rm %%i 2>nul

echo.
echo データベースを再起動中...
docker-compose up -d postgres

echo.
echo データベースの起動を待機中（30秒）...
timeout /t 30 /nobreak > nul

echo.
echo サンプルデータSQLファイルをデータベースに投入中...
docker exec -i crowdfunding_postgres psql -U postgres -d crowdfunding < database\init\02_sample_data.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo データベースのリセットとサンプルデータの投入が完了しました！
    echo ========================================
    echo.
    echo 以下のデータが追加されました:
    echo - 8人のユーザー
    echo - 10個のプロジェクト
    echo - 50件以上の支援
    echo - 複数のコメント
    echo.
    echo すべてのサービスを起動してください:
    echo   start-dev.bat
    echo.
) else (
    echo.
    echo エラーが発生しました。
    echo.
)

pause
