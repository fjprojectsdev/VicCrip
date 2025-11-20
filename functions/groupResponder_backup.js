// groupResponder.js
import { getGroupStatus } from './groupStats.js';
import { addBlockedWord, addBlockedLink, removeBlockedWord, removeBlockedLink, getCustomBlacklist } from './customBlacklist.js';
import { addAllowedGroup, listAllowedGroups, removeAllowedGroup } from './adminCommands.js';
import { addAdmin, removeAdmin, listAdmins, getAdminStats, isAuthorized } from './authManager.js';

const BOT_TRIGGER = 'bot';

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
    if (normalizedText.includes('/fechar') || normalizedText.includes('/abrir') || normalizedText.includes('/fixar') || normalizedText.includes('/regras') || normalizedText.includes('/status') || normalizedText.includes('/banir') || normalizedText.includes('/bloqueartermo') || normalizedText.includes('/bloquearlink') || normalizedText.includes('/removertermo') || normalizedText.includes('/removerlink') || normalizedText.includes('/listatermos') || normalizedText.includes('/comandos') || normalizedText.includes('/adicionargrupo') || normalizedText.includes('/removergrupo') || normalizedText.includes('/listargrupos') || normalizedText.includes('/adicionaradmin') || normalizedText.includes('/removeradmin') || normalizedText.includes('/listaradmins')) {
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
            }
            // Outros comandos aqui...
        } catch (err) {
            console.error('❌ Erro ao executar comando:', err);
        }
        return;
    }

    // Modo de respostas inteligentes desabilitado - apenas comandos
}