# 🚀 Guia de Deploy - Bot WhatsApp iMavyAgent

## ⚠️ PROBLEMA RESOLVIDO: Bot pedia QR code após alguns minutos

### O que foi corrigido:

1. **Sistema de Reconexão Robusto**
   - Implementado gerenciador de conexão com tentativas progressivas
   - Delays inteligentes: 3s → 5s → 10s → 15s → 30s
   - Máximo de 10 tentativas antes de falhar

2. **Persistência de Sessão Melhorada**
   - Backup automático da sessão a cada 30 minutos
   - Restauração automática do backup se necessário
   - Credenciais salvas em `auth_info/` (não deletar!)

3. **Monitor de Saúde (Keepalive)**
   - Heartbeat a cada 30 segundos
   - Detecção de travamento (5 min sem resposta)
   - Arquivo `.bot_status` com status em tempo real

4. **Configurações Otimizadas do Baileys**
   - `keepAliveIntervalMs: 30000` - Mantém conexão ativa
   - `connectTimeoutMs: 60000` - Timeout maior para conexões lentas
   - `markOnlineOnConnect: true` - Marca como online ao conectar
   - `maxMsgRetryCount: 5` - Mais tentativas de reenvio

## 📋 Pré-requisitos para Deploy

### Render.com ou Railway.app

1. **Conta criada** no serviço escolhido
2. **Repositório Git** com o código do bot
3. **Variáveis de ambiente** configuradas

## 🔧 Configuração no Render

### Passo 1: Criar Web Service

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `imavy-bot-whatsapp`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free (ou pago para melhor performance)

### Passo 2: Variáveis de Ambiente

Adicione no Render:

```env
# Bot
GRUPO_HORARIO_ABERTURA=07:00
GRUPO_HORARIO_FECHAMENTO=00:00
DDD_PADRAO=64
COMMAND_COOLDOWN=3

# APIs (opcional)
GROQ_API_KEY=your-groq-api-key
OPENROUTER_API_KEY=your-openrouter-api-key

# Produção
NODE_ENV=production
RAILWAY_ENVIRONMENT=true
```

### Passo 3: Deploy

1. Clique em "Create Web Service"
2. Aguarde o build completar
3. Acesse os logs para ver o QR code
4. **IMPORTANTE**: Copie o link base64 do QR code dos logs
5. Cole no navegador e escaneie com WhatsApp

### Passo 4: Manter Sessão Persistente

⚠️ **CRÍTICO**: O Render pode deletar arquivos após reiniciar!

**Solução**: Use Render Disk para persistir `auth_info/`

1. No dashboard do serviço, vá em "Disks"
2. Clique em "Add Disk"
3. Configure:
   - **Name**: `auth-storage`
   - **Mount Path**: `/opt/render/project/src/auth_info`
   - **Size**: 1 GB (suficiente)

Isso garante que a sessão não será perdida após reiniciar.

## 🔧 Configuração no Railway

### Passo 1: Criar Projeto

1. Acesse [Railway](https://railway.app/)
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório

### Passo 2: Variáveis de Ambiente

Adicione as mesmas variáveis do Render (acima)

### Passo 3: Deploy

1. Railway faz deploy automático
2. Acesse os logs: `railway logs`
3. Copie o link base64 do QR code
4. Cole no navegador e escaneie

### Passo 4: Persistência no Railway

Railway já persiste arquivos por padrão! ✅

A pasta `auth_info/` será mantida entre deploys.

## 📊 Monitoramento

### Verificar Status do Bot

1. **Logs em tempo real**:
   ```bash
   # Render
   Acesse: Dashboard → Logs
   
   # Railway
   railway logs --follow
   ```

2. **Arquivo de status**:
   - O bot cria `.bot_status` com heartbeat
   - Atualizado a cada 30 segundos

3. **Indicadores de saúde**:
   - ✅ `Conectado ao WhatsApp` - Bot online
   - 🔄 `Reconectando...` - Tentando reconectar
   - ❌ `Conexão fechada` - Desconectado

### Logs Importantes

```
✅ Conectado com sucesso ao WhatsApp!
💓 Monitor de saúde iniciado
💾 Backup automático de sessão iniciado
✅ Todos os serviços iniciados com sucesso
```

## 🔄 Reconexão Automática

O bot agora reconecta automaticamente em casos de:

- ✅ Perda de conexão de rede
- ✅ Timeout do servidor
- ✅ Reinício do serviço
- ✅ Erro temporário do WhatsApp

**NÃO reconecta em caso de**:
- ❌ Logout manual do WhatsApp Web
- ❌ Sessão expirada (precisa escanear QR novamente)

## 🆘 Troubleshooting

### Bot pede QR code após reiniciar

**Causa**: Sessão não foi persistida

**Solução**:
1. Configure Render Disk (Render) ou verifique volumes (Railway)
2. Certifique-se que `auth_info/` não está no `.gitignore`
3. Verifique se o backup automático está funcionando

### Bot desconecta após alguns minutos

**Causa**: Conexão instável ou timeout

**Solução**:
1. Verifique os logs para ver o motivo da desconexão
2. O bot deve reconectar automaticamente
3. Se não reconectar, verifique as variáveis de ambiente

### QR code não aparece nos logs

**Causa**: Logs muito longos ou formato incorreto

**Solução**:
1. Procure por "LINK BASE64 DO QR CODE" nos logs
2. Copie o link `data:image/png;base64,...`
3. Cole diretamente na barra de endereços do navegador

### Erro "EADDRINUSE" (porta em uso)

**Causa**: Porta já está sendo usada

**Solução**:
1. Render/Railway gerenciam portas automaticamente
2. Use `process.env.PORT` (já configurado)
3. Não force uma porta específica

## 📝 Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Render Disk ou Railway Volume configurado
- [ ] Deploy realizado com sucesso
- [ ] QR code escaneado
- [ ] Bot conectado (verificar logs)
- [ ] Teste de mensagem no grupo
- [ ] Backup automático funcionando

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. **Teste os comandos** no grupo
2. **Configure palavras banidas**: `/addtermo palavra`
3. **Adicione grupos permitidos**: `/adicionargrupo Nome do Grupo`
4. **Configure lembretes**: `/lembrete mensagem 1h 24h`
5. **Monitore os logs** regularmente

## 📞 Suporte

Se o bot continuar pedindo QR code após essas correções:

1. Verifique os logs completos
2. Confirme que `auth_info/` está sendo persistido
3. Teste localmente primeiro
4. Abra uma issue no GitHub com os logs

---

**Última atualização**: 2025-01-25
**Versão**: 2.0 (com persistência robusta)
