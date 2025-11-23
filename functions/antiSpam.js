// Anti-spam customizável
import * as db from './database.js';

let BANNED_WORDS = [];

// Carregar palavras do banco
async function loadBannedWords() {
    BANNED_WORDS = await db.getBannedWords();
}

// Carregar ao iniciar
loadBannedWords();

export function checkViolation(text) {
    const cleanText = text.toLowerCase().replace(/[\s\-_\.]/g, '');
    
    for (const word of BANNED_WORDS) {
        const cleanWord = word.toLowerCase().replace(/[\s\-_\.]/g, '');
        
        // Verifica palavra exata
        if (cleanText.includes(cleanWord)) {
            return { violated: true, type: `palavra proibida: "${word}"` };
        }
        
        // Verifica com regex para variações (letras substituídas)
        const pattern = cleanWord.split('').map(char => {
            const variations = {
                'a': '[aáàâã@4]',
                'e': '[eéê3]',
                'i': '[ií1!]',
                'o': '[oóôõ0]',
                'u': '[uú]',
                's': '[s5\$]',
                't': '[t7]',
                'b': '[b8]',
                'g': '[g9]'
            };
            return variations[char] || char;
        }).join('[\\s\\-_\\.]*');
        
        const regex = new RegExp(pattern, 'i');
        if (regex.test(text)) {
            return { violated: true, type: `palavra proibida (variação): "${word}"` };
        }
    }
    
    return { violated: false };
}

export async function notifyAdmins(sock, groupId, violationData) {
    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        
        const userNumber = violationData.userId.split('@')[0];
        let formattedNumber = userNumber;
        
        if (userNumber && userNumber.length >= 12) {
            const country = userNumber.substring(0, 2);
            const ddd = userNumber.substring(2, 4);
            const part1 = userNumber.substring(4, 8);
            const part2 = userNumber.substring(8);
            formattedNumber = `+${country} (${ddd}) ${part1}-${part2}`;
        }
        
        const dateTime = new Date().toLocaleString('pt-BR');
        
        const adminMessage = `🚨 *ALERTA DE VIOLAÇÃO* 🚨
🔒 *SISTEMA DE SEGURANÇA* 🔒
━━━━━━━━━━━━━━━━
_O sistema detectou o envio de link ou palavra-chave proibida no grupo._ 
_A ação foi bloqueada automaticamente para manter a segurança._ 🔒
━━━━━━━━━━━━━━━━
👤 *Dados do usuário:* 👤
> 🆔 *ID:* ${violationData.userId}
> 📱 *Número:* ${formattedNumber}
> 🕒 *Data/Hora:* ${dateTime}
━━━━━━━━━━━━━━━━
🚨 *MENSAGEM BLOQUEADA:* 🚨 

${violationData.message}

━━━━━━━━━━━━━━━━
_A mensagem foi removida automaticamente pelo sistema._ 🗑️  
> Se desejarem aplicar punições adicionais, verifiquem o histórico do grupo. 🔍⚖️`;
        
        for (const adminId of admins) {
            await sock.sendMessage(adminId, { text: adminMessage });
        }
    } catch (error) {
        console.error('Erro ao notificar admins:', error);
    }
}

export async function addBannedWord(word) {
    const success = await db.addBannedWord(word);
    if (success) {
        await loadBannedWords();
        return { success: true, message: `✅ Termo "${word}" adicionado!` };
    }
    return { success: false, message: `⚠️ Termo "${word}" já existe!` };
}

export async function removeBannedWord(word) {
    const success = await db.removeBannedWord(word);
    if (success) {
        await loadBannedWords();
        return { success: true, message: `✅ Termo "${word}" removido!` };
    }
    return { success: false, message: `⚠️ Termo "${word}" não encontrado!` };
}

export async function listBannedWords() {
    return await db.getBannedWords();
}
