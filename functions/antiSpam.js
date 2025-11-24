import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BANNED_FILE = path.join(__dirname, '..', 'banned_words.json');

function loadBannedWords() {
    try {
        return JSON.parse(fs.readFileSync(BANNED_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveBannedWords(words) {
    fs.writeFileSync(BANNED_FILE, JSON.stringify(words, null, 2));
}

export function checkViolation(text) {
    const bannedWords = loadBannedWords();
    const lowerText = text.toLowerCase();
    
    for (const term of bannedWords) {
        if (lowerText.includes(term.toLowerCase())) {
            return { violated: true, type: `termo proibido: "${term}"` };
        }
    }
    
    return { violated: false };
}

export async function notifyAdmins(sock, groupId, violationData) {
    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        
        const userNumber = violationData.userId.split('@')[0];
        const dateTime = new Date().toLocaleString('pt-BR');
        
        const adminMessage = `🚨 *ALERTA DE VIOLAÇÃO*\n\n👤 *Usuário:* ${userNumber}\n🕒 *Data/Hora:* ${dateTime}\n\n📝 *Mensagem bloqueada:*\n${violationData.message}`;
        
        for (const adminId of admins) {
            await sock.sendMessage(adminId, { text: adminMessage });
        }
    } catch (error) {
        console.error('Erro ao notificar admins:', error);
    }
}

export function addBannedWord(word) {
    const words = loadBannedWords();
    const term = word.trim();
    
    if (words.includes(term)) {
        return { success: false, message: `⚠️ Termo "${term}" já existe!` };
    }
    
    words.push(term);
    saveBannedWords(words);
    return { success: true, message: `✅ Termo "${term}" adicionado!` };
}

export function removeBannedWord(word) {
    const words = loadBannedWords();
    const term = word.trim();
    const index = words.indexOf(term);
    
    if (index === -1) {
        return { success: false, message: `⚠️ Termo "${term}" não encontrado!` };
    }
    
    words.splice(index, 1);
    saveBannedWords(words);
    return { success: true, message: `✅ Termo "${term}" removido!` };
}

export function listBannedWords() {
    return loadBannedWords();
}
