# 🚀 Setup Completo - iMavyAgent

## ✅ O que foi implementado

### 1. Migração Supabase ✅
- Todos os dados agora persistem no Supabase
- Strikes, palavras banidas, grupos, admins, lembretes, mensagens agendadas

### 2. Logs Administrativos ✅
- Tabela `admin_logs` para rastrear ações
- Funções `logAdminAction()` e `getAdminLogs()`

### 3. Backup Automático ✅
- Backup diário do Supabase às 3 AM
- Mantém últimos 7 backups em `backups_supabase/`

### 4. IA para Moderação ✅
- Integração com OpenAI GPT-4o-mini
- Detecta toxicidade, spam, discurso de ódio
- Funciona junto com anti-spam de palavras

### 5. Dashboard Web ✅
- Interface web para gerenciar bot
- Gerenciar palavras banidas e grupos
- Ver logs e estatísticas
- Autenticação com JWT

---

## 📋 Passo a Passo

### 1. Execute SQL no Supabase

```sql
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT,
    group_id TEXT,
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
```

### 2. Configure variáveis de ambiente

Adicione no `.env`:

```env
# OpenAI (opcional - para IA)
OPENAI_API_KEY=sk-proj-...

# Dashboard
DASHBOARD_PORT=3000
JWT_SECRET=mude-este-secret-123
ADMIN_PASSWORD=senha-segura-aqui
```

### 3. Instale dependências da IA

```bash
npm install openai
```

### 4. Instale dependências do Dashboard

```bash
cd dashboard
npm install
```

### 5. Inicie o bot

```bash
node index.js
```

### 6. Inicie o Dashboard (em outro terminal)

```bash
cd dashboard
npm start
```

Acesse: http://localhost:3000

---

## 🤖 Como usar a IA

A IA analisa automaticamente mensagens em grupos quando:
- `OPENAI_API_KEY` está configurada
- Mensagem tem mais de 10 caracteres
- Detecta: toxicidade, spam, ódio, conteúdo sexual, violência

**Custo**: ~$0.15 por 1000 mensagens

**Desabilitar**: Remova `OPENAI_API_KEY` do `.env`

---

## 🖥️ Como usar o Dashboard

1. Acesse http://localhost:3000
2. Digite a senha (padrão: `admin123`)
3. Gerencie:
   - Palavras banidas
   - Grupos permitidos
   - Ver logs de ações

**Mudar senha**: Altere `ADMIN_PASSWORD` no `.env`

---

## 📊 Estrutura de Arquivos

```
BOT iMAVY (2)/
├── functions/
│   ├── database.js          # Supabase
│   ├── aiModeration.js      # IA moderação
│   ├── supabaseBackup.js    # Backup automático
│   └── ...
├── dashboard/
│   ├── server.js            # API REST
│   ├── public/
│   │   └── index.html       # Interface web
│   └── package.json
├── backups_supabase/        # Backups diários
├── index.js                 # Bot principal
└── .env                     # Configurações
```

---

## 🔥 Próximos Passos

1. ✅ Execute o SQL no Supabase
2. ✅ Configure `.env` com OpenAI e Dashboard
3. ✅ Instale dependências: `npm install openai`
4. ✅ Instale dashboard: `cd dashboard && npm install`
5. ✅ Inicie bot: `node index.js`
6. ✅ Inicie dashboard: `cd dashboard && npm start`

---

## 💰 Custos

- **Supabase**: Grátis (até 500MB)
- **OpenAI**: ~$5-10/mês (opcional)
- **Railway**: $5/mês
- **Total**: ~$5-15/mês

---

## 🆘 Problemas?

**IA não funciona**: Verifique `OPENAI_API_KEY` no `.env`

**Dashboard não abre**: Verifique se porta 3000 está livre

**Backup não cria**: Aguarde até 3 AM ou chame `backupSupabase()` manualmente

**Dados não salvam**: Verifique conexão com Supabase
