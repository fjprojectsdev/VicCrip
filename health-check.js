// health-check.js - Script para verificar saúde do bot
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function checkBotHealth() {
    try {
        const statusFile = path.join(__dirname, '.bot_status');
        
        if (!fs.existsSync(statusFile)) {
            console.log('❌ Bot não está rodando (arquivo de status não encontrado)');
            process.exit(1);
        }
        
        const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
        const now = Date.now();
        const timeSinceLastHeartbeat = now - status.lastHeartbeat;
        const maxIdleTime = 5 * 60 * 1000; // 5 minutos
        
        console.log('📊 Status do Bot:');
        console.log('  - Conectado:', status.isConnected ? '✅ Sim' : '❌ Não');
        console.log('  - Último heartbeat:', new Date(status.lastHeartbeat).toISOString());
        console.log('  - Tempo desde último heartbeat:', Math.floor(timeSinceLastHeartbeat / 1000), 'segundos');
        
        if (timeSinceLastHeartbeat > maxIdleTime) {
            console.log('\n⚠️ ALERTA: Bot parece estar travado!');
            console.log('   Considere reiniciar o serviço.');
            process.exit(1);
        }
        
        if (!status.isConnected) {
            console.log('\n⚠️ AVISO: Bot não está conectado ao WhatsApp');
            console.log('   Pode estar tentando reconectar...');
            process.exit(1);
        }
        
        console.log('\n✅ Bot está saudável e funcionando!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erro ao verificar saúde do bot:', error.message);
        process.exit(1);
    }
}

// Verificar se auth_info existe
function checkAuthInfo() {
    const authPath = path.join(__dirname, 'auth_info');
    const backupPath = path.join(__dirname, 'auth_backup');
    
    console.log('\n📁 Verificando sessão:');
    
    if (fs.existsSync(authPath)) {
        const files = fs.readdirSync(authPath);
        console.log('  - auth_info/:', files.length > 0 ? `✅ ${files.length} arquivos` : '⚠️ Vazio');
    } else {
        console.log('  - auth_info/: ❌ Não existe');
    }
    
    if (fs.existsSync(backupPath)) {
        const files = fs.readdirSync(backupPath);
        console.log('  - auth_backup/:', files.length > 0 ? `✅ ${files.length} arquivos` : '⚠️ Vazio');
    } else {
        console.log('  - auth_backup/: ⚠️ Não existe (será criado após primeira conexão)');
    }
}

console.log('🔍 Verificando saúde do iMavyAgent Bot...\n');
checkAuthInfo();
checkBotHealth();
