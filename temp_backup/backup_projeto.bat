@echo off
echo ========================================
echo   BACKUP DO PROJETO SALDO+ v1.0
echo ========================================
echo.
echo Este script vai criar um arquivo ZIP com todo o codigo-fonte.
echo As pastas pesadas (node_modules, builds) serao ignoradas para economizar espaco.
echo.

set DATA_ATUAL=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%
set NOME_BACKUP=Backup_Saldo+_v1.0_Fontes_%DATA_ATUAL%
set PASTA_TEMP=temp_backup_saldo+

echo [1/4] Criando pasta temporaria...
if exist "%PASTA_TEMP%" rmdir /s /q "%PASTA_TEMP%"
mkdir "%PASTA_TEMP%"

echo [2/4] Copiando arquivos do projeto...
xcopy "src" "%PASTA_TEMP%\src" /E /I /Y >nul
xcopy "electron" "%PASTA_TEMP%\electron" /E /I /Y >nul
xcopy "public" "%PASTA_TEMP%\public" /E /I /Y >nul
copy "package.json" "%PASTA_TEMP%\" >nul
copy "package-lock.json" "%PASTA_TEMP%\" >nul
copy "vite.config.js" "%PASTA_TEMP%\" >nul
copy "index.html" "%PASTA_TEMP%\" >nul
copy "*.bat" "%PASTA_TEMP%\" >nul
copy "*.md" "%PASTA_TEMP%\" >nul
copy "eslint.config.js" "%PASTA_TEMP%\" >nul 2>nul
copy ".gitignore" "%PASTA_TEMP%\" >nul 2>nul

echo [3/4] Compactando arquivos (ZIP)...
powershell -Command "Compress-Archive -Path '%PASTA_TEMP%\*' -DestinationPath '%NOME_BACKUP%.zip' -Force"

echo [4/4] Limpando arquivos temporarios...
rmdir /s /q "%PASTA_TEMP%"

echo.
echo ========================================
echo   BACKUP CONCLUIDO!
echo ========================================
echo.
echo Arquivo criado: %NOME_BACKUP%.zip
echo.
echo COMO GUARDAR:
echo 1. Pegue este arquivo .zip
echo 2. Salve no Google Drive, OneDrive ou envie por email para voce mesmo.
echo.
echo COMO RESTAURAR (Daqui a 1 mes):
echo 1. Extraia o arquivo .zip
echo 2. Abra a pasta no terminal
echo 3. Execute 'npm install' para baixar as dependencias
echo 4. Execute 'npm run dev' para voltar a programar
echo.
pause
