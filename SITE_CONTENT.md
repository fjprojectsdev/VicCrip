# 🤖 iMavyAgent - Conteúdo para Site

## 📝 Descrição Principal

**iMavyAgent** é um bot de WhatsApp inteligente e completo para automação e moderação de grupos. Com IA integrada, sistema de segurança avançado e mais de 40 comandos, ele transforma a gestão do seu grupo em algo simples e eficiente.

---

## ✨ Destaques

🤖 **IA Dupla**: Moderação automática + Atendimento de vendas
🛡️ **Anti-Spam Inteligente**: Detecta variações e spam com IA
⚡ **40+ Comandos**: Administração completa do grupo
🎯 **Sistema de Strikes**: 3 avisos antes da expulsão
📊 **Dashboard Web**: Painel de controle moderno
🔄 **Backup Automático**: Seus dados sempre seguros
⏰ **Lembretes Inteligentes**: Com encerramento automático
🎲 **Comandos Customizados**: Crie seus próprios comandos com IA

---

## 🚀 Funcionalidades Principais

### 🛡️ Segurança e Moderação
- Anti-spam com detecção de variações
- IA de moderação (Groq) para conteúdo impróprio
- Sistema de strikes (3 strikes = expulsão)
- Bloqueio de palavras proibidas personalizável
- Notificação automática aos administradores
- Rate limiting para evitar flood de comandos

### 💼 IA de Vendas (Exclusivo!)
- Qualificação automática de leads
- Respostas inteligentes e naturais
- Detecção de intenção de compra
- Notificação de leads quentes para atendentes
- Histórico de conversas
- Salvamento automático no banco de dados

### 👮 Administração
- Abertura/fechamento automático por horário
- Gerenciamento de membros (banir, promover, rebaixar)
- Fixar mensagens importantes
- Avisos com menção a todos
- Controle de grupos permitidos
- Sistema de permissões por admin

### ⏰ Automação
- Lembretes com repetição e encerramento automático
- Agendamento de mensagens
- Boas-vindas personalizadas
- Auto-promoção em múltiplos grupos
- Backup diário automático às 3h
- Sincronização com Supabase

### 🎮 Interatividade
- Comando de sorteio com participantes
- Sistema de enquetes (em breve)
- Quiz interativo (em breve)
- Comandos customizados via IA

### 🛠️ Modo Desenvolvedor
- Crie comandos conversando com IA
- Integração automática ao bot
- Execução de código JavaScript
- Logs em tempo real
- Restart remoto
- Backup manual

---

## 📋 Lista Completa de Comandos

### 👮 Administrativos

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/fechar` | Fecha o grupo | `/fechar` |
| `/abrir` | Abre o grupo | `/abrir` |
| `/fixar [msg]` | Fixa mensagem | `/fixar Reunião hoje 20h` |
| `/banir @user` | Bane membro | `/banir @João` |
| `/promover @user` | Promove a admin | `/promover @Maria` |
| `/rebaixar @user` | Rebaixa admin | `/rebaixar @Pedro` |
| `/aviso [msg]` | Menciona todos | `/aviso Atenção pessoal!` |
| `/link` | Gera link do grupo | `/link` |

### ⏰ Agendamento

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/agendar HH:MM msg` | Agenda mensagem | `/agendar 14:30 Reunião` |
| `/lembrete + msg Xh Yh` | Lembrete automático | `/lembrete + AVISO 1h 24h` |
| `/stoplembrete` | Para lembrete ativo | `/stoplembrete` |

### 🚫 Moderação

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/adicionartermo [palavra]` | Bloqueia palavra | `/adicionartermo spam` |
| `/removertermo [palavra]` | Remove bloqueio | `/removertermo spam` |
| `/listartermos` | Lista palavras bloqueadas | `/listartermos` |

### 🛠️ Gerenciamento

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/adicionargrupo [nome]` | Adiciona grupo permitido | `/adicionargrupo Vendas` |
| `/removergrupo [nome]` | Remove grupo | `/removergrupo Vendas` |
| `/listargrupos` | Lista grupos permitidos | `/listargrupos` |
| `/adicionaradmin @user` | Adiciona admin do bot | `/adicionaradmin @João` |
| `/removeradmin @user` | Remove admin do bot | `/removeradmin @João` |
| `/listaradmins` | Lista admins do bot | `/listaradmins` |

### 📊 Informações

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/status` | Status e estatísticas | `/status` |
| `/stats` | Estatísticas detalhadas | `/stats` |
| `/regras` | Mostra regras do grupo | `/regras` |
| `/hora` | Horário do bot | `/hora` |
| `/comandos` | Lista todos os comandos | `/comandos` |

### 🤖 IA e Testes

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/testia [msg]` | Testa IA de vendas | `/testia Quanto custa?` |
| `/leads` | Lista leads capturados | `/leads` |

### 📢 Auto-Promoção

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/promo add` | Adiciona grupo atual | `/promo add` |
| `/promo remove` | Remove grupo atual | `/promo remove` |
| `/promo list` | Lista grupos de promo | `/promo list` |
| `/promo interval [h]` | Define intervalo | `/promo interval 6` |
| `/promo on` | Ativa auto-promoção | `/promo on` |
| `/promo off` | Desativa auto-promoção | `/promo off` |
| `/promo config` | Ver configuração | `/promo config` |

### 🎲 Públicos (Qualquer membro)

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `!sorteio` | Inicia sorteio | `!sorteio` |
| `!participar` | Entra no sorteio | `!participar` |
| `/regras` | Ver regras | `/regras` |

### 🛠️ Desenvolvedor

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/dev` | Ativa modo desenvolvedor | `/dev` |
| `/dev off` | Desativa modo dev | `/dev off` |
| `/dev status` | Status do sistema | `/dev status` |
| `/dev logs` | Últimos logs | `/dev logs` |
| `/dev restart` | Reinicia bot | `/dev restart` |
| `/dev eval [code]` | Executa JavaScript | `/dev eval 2+2` |

---

## 🎯 Casos de Uso

### 📱 Grupos de Vendas
- IA qualifica leads automaticamente
- Notifica atendentes sobre clientes interessados
- Modera spam e conteúdo inadequado
- Lembretes de promoções

### 🏢 Grupos Corporativos
- Abertura/fechamento por horário
- Lembretes de reuniões
- Moderação automática
- Controle de acesso

### 🎮 Comunidades
- Sorteios interativos
- Boas-vindas personalizadas
- Sistema de regras
- Comandos customizados

### 🎓 Grupos Educacionais
- Lembretes de aulas
- Moderação de conteúdo
- Agendamento de avisos
- Controle de spam

---

## 💎 Diferenciais

✅ **IA Groq Integrada** - Moderação e vendas inteligentes
✅ **Modo Desenvolvedor** - Crie comandos conversando com IA
✅ **Dashboard Web** - Painel de controle completo
✅ **Backup Automático** - Dados sempre seguros
✅ **Open Source** - Código aberto no GitHub
✅ **Fácil Deploy** - Render, Railway ou VPS
✅ **Suporte Supabase** - Banco de dados em nuvem
✅ **Documentação Completa** - Guias passo a passo

---

## 📊 Estatísticas

- 🎯 40+ comandos disponíveis
- 🤖 2 IAs integradas (moderação + vendas)
- ⚡ Rate limiting de 3s entre comandos
- 🔄 Backup automático diário
- 📱 Suporte a múltiplos grupos
- 🌐 Deploy em 5 minutos

---

## 🎨 Capturas de Tela (Sugestões)

1. **Dashboard Web** - Painel de controle
2. **IA de Vendas** - Conversa com lead
3. **Moderação** - Detecção de spam
4. **Sorteio** - Comando interativo
5. **Lembretes** - Sistema de avisos
6. **Modo Dev** - Criação de comandos

---

## 💰 Planos (Sugestão)

### 🆓 Básico - Grátis
- Anti-spam básico
- Comandos administrativos
- Boas-vindas automáticas
- Suporte comunitário

### 🚀 Profissional - R$ 297/mês
- Tudo do Básico +
- IA de moderação
- Dashboard web
- Backup automático
- Suporte prioritário

### ⭐ Premium - R$ 597/mês
- Tudo do Profissional +
- IA de vendas
- Modo desenvolvedor
- Comandos customizados
- Suporte 24/7
- Integração Supabase

---

## 🔗 Links Importantes

- 📦 GitHub: https://github.com/fjprojectsdev/jh
- 📚 Documentação: Ver README.md
- 🚀 Deploy Render: Ver DEPLOY_RENDER.md
- 🔒 Segurança: Ver SECURITY.md
- 💬 Suporte: [Seu WhatsApp/Email]

---

## 🎬 Call to Action

**"Transforme seu grupo do WhatsApp em uma comunidade profissional e automatizada!"**

🚀 **Comece Agora - É Grátis!**
📱 **Teste por 7 dias sem compromisso**
💬 **Suporte em português**

---

## 🏆 Depoimentos (Sugestão)

> "O iMavyAgent revolucionou nosso grupo de vendas. A IA qualifica leads automaticamente!" - João Silva

> "Moderação perfeita! Acabou o spam no nosso grupo." - Maria Santos

> "Criei 5 comandos customizados em 10 minutos com o modo dev!" - Pedro Costa

---

## ❓ FAQ

**Q: Preciso de servidor próprio?**
A: Não! Deploy gratuito no Render ou Railway.

**Q: A IA é paga?**
A: Groq é gratuito! 30 req/min sem custo.

**Q: Posso customizar?**
A: Sim! Código aberto e modo desenvolvedor.

**Q: Funciona em múltiplos grupos?**
A: Sim! Sem limite de grupos.

**Q: Tem suporte?**
A: Sim! Documentação completa + suporte.

---

## 📞 Contato

📧 Email: [seu-email]
💬 WhatsApp: [seu-whatsapp]
🐙 GitHub: https://github.com/fjprojectsdev
🌐 Site: [seu-site]
