// Backup automático do Supabase para JSON
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = path.join(__dirname, '..', 'backups_supabase');

export async function backupSupabase() {
    try {
        // Criar diretório se não existir
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
        
        // Coletar todos os dados
        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                bannedWords: await db.getBannedWords(),
                allowedGroups: await db.getAllowedGroups(),
                admins: await db.getAdmins(),
                lembretes: await db.getLembretes(),
                scheduledMessages: await db.getScheduledMessages(),
                adminLogs: await db.getAdminLogs(100)
            }
        };
        
        await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
        console.log(`✅ Backup Supabase criado: ${backupFile}`);
        
        // Limpar backups antigos (manter últimos 7)
        await cleanOldBackups();
        
        return { success: true, file: backupFile };
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
        return { success: false, error: error.message };
    }
}

async function cleanOldBackups() {
    try {
        const files = await fs.readdir(BACKUP_DIR);
        const backups = files
            .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
            .map(f => ({ name: f, path: path.join(BACKUP_DIR, f) }))
            .sort((a, b) => b.name.localeCompare(a.name));
        
        // Manter apenas os 7 mais recentes
        for (let i = 7; i < backups.length; i++) {
            await fs.unlink(backups[i].path);
            console.log(`🗑️ Backup antigo removido: ${backups[i].name}`);
        }
    } catch (error) {
        console.error('Erro ao limpar backups:', error);
    }
}

// Agendar backup diário às 3 AM
export function scheduleSupabaseBackup() {
    const now = new Date();
    const next3AM = new Date(now);
    next3AM.setHours(3, 0, 0, 0);
    
    if (next3AM <= now) {
        next3AM.setDate(next3AM.getDate() + 1);
    }
    
    const msUntil3AM = next3AM - now;
    
    setTimeout(() => {
        backupSupabase();
        setInterval(backupSupabase, 24 * 60 * 60 * 1000); // Repetir a cada 24h
    }, msUntil3AM);
    
    console.log(`📅 Backup Supabase agendado para: ${next3AM.toLocaleString('pt-BR')}`);
}
