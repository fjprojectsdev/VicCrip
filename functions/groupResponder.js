// groupResponder.js
import { getGroupStatus } from './groupStats.js';
import { addBlockedWord, addBlockedLink, removeBlockedWord, removeBlockedLink, getCustomBlacklist } from './customBlacklist.js';
import { addAllowedGroup, listAllowedGroups, removeAllowedGroup } from './adminCommands.js';
import { addAdmin, removeAdmin, listAdmins, getAdminStats, isAuthorized } from './authManager.js';

const BOT_TRIGGER = 'bot';

// ==============================
// SISTEMA DE LEMBRETES iMAVY
// ==============================

// Guardar lembretes ativos por grupo
const lembretesAtivos = {};

async function mentionAllInvisible(sock, from, messageText) {
    try {
        const metadata = await sock.groupMetadata(from);
        const members = metadata.participants.map(m => m.id);

        await sock.sendMessage(from, {
            text: messageText,
            mentions: members
        });
    } catch (err) {
        console.error('Erro ao mencionar todos:', err);
    }
}

// Respostas pré-definidas
const RESPONSES = {
    'oi': '👋 Olá! Como posso ajudar?',
    'ajuda': '📋 Comandos disponíveis:\n- oi\n- ajuda\n- status\n- info\n- /fechar\n- /abrir\n- /fixar\n- /regras\n- /status\n- /comandos',
    'status': '✅ Bot online e funcionando!',
    'info': '🤖 iMavyBot v1.0 - Bot simples para WhatsApp'
};

export async function handleGroupMessages(sock, message) {
    const groupId = message.key.remoteJid;
    const isGroup = groupId.endsWith('@g.us');
    const senderId = message.key.participant || message.key.remoteJid;

    const contentType = Object.keys(message.message)[0];
    let text = '';
    
    // Permitir /comandos no PV
    switch(contentType) {
        case 'conversation':
            text = message.message.conversation;
            break;
        case 'extendedTextMessage':
            text = message.message.extendedTextMessage.text;
            break;
    }
    
    // Funcionalidade de resposta automática desabilitada
    
    if (!isGroup && text.toLowerCase().includes('/comandos')) {
        const comandosMsg = `🤖 LISTA COMPLETA DE COMANDOS 🤖
━━━━━━━━━━━━━━━━
👮 COMANDOS ADMINISTRATIVOS:

* 🔒 /fechar - Fecha o grupo
* 🔓 /abrir - Abre o grupo
* 📌 /fixar [mensagem]
* 🚫 /banir @membro [motivo]
* 🚫 /bloqueartermo [palavra]
* 🔗 /bloquearlink [dominio]
* ✏️ /removertermo [palavra]
* 🔓 /removerlink [dominio]
* 📝 /listatermos
* 🛠️ /adicionargrupo [Nome do Grupo | JID]
* 🗑️ /removergrupo [Nome do Grupo | JID]
* 📋 /listargrupos - Lista grupos e usuários permitidos
━━━━━━━━━━━━━━━━
📊 COMANDOS DE INFORMAÇÃO:

* 📊 /status - Status e estatísticas do grupo
* 📋 /regras - Exibe regras do grupo
* 📱 /comandos - Lista todos os comandos
━━━━━━━━━━━━━━━━
🤖 COMANDOS DO BOT:

* 👋 bot oi - Saudação
* ❓ bot ajuda - Ajuda rápida
* ✅ bot status - Status do bot
* ℹ️ bot info - Informações do bot
    
* 🛠️ /adicionargrupo [Nome do Grupo | JID]
* 🗑️ /removergrupo [Nome do Grupo | JID]
* 📋 /listargrupos
* 👮 /adicionaradmin @usuario
* 🗑️ /removeradmin @usuario
* 📋 /listaradmins
━━━━━━━━━━━━━━━━
🔒 Sistema de Segurança Ativo
* Anti-spam automático
* Sistema de strikes (3 = expulsão)
* Bloqueio de links e palavras proibidas
* Notificação automática aos admins
━━━━━━━━━━━━━━━━
🤖 iMavyBot v2.0 - Protegendo seu grupo 24/7`;

        await sock.sendMessage(senderId, { text: comandosMsg });
        return;
    }

    // Permitir respostas em PV usando o dicionário RESPONSES
    if (!isGroup) {
        const textLower = (text || '').trim().toLowerCase();
        if (textLower && RESPONSES[textLower]) {
            await sock.sendMessage(senderId, { text: RESPONSES[textLower] });
            return;
        }
        
        // Permitir comandos administrativos em PV para administradores autorizados
        if (textLower && (textLower.includes('/adicionargrupo') || textLower.includes('/removergrupo') || textLower.includes('/listargrupos') || textLower.includes('/adicionaradmin') || textLower.includes('/removeradmin') || textLower.includes('/listaradmins'))) {
            const authorized = await isAuthorized(senderId);
            if (authorized) {
                // Processar comando administrativo em PV
                const normalizedText = textLower;
                
                if (normalizedText.startsWith('/adicionargrupo')) {
                    let param = text.replace(/\/adicionargrupo/i, '').trim();
                    const result = await addAllowedGroup(senderId, param);
                    await sock.sendMessage(senderId, { text: result.message });
                } else if (normalizedText.startsWith('/removergrupo')) {
                    let param = text.replace(/\/removergrupo/i, '').trim();
                    const result = await removeAllowedGroup(senderId, param);
                    await sock.sendMessage(senderId, { text: result.message });
                } else if (normalizedText.startsWith('/listargrupos')) {
                    const allowed = await listAllowedGroups();
                    if (!allowed || allowed.length === 0) {
                        await sock.sendMessage(senderId, { text: 'ℹ️ A lista de grupos permitidos está vazia.' });
                    } else {
                        const formatted = allowed.map((g, i) => `${i + 1}. ${g}`).join('\n');
                        const reply = `📋 Grupos permitidos:\n\n${formatted}`;
                        await sock.sendMessage(senderId, { text: reply });
                    }
                } else if (normalizedText.startsWith('/adicionaradmin')) {
                    let param = text.replace(/\/adicionaradmin/i, '').trim();
                    if (!param) {
                        await sock.sendMessage(senderId, { text: '❌ *Uso incorreto!*\n\n📝 Use: `/adicionaradmin 5564993344024`' });
                        return;
                    }
                    const result = await addAdmin(senderId, param);
                    await sock.sendMessage(senderId, { text: result.message });
                } else if (normalizedText.startsWith('/removeradmin')) {
                    let param = text.replace(/\/removeradmin/i, '').trim();
                    if (!param) {
                        await sock.sendMessage(senderId, { text: '❌ *Uso incorreto!*\n\n📝 Use: `/removeradmin 5564993344024`' });
                        return;
                    }
                    const result = await removeAdmin(senderId, param);
                    await sock.sendMessage(senderId, { text: result.message });
                } else if (normalizedText.startsWith('/listaradmins')) {
                    const admins = await listAdmins();
                    const stats = await getAdminStats();
                    
                    if (admins.length === 0) {
                        await sock.sendMessage(senderId, { text: 'ℹ️ Nenhum administrador configurado.\n\nConfigure via .env (AUTHORIZED_IDS) ou use /adicionaradmin' });
                        return;
                    }
                    
                    let adminList = `👮 *ADMINISTRADORES DO BOT* 👮\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                    adminList += `📊 *Estatísticas:*\n`;
                    adminList += `• Total: ${stats.total}\n`;
                    adminList += `• Do .env: ${stats.fromEnv}\n`;
                    adminList += `• Do JSON: ${stats.fromFile}\n\n`;
                    adminList += `━━━━━━━━━━━━━━━━━━━━━━━\n📋 *Lista de Administradores:*\n\n`;
                    
                    admins.forEach((admin, index) => {
                        adminList += `${index + 1}. ${admin.id}\n   └─ Fonte: ${admin.source}\n`;
                    });
                    
                    adminList += `\n━━━━━━━━━━━━━━━━━━━━━━━\n💡 Use /adicionaradmin ou /removeradmin para gerenciar`;
                    
                    await sock.sendMessage(senderId, { text: adminList });
                }
                return;
            } else {
                await sock.sendMessage(senderId, { text: '❌ *Acesso Negado*\n\n⚠️ Apenas administradores autorizados podem usar comandos do bot.' });
                return;
            }
        }
        
        // Caso não seja um comando conhecido em PV, ignorar
        return;
    }

    text = '';

    switch(contentType) {
        case 'conversation':
            text = message.message.conversation;
            break;
        case 'extendedTextMessage':
            text = message.message.extendedTextMessage.text;
            break;
        default:
            return;
    }

    console.log(`💬 Mensagem de ${senderId}: "${text}"`);
    const normalizedText = text.toLowerCase();

    // Ignorar comandos dentro de mensagens pré-definidas (como regras)
    if (text.includes('REGRAS OFICIAIS DO GRUPO') || text.includes('iMavyBot') || text.includes('Bem-vindo(a) ao grupo')) {
        console.log('⏭️ Ignorando comandos dentro de mensagem pré-definida');
        return;
    }
    
    // Comandos administrativos
    if (normalizedText.includes('/fechar') || normalizedText.includes('/abrir') || normalizedText.includes('/fixar') || normalizedText.includes('/regras') || normalizedText.includes('/status') || normalizedText.includes('/banir') || normalizedText.includes('/lembrete') || normalizedText.includes('/stoplembrete') || normalizedText.includes('/bloqueartermo') || normalizedText.includes('/bloquearlink') || normalizedText.includes('/removertermo') || normalizedText.includes('/removerlink') || normalizedText.includes('/listatermos') || normalizedText.includes('/comandos') || normalizedText.includes('/adicionargrupo') || normalizedText.includes('/removergrupo') || normalizedText.includes('/listargrupos') || normalizedText.includes('/adicionaradmin') || normalizedText.includes('/removeradmin') || normalizedText.includes('/listaradmins')) {
        try {
            const isRulesCommand = normalizedText.includes('/regras');
            const requiresAuth = !isRulesCommand;
            
            // Se requer autorização, verificar se o usuário é admin
            if (requiresAuth) {
                const authorized = await isAuthorized(senderId);
                if (!authorized) {
                    await sock.sendMessage(groupId, { 
                        text: '❌ *Acesso Negado*\n\n⚠️ Apenas administradores autorizados podem usar comandos do bot.\n👥 Integrantes comuns têm acesso somente ao comando /regras.\n\n💡 Entre em contato com um administrador para solicitar permissão.' 
                    });
                    console.log(`🚫 Comando administrativo bloqueado para usuário não autorizado: ${senderId}`);
                    return;
                }
            }
            
            if (normalizedText.includes('/regras')) {
                const rulesMessage = `⚠ *REGRAS OFICIAIS DO GRUPO* ⚠
     *Bem-vindo(a) ao grupo!*
_Leia com atenção antes de participar das conversas!_

❗ *Respeito acima de tudo!*
_Nada de xingamentos, discussões ou qualquer tipo de preconceito._

❗ *Proibido SPAM e divulgação sem permissão.*
_Mensagens repetidas, links suspeitos e propaganda não autorizada serão removidos._

❗ *Mantenha o foco do grupo.*
_Conversas fora do tema principal atrapalham todos._

❗ *Conteúdo inadequado não será tolerado.*
_Nada de conteúdo adulto, político, religioso ou violento._

❗ *Use o bom senso.*
_Se não agregou, não envie._

❗ *Apenas administradores podem alterar o grupo.*
_Nome, foto e descrição são gerenciados pelos ADMs._

❗ *Dúvidas?*
_Use o comando /ajuda ou marque um administrador._ 💬
━━━━━━━━━━━━━━━━━━━
🕒 *Horários do Grupo:*
☀ _Abertura automática:_ *07:00*
🌙 _Fechamento automático:_ *00:00*

💡 _Dica:_ Digite */comandos* para ver todos os comandos disponíveis.

❕ _Seu comportamento define a qualidade do grupo._`;
                
                const msgRegras = await sock.sendMessage(groupId, { text: rulesMessage });
                console.log(msgRegras ? '✅ Regras enviadas com sucesso' : '❌ Falha ao enviar regras');
            } else if (normalizedText.includes('/fechar')) {
                await sock.groupSettingUpdate(groupId, 'announcement');
                const closeMessage = `🕛 Mensagem de Fechamento (00:00)

🌙 Encerramento do Grupo 🌙
🔒 O grupo está sendo fechado agora (00:00)!
Agradecemos a participação de todos 💬
Descansem bem 😴💤
Voltamos com tudo às 07:00 da manhã! ☀️💪`;
                await sock.sendMessage(groupId, { text: closeMessage });
            } else if (normalizedText.includes('/abrir')) {
                await sock.groupSettingUpdate(groupId, 'not_announcement');
                const openMessage = `🌅 Mensagem de Abertura (07:00)

☀️ Bom dia, pessoal! ☀️
🔓 O grupo foi reaberto (07:00)!
Desejamos a todos um ótimo início de dia 💫
Vamos com foco, energia positiva e boas conversas 💬✨`;
                await sock.sendMessage(groupId, { text: openMessage });
            } else if (normalizedText.includes('/status')) {
                const statusMessage = await getGroupStatus(sock, groupId);
                await sock.sendMessage(groupId, { text: statusMessage });
            } else if (normalizedText.includes('/fixar')) {
                const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                let messageToPin = text.replace(/\/fixar/i, '').trim();
                if (messageToPin) {
                    const agora = new Date();
                    const data = agora.toLocaleDateString('pt-BR');
                    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const pinnedMsg = `📌 MENSAGEM IMPORTANTE 📌
━━━━━━━━━━━━━━━━━━━
${messageToPin}
━━━━━━━━━━━━━━━━━━━
| 📅 DATA: ${data}
| 🕓HORA: ${hora}`;
                    await sock.sendMessage(groupId, { text: pinnedMsg, mentions: mentionedJids });
                } else {
                    await sock.sendMessage(groupId, { text: '❌ *Uso incorreto!*\n\n📝 Use: `/fixar sua mensagem aqui`' });
                }
            } else if (normalizedText.includes('/banir')) {
                const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                if (mentionedJids.length > 0) {
                    const groupMetadata = await sock.groupMetadata(groupId);
                    for (const memberId of mentionedJids) {
                        const memberNumber = memberId.split('@')[0];
                        await sock.groupParticipantsUpdate(groupId, [memberId], 'remove');
                        await sock.sendMessage(groupId, { text: `🚫 Membro banido com sucesso!` });
                        
                        // Notificar administradores
                        const admins = groupMetadata.participants.filter(p => p.admin && p.id !== memberId).map(p => p.id);
                        const dataHora = new Date().toLocaleString('pt-BR');
                        const adminNotification = `🔥👮 *ATENÇÃO, ADMINISTRADORES!* 👮🔥

Um membro foi banido do grupo:

📌 *Informações:*
• 🆔 ID: ${memberId}
• 📱 Número: ${memberNumber}
• 🕓 Data/Hora: ${dataHora}

🚫 Ação executada por comando administrativo.`;
                        
                        for (const adminId of admins) {
                            await sock.sendMessage(adminId, { text: adminNotification });
                        }
                    }
                } else {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/banir @membro`' });
                }
            } else if (normalizedText.startsWith('/adicionargrupo')) {
                let param = text.replace(/\/adicionargrupo/i, '').trim();
                if (!param && isGroup) {
                    const gm = await sock.groupMetadata(groupId);
                    param = gm.subject || '';
                }
                const result = await addAllowedGroup(senderId, param);
                await sock.sendMessage(senderId, { text: result.message });
                if (result.success) {
                    await sock.sendMessage(groupId, { text: '✅ Grupo adicionado à lista!' });
                }
            } else if (normalizedText.startsWith('/removergrupo')) {
                let param = text.replace(/\/removergrupo/i, '').trim();
                if (!param && isGroup) {
                    const gm = await sock.groupMetadata(groupId);
                    param = gm.subject || '';
                }
                const result = await removeAllowedGroup(senderId, param);
                await sock.sendMessage(senderId, { text: result.message });
                if (result.success) {
                    await sock.sendMessage(groupId, { text: '✅ Grupo removido da lista!' });
                }
            } else if (normalizedText.startsWith('/listargrupos')) {
                const allowed = await listAllowedGroups();
                if (!allowed || allowed.length === 0) {
                    await sock.sendMessage(senderId, { text: 'ℹ️ Lista de grupos vazia.' });
                } else {
                    const formatted = allowed.map((g, i) => `${i + 1}. ${g}`).join('\n');
                    await sock.sendMessage(senderId, { text: `📋 Grupos permitidos:\n\n${formatted}` });
                }
            } else if (normalizedText.startsWith('/adicionaradmin')) {
                const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                let param = text.replace(/\/adicionaradmin/i, '').trim();
                if (mentionedJids.length > 0) param = mentionedJids[0];
                if (!param) {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/adicionaradmin @usuario`' });
                    return;
                }
                const result = await addAdmin(senderId, param);
                await sock.sendMessage(senderId, { text: result.message });
                if (result.success) {
                    await sock.sendMessage(groupId, { text: '✅ Admin adicionado!' });
                }
            } else if (normalizedText.startsWith('/removeradmin')) {
                const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                let param = text.replace(/\/removeradmin/i, '').trim();
                if (mentionedJids.length > 0) param = mentionedJids[0];
                if (!param) {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/removeradmin @usuario`' });
                    return;
                }
                const result = await removeAdmin(senderId, param);
                await sock.sendMessage(senderId, { text: result.message });
                if (result.success) {
                    await sock.sendMessage(groupId, { text: '✅ Admin removido!' });
                }
            } else if (normalizedText.startsWith('/listaradmins')) {
                const admins = await listAdmins();
                if (admins.length === 0) {
                    await sock.sendMessage(senderId, { text: 'ℹ️ Nenhum admin configurado.' });
                } else {
                    let adminList = `👮 *ADMINISTRADORES*\n━━━━━━━━━━━━━━━━\n\n`;
                    admins.forEach((admin, index) => {
                        adminList += `${index + 1}. ${admin.id}\n`;
                    });
                    await sock.sendMessage(senderId, { text: adminList });
                }
            } else if (normalizedText.includes('/bloqueartermo')) {
                const termo = text.replace(/\/bloqueartermo/i, '').trim();
                if (termo) {
                    const result = addBlockedWord(termo);
                    await sock.sendMessage(groupId, { text: result.success ? `✅ Termo "${termo}" bloqueado!` : `⚠️ ${result.message}` });
                } else {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/bloqueartermo palavra`' });
                }
            } else if (normalizedText.includes('/bloquearlink')) {
                const link = text.replace(/\/bloquearlink/i, '').trim();
                if (link) {
                    const result = addBlockedLink(link);
                    await sock.sendMessage(groupId, { text: result.success ? `✅ Link "${link}" bloqueado!` : `⚠️ ${result.message}` });
                } else {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/bloquearlink dominio`' });
                }
            } else if (normalizedText.includes('/removertermo')) {
                const termo = text.replace(/\/removertermo/i, '').trim();
                if (termo) {
                    const result = removeBlockedWord(termo);
                    await sock.sendMessage(groupId, { text: result.success ? `✅ Termo "${termo}" removido!` : `⚠️ ${result.message}` });
                } else {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/removertermo palavra`' });
                }
            } else if (normalizedText.includes('/removerlink')) {
                const link = text.replace(/\/removerlink/i, '').trim();
                if (link) {
                    const result = removeBlockedLink(link);
                    await sock.sendMessage(groupId, { text: result.success ? `✅ Link "${link}" removido!` : `⚠️ ${result.message}` });
                } else {
                    await sock.sendMessage(groupId, { text: '❌ Use: `/removerlink dominio`' });
                }
            } else if (normalizedText.includes('/listatermos')) {
                const blacklist = getCustomBlacklist();
                let listaMsg = `📝 *TERMOS E LINKS BLOQUEADOS*\n━━━━━━━━━━━━━━━━\n\n`;
                if (blacklist.words.length > 0) {
                    listaMsg += `🚫 *Palavras:*\n${blacklist.words.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\n`;
                }
                if (blacklist.links.length > 0) {
                    listaMsg += `🔗 *Links:*\n${blacklist.links.map((l, i) => `${i + 1}. ${l}`).join('\n')}\n\n`;
                }
                listaMsg += `📊 *Total:* ${blacklist.words.length + blacklist.links.length} bloqueios`;
                await sock.sendMessage(groupId, { text: listaMsg });
            } else if (normalizedText.startsWith('/lembrete')) {
                const partes = text.split(' + ');
                
                if (partes.length < 2) {
                    await sock.sendMessage(groupId, { text: '❗ Use: /lembrete + mensagem 1h 24h\nEx: /lembrete + REUNIÃO HOJE! 1h 24h' });
                    return;
                }
                
                const resto = partes[1].trim().split(' ');
                const tempos = resto.slice(-2); // últimos 2 elementos (1h 24h)
                const comando = resto.slice(0, -2).join(' '); // tudo menos os 2 últimos
                
                const intervalo = parseInt(tempos[0]);
                const encerramento = parseInt(tempos[1]);
                
                if (!comando || !intervalo || !encerramento) {
                    await sock.sendMessage(groupId, { text: '❗ Use: /lembrete + mensagem 1h 24h\nEx: /lembrete + REUNIÃO HOJE! 1h 24h' });
                    return;
                }
                
                // Validações
                if (intervalo < 1 || intervalo > 24) {
                    await sock.sendMessage(groupId, { text: '⛔ O intervalo deve ser entre *1 e 24 horas*.' });
                    return;
                }
                
                if (encerramento < intervalo || encerramento > 48) {
                    await sock.sendMessage(groupId, { text: '⛔ O encerramento deve ser maior que o intervalo e máximo 48 horas.' });
                    return;
                }
                
                const intervaloMs = intervalo * 60 * 60 * 1000;
                const encerramentoMs = encerramento * 60 * 60 * 1000;
                
                // cancelar lembrete existente
                if (lembretesAtivos[groupId]) {
                    clearInterval(lembretesAtivos[groupId]);
                }
                
                // MENSAGEM FORMATADA
                const data = new Date();
                const dia = `${data.getDate()}`.padStart(2, '0');
                const mes = `${data.getMonth()+1}`.padStart(2, '0');
                const ano = data.getFullYear();
                const hora = `${data.getHours()}`.padStart(2, '0');
                const min = `${data.getMinutes()}`.padStart(2, '0');
                
                const msgFormatada = `🚨 *LEMBRETE GLOBAL DO SISTEMA* 🚨
━━━━━━━━━━━━━━━━━━
> 📅 Data: ${dia}/${mes}/${ano}
> 🕒 Horário: ${hora}:${min}
> 🔔 Status: Notificação enviada à todos os membros.
━━━━━━━━━━━━━━━━━━

${comando}
━━━━━━━━━━━━━━━━━━
⛔ *Configurado para repetir a cada ${intervalo}h*
⏰ *Encerramento automático em ${encerramento}h*
*_Sistema iMavy — Automação Inteligente_*`;
                
                // Enviar primeira vez
                await mentionAllInvisible(sock, groupId, msgFormatada);
                
                // Criar temporizador automático
                lembretesAtivos[groupId] = setInterval(async () => {
                    const agora = new Date();
                    const d = `${agora.getDate()}`.padStart(2, '0');
                    const m = `${agora.getMonth()+1}`.padStart(2, '0');
                    const a = agora.getFullYear();
                    const h = `${agora.getHours()}`.padStart(2, '0');
                    const mn = `${agora.getMinutes()}`.padStart(2, '0');
                    
                    const repeticao = `🚨 *LEMBRETE AUTOMÁTICO* 🚨
━━━━━━━━━━━━━━━━━━
> 📅 Data: ${d}/${m}/${a}
> 🕒 Horário: ${h}:${mn}
> 🔔 Status: Lembrete automático ativo.
━━━━━━━━━━━━━━━━━━

${comando}

*_Sistema iMavy — Automação Inteligente_*`;
                    
                    await mentionAllInvisible(sock, groupId, repeticao);
                }, intervaloMs);
                
                // Encerramento automático
                setTimeout(() => {
                    if (lembretesAtivos[groupId]) {
                        clearInterval(lembretesAtivos[groupId]);
                        delete lembretesAtivos[groupId];
                        sock.sendMessage(groupId, { text: '⏰ *Lembrete encerrado automaticamente após ${encerramento}h*\n\n*_Sistema iMavy — Automação Inteligente_*' });
                    }
                }, encerramentoMs);
            } else if (normalizedText === '/stoplembrete') {
                if (lembretesAtivos[groupId]) {
                    clearInterval(lembretesAtivos[groupId]);
                    delete lembretesAtivos[groupId];
                    await sock.sendMessage(groupId, { text: '🛑 O lembrete automático foi *desativado* com sucesso!' });
                } else {
                    await sock.sendMessage(groupId, { text: 'ℹ️ Não há nenhum lembrete ativo neste grupo.' });
                }
            } else if (normalizedText.includes('/comandos')) {
                const comandosMsg = `🤖LISTA DE COMANDOS🤖
━━━━━━━━━━━━━━━━
🛂  COMANDOS ADMINISTRATIVOS:

* 🔒 /fechar - Fecha o grupo
* 🔓 /abrir - Abre o grupo
* 📌 /fixar [mensagem]
* 🚫 /banir @membro
* 📢 /lembrete + mensagem 1h 24h
* 🛑 /stoplembrete - Para lembrete
* 🚫 /bloqueartermo [palavra]
* 🔗 /bloquearlink [dominio]
* ✏ /removertermo [palavra]
* 🔓 /removerlink [dominio]
* 📝 /listatermos
* 🛠 /adicionargrupo [nome]
* 🗑 /removergrupo [nome]
* 📋 /listargrupos
* 👮 /adicionaradmin @usuario
* 🗑 /removeradmin @usuario
* 📋 /listaradmins
━━━━━━━━━━━━━━━━
📊 COMANDOS DE INFORMAÇÃO:

* 📊 /status - Status do grupo
* 📋 /regras - Regras do grupo
* 📱 /comandos - Lista de comandos
━━━━━━━━━━━━━━━━
🔒 Sistema de Segurança Ativo
* Anti-spam automático
* Sistema de strikes (3 = expulsão)
* Bloqueio de links e palavras proibidas
* Notificação automática aos admins
* Lembretes automáticos com temporizador
━━━━━━━━━━━━━━━━
 iMavyBot v2.0
copyright ©`;
                await sock.sendMessage(groupId, { text: comandosMsg });
            }
        } catch (err) {
            console.error('❌ Erro ao executar comando:', err);
        }
        return;
    }

    // Modo de respostas inteligentes desabilitado - apenas comandos
}