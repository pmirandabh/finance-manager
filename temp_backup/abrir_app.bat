@echo off
cd /d "C:\Users\paulo.miranda_acesso\.gemini\antigravity\scratch\finance-manager"

REM Verifica se o build existe
if not exist "dist\index.html" (
    echo Construindo a aplicacao...
    call npm run build
)

REM Abre a aplicacao em segundo plano e fecha este terminal
start "" npx electron .
exit
