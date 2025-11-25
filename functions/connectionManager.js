// connectionManager.js - Gerenciador de conexão robusto
import { DisconnectReason } from "@whiskeysockets/baileys";

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAYS = [3000, 5000, 10000, 15000, 30000]; // Delays progressivos

export function getReconnectDelay() {
    const index = Math.min(reconnectAttempts, RECONNECT_DELAYS.length - 1);
    return RECONNECT_DELAYS[index];
}

export function incrementReconnectAttempts() {
    reconnectAttempts++;
    return reconnectAttempts;
}

export function resetReconnectAttempts() {
    reconnectAttempts = 0;
}

export function shouldReconnect(reason) {
    // Não reconectar se foi logout manual
    if (reason === DisconnectReason.loggedOut) {
        return false;
    }
    
    // Reconectar para outros casos
    return reconnectAttempts < MAX_RECONNECT_ATTEMPTS;
}

export function getDisconnectReasonName(reason) {
    const reasons = {
        [DisconnectReason.badSession]: 'Sessão inválida',
        [DisconnectReason.connectionClosed]: 'Conexão fechada',
        [DisconnectReason.connectionLost]: 'Conexão perdida',
        [DisconnectReason.connectionReplaced]: 'Conexão substituída',
        [DisconnectReason.loggedOut]: 'Logout manual',
        [DisconnectReason.restartRequired]: 'Reinício necessário',
        [DisconnectReason.timedOut]: 'Timeout',
        [DisconnectReason.unavailableService]: 'Serviço indisponível'
    };
    
    return reasons[reason] || `Desconhecido (${reason})`;
}

export function handleConnectionUpdate(update, startBotCallback) {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'open') {
        console.log('✅ Conectado com sucesso ao WhatsApp!');
        resetReconnectAttempts();
        return { status: 'connected' };
    }
    
    if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode;
        const reasonName = getDisconnectReasonName(reason);
        
        console.log(`❌ Conexão fechada: ${reasonName}`);
        
        if (reason === DisconnectReason.loggedOut) {
            console.log('⚠️ Logout detectado. Será necessário escanear QR code novamente.');
            return { status: 'logged_out', needsQR: true };
        }
        
        if (shouldReconnect(reason)) {
            const attempts = incrementReconnectAttempts();
            const delay = getReconnectDelay();
            
            console.log(`🔄 Tentativa de reconexão ${attempts}/${MAX_RECONNECT_ATTEMPTS} em ${delay/1000}s...`);
            
            setTimeout(() => {
                startBotCallback();
            }, delay);
            
            return { status: 'reconnecting', attempts, delay };
        } else {
            console.log('❌ Máximo de tentativas de reconexão atingido.');
            return { status: 'failed', reason: 'max_attempts' };
        }
    }
    
    return { status: connection };
}
