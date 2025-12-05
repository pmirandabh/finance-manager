@echo off

REM =============================================
REM GERENCIADOR DE FINANÇAS - EXECUÇÃO COMPLETA
REM =============================================

REM ======= DEFINIR DIRETÓRIO DO PROJETO =======
cd /d "C:\Users\paulo.miranda_acesso\.gemini\antigravity\scratch\finance-manager"

echo ========================================================
echo      Iniciando Gerenciador de Finanças (Modo Completo)
echo ========================================================
echo.

REM ======= 1. Iniciar servidor Vite =======
echo 1. Iniciando servidor Vite...
start "Servidor Vite" cmd /k "npm run dev"

REM ======= 2. Aguardar Vite iniciar =======
echo.
echo 2. Aguardando o servidor iniciar (5 segundos)...
timeout /t 5 > nul

REM ======= 3. Iniciar Electron =======
echo.
echo 3. Iniciando o Electron...
set NODE_ENV=development
call npx electron .

echo.
echo ========================================================
echo   Se o aplicativo fechar, verifique a janela do Servidor
echo ========================================================
pause


