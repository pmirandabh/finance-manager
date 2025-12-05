@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   Finance Manager - $aldo+
echo   Iniciando Sistema...
echo ========================================
echo.
echo [INFO] Abrindo navegador...
start http://localhost:5173
echo.
echo [INFO] Iniciando servidor de desenvolvimento...
echo.
npm run dev
