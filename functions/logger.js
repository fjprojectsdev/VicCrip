// Logger estruturado simples
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, '..', 'bot.log');

function formatLog(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}\n`;
}

function writeLog(level, message, meta) {
    const log = formatLog(level, message, meta);
    console.log(log.trim());
    
    try {
        fs.appendFileSync(LOG_FILE, log);
    } catch (e) {
        console.error('Erro ao escrever log:', e);
    }
}

export const logger = {
    info: (msg, meta) => writeLog('INFO', msg, meta),
    warn: (msg, meta) => writeLog('WARN', msg, meta),
    error: (msg, meta) => writeLog('ERROR', msg, meta),
    debug: (msg, meta) => writeLog('DEBUG', msg, meta)
};
