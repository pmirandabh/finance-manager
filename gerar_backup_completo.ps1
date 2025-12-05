# Script de Backup COMPLETO do Saldo+
# Cria um arquivo .zip com TUDO (incluindo node_modules, builds, etc).
# ATENÇÃO: O arquivo ficará grande (pode passar de 500MB).

$ErrorActionPreference = "Stop"

# Configurações
$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupName = "Backup_COMPLETO_SaldoPlus_v1.0_$date"
$sourceDir = Get-Location
$zipFile = Join-Path $sourceDir "$backupName.zip"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BACKUP COMPLETO (TUDO INCLUSO)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "AVISO: Este backup vai incluir a pasta node_modules." -ForegroundColor Yellow
Write-Host "O arquivo final sera grande e pode demorar um pouco." -ForegroundColor Yellow
Write-Host ""

# Lista de exclusões (apenas o próprio zip e pastas temporárias de backup)
$exclude = @("*.zip", "temp_backup_*", ".git")

# Compactar
Write-Host "[1/1] Compactando TODOS os arquivos..." -ForegroundColor Green
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Gray

Compress-Archive -Path "$sourceDir\*" -DestinationPath $zipFile -Force -CompressionLevel Optimal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   BACKUP COMPLETO CONCLUIDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo criado: $zipFile" -ForegroundColor White
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
