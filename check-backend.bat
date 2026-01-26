@echo off
echo ========================================
echo バックエンドサーバーの状態を確認します
echo ========================================
echo.

echo バックエンドコンテナの状態を確認中...
docker ps | findstr crowdfunding_backend >nul
if %ERRORLEVEL% NEQ 0 (
    echo エラー: バックエンドコンテナが起動していません
    echo.
    echo コンテナを起動してください:
    echo docker-compose up -d backend
    pause
    exit /b 1
)

echo バックエンドコンテナは起動しています
echo.

echo バックエンドのログを確認中...
echo ----------------------------------------
docker logs --tail 50 crowdfunding_backend
echo ----------------------------------------
echo.

echo バックエンドサーバーへの接続テスト...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/health' -UseBasicParsing -TimeoutSec 5; Write-Host '✓ バックエンドサーバーは応答しています'; Write-Host '  ステータス:' $response.StatusCode } catch { Write-Host '✗ バックエンドサーバーが応答していません'; Write-Host '  エラー:' $_.Exception.Message }"

echo.
echo ========================================
echo 確認完了
echo ========================================
pause
