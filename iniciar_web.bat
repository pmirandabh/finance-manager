@echo off
echo ==========================================
echo   Iniciando Servidor Web
echo ==========================================
echo.

cd /d "%~dp0"

echo Iniciando servidor na porta 5173...
echo.
echo IMPORTANTE: 
echo - NAO FECHE ESTA JANELA!
echo - Abra seu navegador em: http://localhost:5173
echo.
echo Aguarde a mensagem "ready"...
echo.

start http://localhost:5173

npm run dev

echo.
echo Servidor encerrado.
pause
