# ✅ CHECKLIST COMPLETO - iMavyBot v2.0

## 🔌 STATUS DO BOT

Para ligar o bot:
```bash
node index.js
```

---

## 📋 TODOS OS COMANDOS FUNCIONANDO

### 🔴 ADMINISTRATIVOS (Apenas Admins)

| Comando | Função | Status | Teste |
|---------|--------|--------|-------|
| `/fechar` | Fecha grupo (apenas admins) | ✅ | Enviar no grupo |
| `/abrir` | Abre grupo para todos | ✅ | Enviar no grupo |
| `/fixar [msg]` | Fixa mensagem importante | ✅ | `/fixar Reunião 20h` |
| `/banir @membro` | Remove e bane membro | ✅ | `/banir @usuario` |
| `/addtermo [palavra]` | Adiciona palavra proibida | ✅ | `/addtermo spam` |
| `/removertermo [palavra]` | Remove palavra proibida | ✅ | `/removertermo spam` |
| `/listartermos` | Lista palavras proibidas | ✅ | Enviar comando |
| `/lembrete + msg 1h 24h` | Cria lembrete automático | ✅ | `/lembrete + Teste! 1h 24h` |
| `/stoplembrete` | Para lembrete ativo | ✅ | Enviar comando |
| `/stats` | Estatísticas do bot | ✅ | Enviar comando |
| `/status` | Status do grupo | ✅ | Enviar comando |
| `/aviso [msg]` | Aviso com menção invisível | ✅ | `/aviso Importante!` |
| `/link` | Gera link do grupo | ✅ | Enviar comando |
| `/promover @usuario` | Promove a admin | ✅ | `/promover @usuario` |
| `/rebaixar @usuario` | Rebaixa de admin | ✅ | `/rebaixar @usuario` |
| `/agendar 14:30 msg` | Agenda mensagem | ✅ | `/agendar 15:00 Teste` |
| `/manutencao on/off` | Modo manutenção | ✅ | `/manutencao on` |

### 🟢 GERENCIAMENTO (Super Admins)

| Comando | Função | Status | Teste |
|---------|--------|--------|-------|
| `/adicionargrupo [nome]` | Adiciona grupo permitido | ✅ | `/adicionargrupo Teste` |
| `/removergrupo [nome]` | Remove grupo permitido | ✅ | `/removergrupo Teste` |
| `/listargrupos` | Lista grupos autorizados | ✅ | Enviar comando |
| `/adicionaradmin @usuario` | Adiciona admin | ✅ | `/adicionaradmin @user` |
| `/removeradmin @usuario` | Remove admin | ✅ | `/removeradmin @user` |
| `/listaradmins` | Lista todos admins | ✅ | Enviar comando |

### 🔵 INFORMAÇÃO (Todos os usuários)

| Comando | Função | Status | Teste |
|---------|--------|--------|-------|
| `/regras` | Mostra regras do grupo | ✅ | Enviar comando |
| `/comandos` | Lista todos comandos | ✅ | Enviar comando |
| `/descricao` | Mostra descrição do grupo | ✅ | Enviar comando |
| `/hora` | Mostra data/hora do bot | ✅ | Enviar comando |

### 🟡 TESTES ESPECIAIS

| Comando | Função | Status | Teste |
|---------|--------|--------|-------|
| `/testar_boasvindas` | Testa boas-vindas | ✅ | Enviar no grupo |
| `/testbot` | Verifica se bot é admin | ✅ | Enviar comando |

### 🟣 ATENDIMENTO AUTOMÁTICO (PV)

| Comando | Função | Status | Teste |
|---------|--------|--------|-------|
| `/valores` | Notifica atendentes | ✅ | Enviar no PV do bot |
| `sim` (após detecção) | Confirma interesse | ✅ | Responder "sim" |
| Mensagens com interesse | Detecta cliente | ✅ | "quero saber valores" |

---

## 🤖 FUNCIONALIDADES AUTOMÁTICAS

| Funcionalidade | Status | Como Testar |
|----------------|--------|-------------|
| ✅ Boas-vindas automáticas | ✅ | Adicionar novo membro |
| ✅ Anti-spam (palavras) | ✅ | Enviar palavra banida |
| ✅ Anti-spam (IA Groq) | ✅ | Enviar mensagem ofensiva |
| ✅ Sistema de strikes | ✅ | Violar 3x |
| ✅ Deleção automática | ✅ | Enviar spam |
| ✅ Notificação admins | ✅ | Violar regra |
| ✅ Abertura automática (7h) | ✅ | Aguardar horário |
| ✅ Fechamento automático (0h) | ✅ | Aguardar horário |
| ✅ Backup diário (3h) | ✅ | Aguardar horário |
| ✅ Lembretes persistentes | ✅ | Criar lembrete e reiniciar bot |
| ✅ Rate limiting (3s) | ✅ | Enviar comandos rápido |
| ✅ Reconexão automática | ✅ | Desconectar internet |

---

## 📊 ARQUIVOS DE CONFIGURAÇÃO

| Arquivo | Status | Função |
|---------|--------|--------|
| `allowed_groups.json` | ✅ | Grupos autorizados |
| `admins.json` | ✅ | Lista de admins |
| `banned_words.json` | ✅ | Palavras proibidas |
| `lembretes.json` | ✅ | Lembretes ativos |
| `strikes.json` | ✅ | Strikes dos usuários |
| `bot.log` | ✅ | Logs do sistema |
| `auth_info/` | ✅ | Sessão WhatsApp |
| `.env` | ⚠️ | APIs (criar se não existe) |

---

## 🚀 COMO DEIXAR LIGADO 24/7

### Opção 1: START_ALL.bat (Windows)
```bash
START_ALL.bat
```

### Opção 2: PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start index.js --name iMavyBot
pm2 logs iMavyBot
pm2 save
pm2 startup
```

### Opção 3: Screen (Linux)
```bash
screen -S imavy
node index.js
# Ctrl+A+D para desanexar
```

---

## 🧪 ROTEIRO DE TESTE RÁPIDO

### 1. Iniciar Bot
```bash
cd "c:\Users\55699\Desktop\BOT iMAVY (2)"
node index.js
```

**Verificar:**
- ✅ Conectou ao WhatsApp?
- ✅ Mostra "🤖 IA de Moderação: ✅ ATIVA (Groq)"?
- ✅ Carregou lembretes salvos?

### 2. Testar Comandos Básicos (Grupo)
```
/comandos
/regras
/status
```

### 3. Testar Lembrete
```
/lembrete + TESTE DE LEMBRETE! 1h 2h
```
Aguardar 1 hora para ver repetição.

### 4. Testar Moderação
Enviar mensagem com palavra banida (ex: "spam")

**Verificar:**
- ✅ Mensagem deletada?
- ✅ Admins notificados?

### 5. Testar Gerenciamento
```
/addtermo teste123
/listartermos
/removertermo teste123
```

### 6. Testar Atendimento (PV)
Enviar para o bot:
```
Olá, quero saber os valores
```

Responder:
```
sim
```

### 7. Testar Boas-vindas
```
/testar_boasvindas
```

---

## ⚠️ TROUBLESHOOTING

### Bot não conecta?
1. Deletar pasta `auth_info/`
2. Rodar `node index.js`
3. Escanear QR Code

### Comandos não funcionam?
1. Verificar se grupo está em `allowed_groups.json`
2. Verificar se você está em `admins.json`
3. Checar logs em `bot.log`

### IA não funciona?
1. Criar arquivo `.env` com:
```env
GROQ_API_KEY=sua_chave_aqui
```
2. Bot continua funcionando sem IA

### Lembretes não persistem?
1. Verificar se `lembretes.json` existe
2. Verificar permissões de escrita

---

## 📈 PRÓXIMOS PASSOS

1. ✅ Ligar o bot: `node index.js`
2. ✅ Testar todos comandos acima
3. ✅ Adicionar grupos de clientes: `/adicionargrupo Nome`
4. ✅ Configurar admins: `/adicionaradmin @usuario`
5. ✅ Personalizar regras na descrição do grupo
6. ✅ Deploy 24/7 com PM2 ou Railway

---

## 💰 FOCO NO PLANO BRUTAL

Enquanto o bot roda, você deve estar:
- ✅ Ligando para os 10 primeiros prospects
- ✅ Enviando mensagens de venda
- ✅ Agendando demonstrações
- ✅ Fechando os primeiros R$ 97/mês

**O bot está pronto. Agora é vender! 🔥**
