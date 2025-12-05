@echo off
cd /d "C:\Users\paulo.miranda_acesso\.gemini\antigravity\scratch\finance-manager"

if not exist "dist\index.html" (
    call npm run build
)

start "" npx electron .
exit
