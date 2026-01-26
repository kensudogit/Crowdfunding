# Crowdfunding 開発環境を停止するPowerShellスクリプト

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Crowdfunding 開発環境を停止しています..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Docker Composeでサービスを停止中..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "サービス停止完了！" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "エラー: サービスの停止に失敗しました" -ForegroundColor Red
    Write-Host ""
}
