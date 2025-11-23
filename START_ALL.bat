@echo off
echo ===============================================
echo    iMavyBot v2.0 - Iniciando Sistema Completo
echo ===============================================
echo.

echo [1/2] Iniciando Bot WhatsApp...
start "iMavyBot" cmd /k "node index.js"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Dashboard Web...
cd dashboard
start "Dashboard" cmd /k "npm start"
cd ..

echo.
echo ✅ Sistema iniciado com sucesso!
echo.
echo Bot WhatsApp: Rodando em janela separada
echo Dashboard: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar este terminal...
pause >nul