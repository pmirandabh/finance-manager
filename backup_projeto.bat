@echo off
chcp 65001 >nul
echo ========================================
echo   BACKUP COMPLETO DO PROJETO
echo   Finance Manager - $aldo+
echo ========================================
echo.

:: Obter data e hora para nome do backup
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set BACKUP_DATE=%datetime:~0,8%
set BACKUP_TIME=%datetime:~8,6%
set BACKUP_NAME=finance-manager-backup-%BACKUP_DATE%-%BACKUP_TIME%

:: Definir pasta de destino (Desktop do usuário)
set BACKUP_DIR=%USERPROFILE%\Desktop\Backups-FinanceManager
set BACKUP_PATH=%BACKUP_DIR%\%BACKUP_NAME%

echo [INFO] Criando pasta de backup...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%BACKUP_PATH%"

echo [INFO] Copiando arquivos do projeto...
echo.

:: Copiar código fonte
echo [1/7] Copiando código fonte (src)...
xcopy /E /I /Y "src" "%BACKUP_PATH%\src" >nul

:: Copiar arquivos públicos
echo [2/7] Copiando arquivos públicos (public)...
xcopy /E /I /Y "public" "%BACKUP_PATH%\public" >nul

:: Copiar migrações do Supabase
echo [3/7] Copiando migrações do banco (supabase)...
xcopy /E /I /Y "supabase" "%BACKUP_PATH%\supabase" >nul

:: Copiar arquivos de configuração
echo [4/7] Copiando arquivos de configuração...
copy /Y "package.json" "%BACKUP_PATH%\" >nul
copy /Y "package-lock.json" "%BACKUP_PATH%\" >nul
copy /Y "vite.config.js" "%BACKUP_PATH%\" >nul
copy /Y "index.html" "%BACKUP_PATH%\" >nul
copy /Y ".gitignore" "%BACKUP_PATH%\" >nul

:: Copiar documentação
echo [5/7] Copiando documentação...
copy /Y "*.md" "%BACKUP_PATH%\" >nul 2>nul

:: Copiar scripts .bat
echo [6/7] Copiando scripts de automação...
copy /Y "*.bat" "%BACKUP_PATH%\" >nul 2>nul

:: Copiar .env (IMPORTANTE: contém chaves do Supabase)
echo [7/7] Copiando variáveis de ambiente (.env)...
if exist ".env" (
    copy /Y ".env" "%BACKUP_PATH%\" >nul
    echo [OK] Arquivo .env copiado (MANTENHA SEGURO!)
) else (
    echo [AVISO] Arquivo .env não encontrado!
)

echo.
echo ========================================
echo   BACKUP CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Local do backup:
echo %BACKUP_PATH%
echo.
echo Tamanho do backup:
for /f "tokens=3" %%a in ('dir /s "%BACKUP_PATH%" ^| find "File(s)"') do set SIZE=%%a
echo %SIZE% bytes
echo.

:: Criar arquivo de informações do backup
echo Backup criado em: %date% %time% > "%BACKUP_PATH%\BACKUP_INFO.txt"
echo Versão: 1.0 >> "%BACKUP_PATH%\BACKUP_INFO.txt"
echo Sistema: Finance Manager - $aldo+ >> "%BACKUP_PATH%\BACKUP_INFO.txt"
echo. >> "%BACKUP_PATH%\BACKUP_INFO.txt"
echo IMPORTANTE: >> "%BACKUP_PATH%\BACKUP_INFO.txt"
echo - Este backup contém o arquivo .env com chaves do Supabase >> "%BACKUP_PATH%\BACKUP_INFO.txt"
echo - NÃO compartilhe este backup publicamente >> "%BACKUP_PATH%\BACKUP_INFO.txt"
echo - Mantenha em local seguro >> "%BACKUP_PATH%\BACKUP_INFO.txt"

echo [INFO] Arquivo BACKUP_INFO.txt criado

:: Criar guia de migração para o novo PC
echo [INFO] Criando guia de migração...
(
echo ========================================
echo   GUIA DE MIGRAÇÃO PARA NOVO PC
echo   Finance Manager - $aldo+
echo ========================================
echo.
echo PASSO 1: INSTALAR NODE.JS NO NOVO PC
echo -------------------------------------
echo 1. Baixe o Node.js em: https://nodejs.org/
echo 2. Instale a versão LTS ^(recomendado^)
echo 3. Durante instalação, marque "Add to PATH"
echo 4. Reinicie o computador após instalação
echo.
echo Para verificar se instalou corretamente:
echo    node --version
echo    npm --version
echo.
echo.
echo PASSO 2: COPIAR ESTA PASTA PARA O NOVO PC
echo ------------------------------------------
echo 1. Copie TODA esta pasta para o novo PC
echo 2. Coloque em um local permanente, exemplo:
echo    C:\Projetos\finance-manager
echo 3. NÃO deixe no Desktop ou Downloads
echo.
echo.
echo PASSO 3: INSTALAR DEPENDÊNCIAS
echo --------------------------------
echo 1. Abra o Prompt de Comando ou PowerShell
echo 2. Navegue até a pasta do projeto:
echo    cd C:\Projetos\finance-manager
echo 3. Execute:
echo    npm install
echo 4. Aguarde a instalação ^(2-5 minutos^)
echo.
echo.
echo PASSO 4: VERIFICAR ARQUIVO .env
echo --------------------------------
echo 1. Verifique se o arquivo .env existe na raiz
echo 2. Deve conter as chaves do Supabase:
echo    VITE_SUPABASE_URL=https://...
echo    VITE_SUPABASE_ANON_KEY=eyJ...
echo.
echo.
echo PASSO 5: INICIAR O SISTEMA
echo ---------------------------
echo Opção 1 - Usar o script automático:
echo    Clique duas vezes em: INICIAR.bat
echo.
echo Opção 2 - Manualmente:
echo    npm run dev
echo    Depois abra: http://localhost:5173
echo.
echo.
echo PASSO 6: TESTAR
echo ----------------
echo 1. Faça login com suas credenciais
echo 2. Verifique se as transações aparecem
echo 3. Teste criar uma nova transação
echo 4. Verifique se tudo funciona normalmente
echo.
echo.
echo SOLUÇÃO DE PROBLEMAS
echo ====================
echo.
echo Erro: "npm não é reconhecido"
echo   Solução: Node.js não instalado ou não está no PATH
echo   - Reinstale o Node.js
echo   - Marque "Add to PATH" na instalação
echo   - Reinicie o computador
echo.
echo Erro: "Cannot find module"
echo   Solução: Execute: npm install
echo.
echo Erro: "Supabase connection failed"
echo   Solução: Verifique o arquivo .env
echo   - Confirme que existe
echo   - Verifique as chaves do Supabase
echo.
echo Erro: "Port 5173 already in use"
echo   Solução: Feche outras instâncias ou use:
echo   npm run dev -- --port 3000
echo.
echo.
echo IMPORTANTE
echo ==========
echo - Seus dados estão no Supabase ^(nuvem^)
echo - Não há perda de dados na migração
echo - Mantenha o arquivo .env seguro
echo - NÃO compartilhe as chaves do Supabase
echo.
echo.
echo CHECKLIST DE MIGRAÇÃO
echo =====================
echo [ ] Node.js instalado no novo PC
echo [ ] Pasta copiada para local permanente
echo [ ] npm install executado
echo [ ] Arquivo .env verificado
echo [ ] Sistema iniciado ^(INICIAR.bat ou npm run dev^)
echo [ ] Login funcionando
echo [ ] Dados carregando corretamente
echo.
echo.
echo Backup criado em: %date% %time%
echo ========================================
) > "%BACKUP_PATH%\LEIA-ME - COMO RESTAURAR NO NOVO PC.txt"

echo [INFO] Guia de migração criado
echo.

:: Criar arquivo ZIP do backup
echo [INFO] Compactando backup em ZIP...
echo.

powershell -Command "Compress-Archive -Path '%BACKUP_PATH%\*' -DestinationPath '%BACKUP_DIR%\%BACKUP_NAME%.zip' -Force"

if exist "%BACKUP_DIR%\%BACKUP_NAME%.zip" (
    echo [OK] Arquivo ZIP criado com sucesso!
    echo.
    echo Arquivo ZIP:
    echo %BACKUP_DIR%\%BACKUP_NAME%.zip
    echo.
    
    :: Obter tamanho do ZIP
    for %%A in ("%BACKUP_DIR%\%BACKUP_NAME%.zip") do set ZIP_SIZE=%%~zA
    echo Tamanho do ZIP: %ZIP_SIZE% bytes
    echo.
    
    :: Perguntar se quer excluir a pasta descompactada
    echo Deseja excluir a pasta descompactada e manter apenas o ZIP? (S/N)
    set /p DELETE_FOLDER=
    if /i "%DELETE_FOLDER%"=="S" (
        rmdir /s /q "%BACKUP_PATH%"
        echo [OK] Pasta descompactada removida. Apenas o ZIP foi mantido.
    ) else (
        echo [INFO] Pasta descompactada mantida.
    )
) else (
    echo [ERRO] Falha ao criar arquivo ZIP!
    echo [INFO] A pasta descompactada foi mantida.
)

echo.
echo ========================================
echo   BACKUP CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Local do backup:
if exist "%BACKUP_DIR%\%BACKUP_NAME%.zip" (
    echo ZIP: %BACKUP_DIR%\%BACKUP_NAME%.zip
) else (
    echo Pasta: %BACKUP_PATH%
)
echo.
