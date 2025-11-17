import cron from 'node-cron';

const TARGET_GROUP = '120363420952651026@g.us';

export function scheduleGroupMessages(sock) {
    console.log('📅 Agendador ativado');
    
    // Fechar grupo às 23:00 (horário de Brasília)
    cron.schedule('0 23 * * *', async () => {
        try {
            await sock.groupSettingUpdate(TARGET_GROUP, 'announcement');
            await sock.sendMessage(TARGET_GROUP, { 
                text: '🌙 *Grupo fechado!* 🌙\n\nO horário de descanso chegou 😴✨\nMensagens estarão desativadas até às 07:00 da manhã (horário de Brasília).\nAproveite para recarregar as energias 🔋💤\nNos vemos amanhã! 🌞💬' 
            }, { timezone: 'America/Sao_Paulo' });
            console.log('✅ Grupo fechado às 23:00 (America/Sao_Paulo)');
        } catch (err) {
            console.error('❌ Erro ao fechar grupo:', err);
        }
    });
    
    // Abrir grupo às 07:00
    cron.schedule('0 7 * * *', async () => {
        try {
            await sock.groupSettingUpdate(TARGET_GROUP, 'not_announcement');
            await sock.sendMessage(TARGET_GROUP, { 
                text: '☀️ *Bom dia!* ☀️\n\nO grupo está aberto novamente! 🎉\nVamos começar o dia com energia! 💪✨' 
            }, { timezone: 'America/Sao_Paulo' });
            console.log('✅ Grupo aberto às 07:00 (America/Sao_Paulo)');
        } catch (err) {
            console.error('❌ Erro ao abrir grupo:', err);
        }
    });
}