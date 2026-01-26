# Crowdfunding 開発環境のログを表示するPowerShellスクリプト

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Crowdfunding 開発環境のログを表示します" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ctrl+C でログ表示を終了します" -ForegroundColor Yellow
Write-Host ""

docker-compose logs -f
