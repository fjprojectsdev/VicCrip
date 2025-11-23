// Script para criar grupo de demonstração do iMavyBot
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function criarGrupoDemo() {
    console.log('🚀 Iniciando criação do grupo de demonstração...\n');
    
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔄 Reconectando...');
                setTimeout(() => criarGrupoDemo(), 3000);
            }
        }
        
        if (connection === 'open') {
            console.log('✅ Conectado ao WhatsApp!\n');
            
            try {
                // Carregar admins
                const adminsPath = path.join(__dirname, 'admins.json');
                let admins = [];
                
                if (fs.existsSync(adminsPath)) {
                    const data = JSON.parse(fs.readFileSync(adminsPath, 'utf8'));
                    admins = data.admins || [];
                }
                
                // Adicionar número do bot
                const botNumber = sock.user.id.split(':')[0];
                
                // Formatar números para JID
                const participantes = admins
                    .map(admin => {
                        const num = admin.replace(/\D/g, '');
                        return `${num}@s.whatsapp.net`;
                    })
                    .filter(jid => !jid.startsWith(botNumber)); // Não adicionar o próprio bot
                
                if (participantes.length === 0) {
                    console.log('❌ Nenhum admin encontrado em admins.json');
                    console.log('💡 Adicione admins primeiro com: /adicionaradmin @usuario\n');
                    process.exit(0);
                }
                
                console.log(`📋 Admins encontrados: ${participantes.length}`);
                console.log(`👥 Participantes: ${participantes.join(', ')}\n`);
                
                // Criar grupo
                const nomeGrupo = '🤖 iMavyBot - DEMONSTRAÇÃO AO VIVO';
                const descricao = `🎯 GRUPO DE DEMONSTRAÇÃO - iMavyBot

⚡ Veja o bot funcionando AO VIVO:

✅ Anti-spam automático
✅ Sistema de strikes
✅ Lembretes automáticos
✅ Comandos administrativos
✅ Moderação 24/7

💰 Investimento: R$ 97/mês por grupo
🎁 7 dias GRÁTIS para testar

📱 Para contratar: /valores

━━━━━━━━━━━━━━━━
iMavyBot - Moderação Inteligente`;
                
                console.log('🔨 Criando grupo...');
                const grupo = await sock.groupCreate(nomeGrupo, participantes);
                
                console.log(`✅ Grupo criado com sucesso!`);
                console.log(`🆔 ID: ${grupo.id}`);
                console.log(`👥 Participantes: ${grupo.participants.length}\n`);
                
                // Aguardar 2 segundos
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Definir descrição
                console.log('📝 Definindo descrição...');
                await sock.groupUpdateDescription(grupo.id, descricao);
                console.log('✅ Descrição definida!\n');
                
                // Aguardar 2 segundos
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Adicionar grupo aos grupos permitidos
                const allowedPath = path.join(__dirname, 'allowed_groups.json');
                let allowedGroups = [];
                
                if (fs.existsSync(allowedPath)) {
                    allowedGroups = JSON.parse(fs.readFileSync(allowedPath, 'utf8'));
                }
                
                if (!allowedGroups.includes(nomeGrupo)) {
                    allowedGroups.push(nomeGrupo);
                    fs.writeFileSync(allowedPath, JSON.stringify(allowedGroups, null, 2));
                    console.log('✅ Grupo adicionado à lista de grupos permitidos!\n');
                }
                
                // Enviar mensagem de boas-vindas
                const msgBoasVindas = `🎉 *BEM-VINDOS AO GRUPO DE DEMONSTRAÇÃO!*

🤖 Eu sou o *iMavyBot* e vou mostrar como funciono!

⚡ *TESTE AGORA:*

1️⃣ Digite: \`/comandos\` - Ver todos comandos
2️⃣ Digite: \`/status\` - Ver status do grupo
3️⃣ Digite: \`/regras\` - Ver regras
4️⃣ Envie a palavra "spam" - Ver moderação automática
5️⃣ Digite: \`/lembrete + TESTE! 1m 2m\` - Ver lembretes

💡 *PARA PROSPECTS:*
Adicione seus clientes interessados aqui para verem o bot funcionando AO VIVO!

💰 *INVESTIMENTO:*
R$ 97/mês por grupo (menos de R$ 3/dia)

🎁 *BÔNUS:*
7 dias GRÁTIS para testar no seu grupo!

📱 *CONTRATAR:*
Digite \`/valores\` e entraremos em contato!

━━━━━━━━━━━━━━━━
_iMavyBot - Moderação Inteligente 24/7_`;
                
                await sock.sendMessage(grupo.id, { text: msgBoasVindas });
                console.log('✅ Mensagem de boas-vindas enviada!\n');
                
                // Aguardar 2 segundos
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Enviar link do grupo
                const inviteCode = await sock.groupInviteCode(grupo.id);
                const link = `https://chat.whatsapp.com/${inviteCode}`;
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🎉 GRUPO DE DEMONSTRAÇÃO CRIADO COM SUCESSO!');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                console.log(`📱 Nome: ${nomeGrupo}`);
                console.log(`🆔 ID: ${grupo.id}`);
                console.log(`🔗 Link: ${link}\n`);
                console.log('💡 PRÓXIMOS PASSOS:\n');
                console.log('1. Compartilhe o link com prospects');
                console.log('2. Deixe eles testarem os comandos');
                console.log('3. Mostre a moderação automática funcionando');
                console.log('4. Feche a venda! 💰\n');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                
                // Salvar link em arquivo
                const linkPath = path.join(__dirname, 'LINK_GRUPO_DEMO.txt');
                fs.writeFileSync(linkPath, `GRUPO DE DEMONSTRAÇÃO - iMavyBot\n\nLink: ${link}\n\nCompartilhe este link com seus prospects!`);
                console.log(`✅ Link salvo em: LINK_GRUPO_DEMO.txt\n`);
                
                process.exit(0);
                
            } catch (error) {
                console.error('❌ Erro ao criar grupo:', error);
                process.exit(1);
            }
        }
    });
}

criarGrupoDemo();
