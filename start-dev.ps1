# Crowdfunding 開発環境を起動するPowerShellスクリプト

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Crowdfunding 開発環境を起動しています..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Docker Composeでサービスを起動中..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "サービス起動完了！" -ForegroundColor Green
    Write-Host ""
    Write-Host "アクセス先:" -ForegroundColor Cyan
    Write-Host "- フロントエンド: http://localhost:3000" -ForegroundColor White
    Write-Host "- バックエンドAPI: http://localhost:8000" -ForegroundColor White
    Write-Host "- PostgreSQL: localhost:5432" -ForegroundColor White
    Write-Host "- pgAdmin: http://localhost:8081" -ForegroundColor White
    Write-Host ""
    Write-Host "ログを確認するには: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "サービスを停止するには: docker-compose down" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "エラー: サービスの起動に失敗しました" -ForegroundColor Red
    Write-Host "Docker Desktopが起動しているか確認してください" -ForegroundColor Yellow
    Write-Host ""
}
