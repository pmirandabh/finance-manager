@echo off
cd /d "C:\Users\paulo.miranda_acesso\.gemini\antigravity\scratch\finance-manager"

if not exist "dist\index.html" (
    echo Construindo...
    call npm run build
)

REM Inicia e fecha o CMD
start "" npx electron .
exit
