// Sistema de estatísticas
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { listBannedWords } from './antiSpam.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const startTime = Date.now();

export function getStats() {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    
    let totalStrikes = 0;
    try {
        const strikesPath = path.join(__dirname, '..', 'strikes.json');
        if (fs.existsSync(strikesPath)) {
            const data = JSON.parse(fs.readFileSync(strikesPath, 'utf8'));
            totalStrikes = Object.values(data).reduce((sum, user) => sum + (user.count || 0), 0);
        }
    } catch (e) {}
    
    let lembretesAtivos = 0;
    try {
        const lembretesPath = path.join(__dirname, '..', 'lembretes.json');
        if (fs.existsSync(lembretesPath)) {
            const data = JSON.parse(fs.readFileSync(lembretesPath, 'utf8'));
            lembretesAtivos = Object.keys(data).length;
        }
    } catch (e) {}
    
    const bannedWords = listBannedWords().length;
    
    return {
        uptime: `${hours}h ${minutes}m ${seconds}s`,
        totalStrikes,
        lembretesAtivos,
        bannedWords
    };
}

export function formatStats() {
    const stats = getStats();
    return `📊 *ESTATÍSTICAS DO BOT* 📊
━━━━━━━━━━━━━━━━

⏱️ *Uptime:* ${stats.uptime}
⚠️ *Total de Strikes:* ${stats.totalStrikes}
🔔 *Lembretes Ativos:* ${stats.lembretesAtivos}
🚫 *Palavras Bloqueadas:* ${stats.bannedWords}

━━━━━━━━━━━━━━━━
🤖 iMavyAgent v2.0`;
}
