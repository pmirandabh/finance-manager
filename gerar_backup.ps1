# Script de Backup do Saldo+
# Cria um arquivo .zip com o código-fonte, excluindo node_modules e outros arquivos pesados.

$ErrorActionPreference = "Stop"

# Configurações
$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupName = "Backup_SaldoPlus_v1.0_$date"
$sourceDir = Get-Location
$tempDir = Join-Path $sourceDir "temp_backup_$date"
$zipFile = Join-Path $sourceDir "$backupName.zip"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BACKUP DO PROJETO SALDO+ v1.0" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Criar pasta temporária
Write-Host "[1/4] Criando pasta temporaria..." -ForegroundColor Yellow
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 2. Copiar arquivos
Write-Host "[2/4] Copiando arquivos do projeto..." -ForegroundColor Yellow

# Lista de pastas e arquivos para incluir
$includeList = @("src", "electron", "public", "package.json", "package-lock.json", "vite.config.js", "index.html", "*.md", "*.bat", ".gitignore", "eslint.config.js")

foreach ($item in $includeList) {
    Copy-Item -Path $item -Destination $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

# 3. Compactar
Write-Host "[3/4] Compactando arquivos (ZIP)..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -Force

# 4. Limpeza
Write-Host "[4/4] Limpando arquivos temporarios..." -ForegroundColor Yellow
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   BACKUP CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo criado: $zipFile" -ForegroundColor White
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
