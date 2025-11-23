# iMavyAgent - Bot WhatsApp

Bot de moderação e automação para grupos do WhatsApp.

## Funcionalidades

- ✅ Anti-spam com detecção inteligente de variações
- ✅ Sistema de strikes (3 strikes = expulsão)
- ✅ Lembretes automáticos com persistência
- ✅ Boas-vindas automáticas
- ✅ Abertura/fechamento automático de grupos
- ✅ Comandos administrativos
- ✅ Backup automático diário
- ✅ Rate limiting

## Instalação

```bash
npm install
cp .env.example .env
# Configure o .env
node index.js
```

## Comandos

### Administrativos
- `/fechar` - Fecha o grupo
- `/abrir` - Abre o grupo
- `/fixar [mensagem]` - Fixa mensagem
- `/banir @membro` - Bane membro
- `/addtermo [palavra]` - Adiciona palavra proibida
- `/removertermo [palavra]` - Remove palavra proibida
- `/listartermos` - Lista palavras proibidas
- `/lembrete + mensagem 1h 24h` - Cria lembrete
- `/stoplembrete` - Para lembrete
- `/stats` - Estatísticas do bot

### Gerenciamento
- `/adicionargrupo [nome]` - Adiciona grupo permitido
- `/removergrupo [nome]` - Remove grupo permitido
- `/listargrupos` - Lista grupos permitidos
- `/adicionaradmin @usuario` - Adiciona admin
- `/removeradmin @usuario` - Remove admin
- `/listaradmins` - Lista admins

### Informação
- `/regras` - Mostra regras do grupo
- `/status` - Status do grupo
- `/comandos` - Lista todos os comandos

## Estrutura de Arquivos

```
├── functions/          # Módulos do bot
├── backups/           # Backups automáticos
├── strikes.json       # Strikes dos usuários
├── lembretes.json     # Lembretes ativos
├── banned_words.json  # Palavras proibidas
├── allowed_groups.json # Grupos permitidos
├── admins.json        # Administradores
└── bot.log           # Logs do sistema
```

## Configuração

Edite o arquivo `.env`:

```env
GRUPO_HORARIO_ABERTURA=07:00
GRUPO_HORARIO_FECHAMENTO=00:00
DDD_PADRAO=64
COMMAND_COOLDOWN=3
```

## Backup

Backups automáticos diários às 3h da manhã.
Mantém backups dos últimos 7 dias.

## Logs

Logs estruturados salvos em `bot.log`.

## Suporte

Para problemas ou sugestões, abra uma issue.
