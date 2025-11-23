// Sistema de backup automático
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const FILES_TO_BACKUP = ['strikes.json', 'lembretes.json', 'banned_words.json', 'allowed_groups.json', 'admins.json'];

function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
}

export function createBackup() {
    ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    for (const file of FILES_TO_BACKUP) {
        const sourcePath = path.join(__dirname, '..', file);
        if (fs.existsSync(sourcePath)) {
            const backupPath = path.join(BACKUP_DIR, `${file}.${timestamp}.bak`);
            try {
                fs.copyFileSync(sourcePath, backupPath);
            } catch (e) {
                console.error(`Erro ao fazer backup de ${file}:`, e);
            }
        }
    }
    
    cleanOldBackups();
}

function cleanOldBackups() {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    for (const file of files) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > sevenDays) {
            fs.unlinkSync(filePath);
        }
    }
}

// Backup diário às 3h da manhã
export function scheduleBackups() {
    const now = new Date();
    const next3AM = new Date(now);
    next3AM.setHours(3, 0, 0, 0);
    
    if (next3AM <= now) {
        next3AM.setDate(next3AM.getDate() + 1);
    }
    
    const msUntil3AM = next3AM - now;
    
    setTimeout(() => {
        createBackup();
        setInterval(createBackup, 24 * 60 * 60 * 1000);
    }, msUntil3AM);
}
