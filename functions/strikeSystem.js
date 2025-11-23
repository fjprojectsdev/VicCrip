// Sistema de Strikes e Moderação Automática
// 1 strike = Aviso
// 2 strikes = Aviso severo (última chance)
// 3 strikes = Expulsão automática

import { getUserName } from './userInfo.js';
import * as db from './database.js';

export async function addStrike(userId, violation) {
    return await db.addStrike(userId, violation);
}

export async function getStrikes(userId) {
    const data = await db.getStrikes(userId);
    return data.count || 0;
}

export async function resetStrikes(userId) {
    await db.resetStrikes(userId);
}

export async function applyPunishment(sock, groupId, userId) {
    const strikeCount = await getStrikes(userId);
    const userNumber = userId.split('@')[0];
    const userName = await getUserName(sock, userId, groupId);
    
    try {
        if (strikeCount === 1) {
            // 1ª violação: Aviso
            const avisoMsg = `⚠️ *PRIMEIRO AVISO* ⚠️

@${userNumber}, você recebeu seu primeiro aviso por violar as regras do grupo.

> 📌 Strikes: 1/3
> ⚠️ Não viole regras
> 🚫 3 violações: Expulsão automática do grupo

🛂 *Por favor, respeite as regras!*`;

            await sock.sendMessage(groupId, { 
                text: avisoMsg,
                mentions: [userId]
            });

            console.log(`⚠️ Strike 1/3 aplicado para ${userNumber}`);

        } else if (strikeCount === 2) {
            // 2ª violação: Aviso severo
            const avisoMsg = `🚨 *SEGUNDO AVISO - ÚLTIMA CHANCE* 🚨

@${userNumber}, você recebeu seu segundo aviso!

📌 *Strikes:* 2/3
⚠️ *Próxima violação:* EXPULSÃO AUTOMÁTICA DO GRUPO
🚫 *Esta é sua última chance!*

Respeite as regras ou será removido permanentemente!`;

            await sock.sendMessage(groupId, { 
                text: avisoMsg,
                mentions: [userId]
            });
            
            console.log(`🚨 Strike 2/3 aplicado para ${userNumber} - ÚLTIMA CHANCE`);
            
        } else if (strikeCount >= 3) {
            // 3ª violação: Expulsão
            const avisoMsg = `🚫 *EXPULSÃO AUTOMÁTICA* 🚫

@${userNumber} foi expulso do grupo por acumular 3 violações.

📌 *Strikes:* 3/3
⚠️ *Motivo:* Múltiplas violações das regras
🚫 *Ação:* Expulsão permanente

As regras existem para manter a ordem do grupo!`;

            await sock.sendMessage(groupId, { 
                text: avisoMsg,
                mentions: [userId]
            });
            
            // Remover do grupo
            await sock.groupParticipantsUpdate(groupId, [userId], 'remove');
            
            console.log(`🚫 Strike 3/3 aplicado para ${userNumber} - EXPULSO`);
            
            // Resetar strikes após expulsão
            resetStrikes(userId);
        }
        
    } catch (error) {
        console.error('❌ Erro ao aplicar punição:', error.message);
    }
}

export async function getViolationHistory(userId) {
    const data = await db.getStrikes(userId);
    return data.violations || [];
}
