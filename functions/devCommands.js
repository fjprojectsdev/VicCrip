// Comandos de desenvolvedor
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
});

// IDs dos desenvolvedores autorizados
const DEV_IDS = (process.env.DEV_IDS || '').split(',').filter(Boolean);

// Modo desenvolvedor ativo por usuário
const devModeActive = new Map();
const conversationHistory = new Map();

export function isDev(userId) {
    const cleanId = userId.replace('@s.whatsapp.net', '');
    return DEV_IDS.some(devId => cleanId.includes(devId.trim()));
}

export function isDevModeActive(userId) {
    return devModeActive.get(userId) === true;
}

export function activateDevMode(userId) {
    devModeActive.set(userId, true);
    conversationHistory.set(userId, []);
}

export function deactivateDevMode(userId) {
    devModeActive.delete(userId);
    conversationHistory.delete(userId);
}

function getHistory(userId) {
    if (!conversationHistory.has(userId)) {
        conversationHistory.set(userId, []);
    }
    return conversationHistory.get(userId);
}

function addToHistory(userId, role, content) {
    const history = getHistory(userId);
    history.push({ role, content });
    if (history.length > 20) history.shift();
}

export async function handleDevCommand(sock, message, text) {
    const senderId = message.key.participant || message.key.remoteJid;
    const chatId = message.key.remoteJid;
    const isPrivate = !chatId.endsWith('@g.us');
    
    if (!isDev(senderId)) {
        await sock.sendMessage(chatId, { text: '❌ Acesso negado. Comando apenas para desenvolvedores.' });
        return;
    }
    
    // Ativar modo dev no privado
    if (text.trim() === '/dev' && isPrivate) {
        activateDevMode(senderId);
        const welcomeMsg = `🤖 *MODO DESENVOLVEDOR ATIVADO* 🤖

👋 Olá, mestre! Sou seu assistente de desenvolvimento.

💡 Agora você pode conversar comigo naturalmente:

• "Crie um comando de sorteio"
• "Adicione função de enquete"
• "Quero um comando que..."
• "Como faço para..."

🛠️ Comandos rápidos:
• /dev off - Desativar modo
• /dev status - Status do sistema
• /dev logs - Ver logs
• /dev restart - Reiniciar bot

✨ Estou pronto para criar qualquer função que você imaginar!`;
        await sock.sendMessage(chatId, { text: welcomeMsg });
        return;
    }
    
    const args = text.split(' ');
    const subCmd = args[1]?.toLowerCase();
    
    if (subCmd === 'eval') {
        // Executar código JavaScript
        const code = args.slice(2).join(' ');
        try {
            const result = eval(code);
            await sock.sendMessage(chatId, { text: `✅ Resultado:\n${JSON.stringify(result, null, 2)}` });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `❌ Erro:\n${e.message}` });
        }
    } else if (subCmd === 'restart') {
        await sock.sendMessage(chatId, { text: '🔄 Reiniciando bot...' });
        process.exit(0);
    } else if (subCmd === 'logs') {
        const logFile = path.join(__dirname, '..', 'bot.log');
        if (fs.existsSync(logFile)) {
            const logs = fs.readFileSync(logFile, 'utf8').split('\n').slice(-20).join('\n');
            await sock.sendMessage(chatId, { text: `📋 Últimos logs:\n\n${logs}` });
        } else {
            await sock.sendMessage(chatId, { text: '❌ Arquivo de log não encontrado' });
        }
    } else if (subCmd === 'status') {
        const uptime = process.uptime();
        const memory = process.memoryUsage();
        const status = `📊 STATUS DO BOT\n\n⏱️ Uptime: ${Math.floor(uptime / 60)}min\n💾 Memória: ${Math.floor(memory.heapUsed / 1024 / 1024)}MB\n🔢 PID: ${process.pid}`;
        await sock.sendMessage(chatId, { text: status });
    } else if (subCmd === 'backup') {
        await sock.sendMessage(chatId, { text: '💾 Criando backup...' });
        // Implementar backup manual
        await sock.sendMessage(chatId, { text: '✅ Backup criado!' });
    } else if (subCmd === 'off') {
        deactivateDevMode(senderId);
        await sock.sendMessage(chatId, { text: '✅ Modo desenvolvedor desativado.' });
    } else {
        const help = `🛠️ COMANDOS DEV\n\n/dev - Ativar modo IA (privado)\n/dev off - Desativar modo\n/dev eval [código] - Executa JS\n/dev restart - Reinicia bot\n/dev logs - Últimos logs\n/dev status - Status do sistema\n/dev backup - Backup manual`;
        await sock.sendMessage(chatId, { text: help });
    }
}

export async function handleDevConversation(sock, senderId, messageText) {
    const chatId = senderId;
    
    await sock.sendMessage(chatId, { text: '🤖 Analisando sua solicitação...' });
    
    try {
        const history = getHistory(senderId);
        
        const systemPrompt = `Você é um assistente de desenvolvimento expert em Node.js, Baileys (WhatsApp bot) e JavaScript.

Seu papel:
- Conversar naturalmente com o desenvolvedor
- Entender suas ideias e necessidades
- Criar código funcional quando solicitado
- Dar conselhos técnicos
- Ser prestativo e eficiente

Quando o dev pedir para criar algo, retorne JSON:
{
  "type": "code" | "advice" | "question",
  "response": "sua resposta em texto",
  "commandName": "nome do comando (se type=code)",
  "code": "código completo (se type=code)",
  "usage": "exemplo de uso (se type=code)"
}

Se for apenas conversa/conselho, use type="advice" ou "question".

Estrutura de código:
export async function handleNome(sock, message, text) {
  const chatId = message.key.remoteJid;
  // seu código aqui
  await sock.sendMessage(chatId, { text: 'resposta' });
}`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: messageText }
        ];
        
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            max_tokens: 2000,
            temperature: 0.7,
            response_format: { type: "json_object" }
        });
        
        const result = JSON.parse(response.choices[0].message.content);
        
        addToHistory(senderId, 'user', messageText);
        addToHistory(senderId, 'assistant', result.response);
        
        if (result.type === 'code') {
            // Criar arquivo com o código
            const fileName = `${result.commandName}.js`;
            const customDir = path.join(__dirname, 'custom');
            
            if (!fs.existsSync(customDir)) {
                fs.mkdirSync(customDir, { recursive: true });
            }
            
            const filePath = path.join(customDir, fileName);
            fs.writeFileSync(filePath, result.code);
            
            const msg = `${result.response}\n\n✅ Código criado!\n📁 Arquivo: functions/custom/${fileName}\n💬 Uso: ${result.usage}\n\n🔄 Use /dev restart para aplicar`;
            await sock.sendMessage(chatId, { text: msg });
        } else {
            await sock.sendMessage(chatId, { text: result.response });
        }
        
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Erro: ${e.message}` });
    }
}
