# Roadmap de Funcionalidades Avançadas

## ✅ Implementado

### 1. Migração Supabase
- ✅ Strikes
- ✅ Banned Words
- ✅ Allowed Groups
- ✅ Admins
- ✅ Lembretes
- ✅ Scheduled Messages
- ✅ Admin Logs

### 3. Logs de Ações Administrativas
- ✅ Tabela `admin_logs` criada
- ✅ Funções `logAdminAction()` e `getAdminLogs()`
- ⚠️ **Pendente**: Integrar logs em todos os comandos administrativos

### 7. Backup Automático Supabase
- ✅ Backup diário às 3 AM
- ✅ Mantém últimos 7 backups
- ✅ Export completo para JSON

---

## 🚧 A Implementar

### 11. IA para Moderação (OpenAI/Claude)

**Objetivo**: Detectar toxicidade, spam e conteúdo inadequado usando IA

**Implementação**:
```javascript
// functions/aiModeration.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeMessage(text) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "system",
            content: "Você é um moderador de grupos. Analise se a mensagem contém: toxicidade, spam, discurso de ódio, conteúdo sexual ou violência. Responda apenas: SAFE ou UNSAFE com motivo."
        }, {
            role: "user",
            content: text
        }],
        max_tokens: 50
    });
    
    const result = response.choices[0].message.content;
    return {
        safe: result.startsWith('SAFE'),
        reason: result
    };
}
```

**Custo estimado**: $0.15 por 1000 mensagens (GPT-4o-mini)

**Alternativa gratuita**: Usar Perspective API do Google (gratuito até 1M requests/dia)

---

### 12. Dashboard Web

**Objetivo**: Painel web para gerenciar bot sem WhatsApp

**Stack sugerida**:
- **Frontend**: Next.js + TailwindCSS
- **Backend**: API REST no próprio bot (Express.js)
- **Auth**: JWT com senha de admin
- **Deploy**: Vercel (frontend) + Railway (backend)

**Funcionalidades**:
- 📊 Estatísticas em tempo real
- 👥 Gerenciar admins e grupos
- 🚫 Gerenciar palavras banidas
- 📜 Ver logs de ações
- 📈 Gráficos de violações
- 💬 Enviar mensagens broadcast

**Estrutura**:
```
dashboard/
├── frontend/          # Next.js app
│   ├── pages/
│   │   ├── index.js   # Dashboard principal
│   │   ├── admins.js  # Gerenciar admins
│   │   ├── groups.js  # Gerenciar grupos
│   │   └── logs.js    # Ver logs
│   └── components/
└── api/               # Express API
    ├── auth.js
    ├── stats.js
    └── admin.js
```

**Tempo estimado**: 2-3 dias de desenvolvimento

---

### 13. Multi-idioma

**Objetivo**: Detectar idioma do grupo e adaptar mensagens

**Implementação**:
```javascript
// functions/i18n.js
const translations = {
    pt: {
        welcome: "👋 Bem-vindo ao grupo!",
        rules: "📋 Regras do Grupo",
        banned: "🚫 Você foi banido por violar as regras"
    },
    en: {
        welcome: "👋 Welcome to the group!",
        rules: "📋 Group Rules",
        banned: "🚫 You were banned for violating the rules"
    },
    es: {
        welcome: "👋 ¡Bienvenido al grupo!",
        rules: "📋 Reglas del Grupo",
        banned: "🚫 Fuiste expulsado por violar las reglas"
    }
};

export function detectLanguage(text) {
    // Usar biblioteca 'franc' para detectar idioma
    const lang = franc(text);
    return lang === 'por' ? 'pt' : lang === 'spa' ? 'es' : 'en';
}

export function t(key, lang = 'pt') {
    return translations[lang]?.[key] || translations.pt[key];
}
```

**Bibliotecas necessárias**:
- `franc` - Detecção de idioma
- `i18next` - Gerenciamento de traduções

---

## 📋 Prioridades Recomendadas

1. **Integrar logs em comandos** (1 hora)
2. **IA para moderação** (2 horas)
3. **Multi-idioma** (3 horas)
4. **Dashboard web** (2-3 dias)

---

## 💰 Custos Mensais Estimados

- Supabase: **Grátis** (até 500MB)
- OpenAI GPT-4o-mini: **~$5-10/mês** (depende do volume)
- Railway: **$5/mês** (com $5 grátis)
- Vercel: **Grátis**

**Total**: ~$10-15/mês

---

## 🚀 Próximos Passos

1. Execute o SQL em `SUPABASE_UPDATE.sql` para criar tabela de logs
2. Integre `scheduleSupabaseBackup()` no `index.js`
3. Escolha qual funcionalidade implementar primeiro
4. Configure variáveis de ambiente necessárias

**Quer que eu implemente alguma dessas agora?**
