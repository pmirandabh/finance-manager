@echo off
echo ========================================
echo   Saldo+ v1.0 - Gerador de Executavel
echo ========================================
echo.

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo [ERRO] node_modules nao encontrado!
    echo Execute: npm install
    pause
    exit /b 1
)

echo [1/4] Limpando builds anteriores...
if exist "dist\" rmdir /s /q "dist"
if exist "dist-electron\" rmdir /s /q "dist-electron"
if exist "release\" rmdir /s /q "release"

echo [2/4] Executando build de producao...
call npm run build
if errorlevel 1 (
    echo [ERRO] Build falhou!
    pause
    exit /b 1
)

echo [3/4] Gerando executavel com Electron Builder...
call npm run build:win
if errorlevel 1 (
    echo [ERRO] Geracao do executavel falhou!
    pause
    exit /b 1
)

echo [4/4] Criando pacote de distribuicao...

REM Criar pasta de distribuicao
if not exist "distribuicao\" mkdir "distribuicao"

REM Copiar executavel
if exist "release\*.exe" (
    copy "release\*.exe" "distribuicao\"
) else if exist "dist-electron\*.exe" (
    copy "dist-electron\*.exe" "distribuicao\"
) else (
    echo [AVISO] Executavel nao encontrado em release\ ou dist-electron\
)

REM Copiar manuais
copy "MANUAL_INSTALACAO.md" "distribuicao\" 2>nul
copy "MANUAL_USO.md" "distribuicao\" 2>nul
copy "DOCUMENTACAO.md" "distribuicao\" 2>nul

REM Criar README para distribuicao
echo # Saldo+ v1.0 > "distribuicao\LEIA-ME.txt"
echo. >> "distribuicao\LEIA-ME.txt"
echo Conteudo deste pacote: >> "distribuicao\LEIA-ME.txt"
echo. >> "distribuicao\LEIA-ME.txt"
echo 1. Saldo+ v1.0 Setup.exe - Instalador do aplicativo >> "distribuicao\LEIA-ME.txt"
echo 2. MANUAL_INSTALACAO.md - Como instalar >> "distribuicao\LEIA-ME.txt"
echo 3. MANUAL_USO.md - Como usar o aplicativo >> "distribuicao\LEIA-ME.txt"
echo 4. DOCUMENTACAO.md - Documentacao tecnica >> "distribuicao\LEIA-ME.txt"
echo. >> "distribuicao\LEIA-ME.txt"
echo Instrucoes: >> "distribuicao\LEIA-ME.txt"
echo 1. Execute o instalador (.exe) >> "distribuicao\LEIA-ME.txt"
echo 2. Siga as instrucoes do MANUAL_INSTALACAO.md >> "distribuicao\LEIA-ME.txt"
echo 3. Consulte o MANUAL_USO.md para aprender a usar >> "distribuicao\LEIA-ME.txt"
echo. >> "distribuicao\LEIA-ME.txt"
echo Desenvolvido por Paulo Miranda >> "distribuicao\LEIA-ME.txt"
echo Versao: 1.0 >> "distribuicao\LEIA-ME.txt"
echo Data: Novembro 2025 >> "distribuicao\LEIA-ME.txt"

REM Criar ZIP (se 7-Zip estiver instalado)
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo Criando arquivo ZIP...
    cd distribuicao
    7z a -tzip "Saldo-Plus-v1.0-Completo.zip" *
    cd ..
    echo ZIP criado: distribuicao\Saldo-Plus-v1.0-Completo.zip
) else (
    echo.
    echo [AVISO] 7-Zip nao encontrado. ZIP nao foi criado.
    echo Instale 7-Zip ou crie o ZIP manualmente da pasta 'distribuicao'
)

echo.
echo ========================================
echo   CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Arquivos gerados em: distribuicao\
echo.
echo Conteudo:
dir /b "distribuicao\"
echo.
echo Pronto para distribuir!
echo.
pause
