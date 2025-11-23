# 🧪 TESTE COMPLETO - iMavyBot v2.0

## ✅ FUNCIONALIDADES ATIVAS

### 🔐 Sistema de Autenticação
- ✅ Auth WhatsApp com QR Code
- ✅ Reconexão automática
- ✅ Sessão persistente em `auth_info/`

### 🤖 IA de Moderação
- ✅ Groq API (gratuita e rápida)
- ✅ Detecção automática de spam/ofensas
- ✅ Análise inteligente de mensagens

### 👥 Sistema de Grupos
- ✅ Lista de grupos autorizados (`allowed_groups.json`)
- ✅ Apenas processa mensagens de grupos permitidos
- ✅ Boas-vindas automáticas para novos membros

### 🚨 Anti-Spam & Moderação
- ✅ Detecção de palavras banidas (`banned_words.json`)
- ✅ Sistema de strikes (3 strikes = ban)
- ✅ Deleção automática de mensagens violadoras
- ✅ Notificação para admins

### ⏰ Sistema de Lembretes
- ✅ Formato: `/lembrete + mensagem 1h 24h`
- ✅ Encerramento automático após tempo
- ✅ Menções invisíveis
- ✅ Persistência em `lembretes.json`

### 📱 Atendimento Automático (PV)
- ✅ Detecção de interesse do cliente
- ✅ Comando `/valores` notifica atendentes
- ✅ Verificação automática

### 🔧 Backup & Logs
- ✅ Backup automático diário (3h da manhã)
- ✅ Logs estruturados em `bot.log`
- ✅ Backup Supabase configurado

---

## 📋 COMANDOS PARA TESTAR

### 🔴 ADMINISTRATIVOS (Apenas Admins)

#### Gerenciamento de Grupo
```
/fechar - Fecha o grupo (apenas admins podem enviar)
/abrir - Abre o grupo para todos
/fixar [mensagem] - Fixa mensagem no grupo
/banir @membro - Remove e bane membro
```

#### Moderação
```
/addtermo [palavra] - Adiciona palavra proibida
/removertermo [palavra] - Remove palavra proibida
/listartermos - Lista todas palavras proibidas
```

#### Lembretes
```
/lembrete + Reunião importante! 1h 24h
/stoplembrete - Para lembrete ativo
```

#### Estatísticas
```
/stats - Mostra estatísticas do bot
/status - Status atual do grupo
```

### 🟢 GERENCIAMENTO (Super Admins)

```
/adicionargrupo [nome] - Adiciona grupo à lista permitida
/removergrupo [nome] - Remove grupo da lista
/listargrupos - Lista grupos autorizados

/adicionaradmin @usuario - Adiciona admin
/removeradmin @usuario - Remove admin
/listaradmins - Lista todos admins
```

### 🔵 INFORMAÇÃO (Todos)

```
/regras - Mostra regras do grupo
/comandos - Lista todos comandos disponíveis
/ajuda - Ajuda geral
```

### 🟡 TESTES ESPECIAIS

```
/testar_boasvindas - Testa mensagem de boas-vindas
```

---

## 🧪 ROTEIRO DE TESTE

### 1️⃣ INICIAR BOT
```bash
node index.js
```

**Verificar:**
- ✅ Conectou ao WhatsApp?
- ✅ Apareceu "🤖 IA de Moderação: ✅ ATIVA (Groq)"?
- ✅ Logs mostram grupos autorizados?

### 2️⃣ TESTAR COMANDOS BÁSICOS (no grupo autorizado)

```
/comandos
/regras
/status
```

### 3️⃣ TESTAR MODERAÇÃO

Enviar mensagem com palavra banida (ex: "spam")
**Verificar:**
- ✅ Mensagem foi deletada?
- ✅ Admins foram notificados?
- ✅ Strike foi registrado?

### 4️⃣ TESTAR LEMBRETES

```
/lembrete + Teste de lembrete! 1m 5m
```

**Verificar:**
- ✅ Confirmação enviada?
- ✅ Lembrete disparou após 1 minuto?
- ✅ Lembrete disparou após 5 minutos?
- ✅ Sistema encerrou automaticamente?

### 5️⃣ TESTAR GERENCIAMENTO

```
/addtermo teste123
/listartermos
/removertermo teste123
```

### 6️⃣ TESTAR BOAS-VINDAS

```
/testar_boasvindas
```

Ou adicionar novo membro ao grupo.

### 7️⃣ TESTAR ATENDIMENTO (PV)

Enviar mensagem privada para o bot:
```
Olá, quero saber os valores
```

**Verificar:**
- ✅ Bot detectou interesse?
- ✅ Enviou mensagem de verificação?

Responder:
```
sim
```

**Verificar:**
- ✅ Bot enviou informações de atendimento?

### 8️⃣ TESTAR COMANDO /valores (PV)

```
/valores
```

**Verificar:**
- ✅ Confirmação enviada?
- ✅ Atendentes foram notificados?

---

## 📊 ARQUIVOS DE CONFIGURAÇÃO

### Verificar se existem:
- ✅ `allowed_groups.json` - Grupos autorizados
- ✅ `admins.json` - Lista de admins
- ✅ `banned_words.json` - Palavras proibidas
- ✅ `lembretes.json` - Lembretes ativos
- ✅ `strikes.json` - Strikes dos usuários
- ✅ `bot.log` - Logs do sistema

---

## 🚀 PARA DEIXAR LIGADO 24/7

### Opção 1: Windows (Simples)
```bash
START_ALL.bat
```

### Opção 2: PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start index.js --name iMavyBot
pm2 save
pm2 startup
```

### Opção 3: Railway/Heroku (Cloud)
- Push para repositório Git
- Deploy automático

---

## ⚠️ TROUBLESHOOTING

### Bot desconecta?
1. Verificar se WhatsApp Web está ativo em outro lugar
2. Deletar pasta `auth_info/` e reconectar
3. Verificar internet

### Comandos não funcionam?
1. Verificar se grupo está em `allowed_groups.json`
2. Verificar se usuário está em `admins.json`
3. Checar logs em `bot.log`

### IA não funciona?
1. Verificar chave Groq no `.env`
2. Bot continua funcionando sem IA (apenas palavras banidas)

---

## 📈 PRÓXIMOS PASSOS

1. ✅ Testar todos comandos
2. ✅ Adicionar grupos de clientes
3. ✅ Configurar admins
4. ✅ Personalizar mensagens
5. ✅ Deploy em servidor 24/7
