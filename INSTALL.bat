@echo off
echo ===============================================
echo    iMavyBot v2.0 - Instalacao Automatica
echo ===============================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Baixe em: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js encontrado!

echo.
echo [2/4] Instalando dependencias principais...
npm install

echo.
echo [3/4] Copiando arquivo de configuracao...
if not exist .env (
    copy .env.example .env
    echo ✅ Arquivo .env criado!
) else (
    echo ⚠️ Arquivo .env ja existe
)

echo.
echo [4/4] Verificando instalacao...
if exist node_modules (
    echo ✅ Dependencias instaladas com sucesso!
) else (
    echo ❌ Erro na instalacao das dependencias
    pause
    exit /b 1
)

echo.
echo ===============================================
echo    ✅ INSTALACAO CONCLUIDA COM SUCESSO!
echo ===============================================
echo.
echo Proximos passos:
echo 1. Configure suas APIs no arquivo .env
echo 2. Execute START_ALL.bat para iniciar
echo.
pause