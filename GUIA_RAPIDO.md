# 🚀 Guia Rápido - Bot WhatsApp com IA

## 📦 Instalação Rápida

1. **Execute o instalador:**
```bash
INSTALL.bat
```

2. **Configure o Supabase:**
   - Acesse: https://supabase.com
   - Crie um projeto
   - Vá em Settings > API
   - Copie `URL` e `anon/public key`
   - Cole no arquivo `.env`:
```env
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_aqui
```

3. **Execute o SQL:**
   - Abra o arquivo `SUPABASE_UPDATE.sql`
   - Copie todo o conteúdo
   - No Supabase, vá em SQL Editor
   - Cole e execute

4. **Inicie tudo:**
```bash
START_ALL.bat
```

## ✅ Pronto!

- **Bot:** Rodando no console principal
- **Dashboard:** http://localhost:3001
- **IA:** Moderação automática ativa (Groq)

## 🤖 Recursos Ativos

✅ Moderação com IA (Groq Llama 3.3)
✅ Dashboard web em tempo real
✅ Sistema de strikes
✅ Logs administrativos
✅ Backup automático diário
✅ Anti-spam inteligente
✅ Comandos administrativos

## 📊 APIs Configuradas

- **Groq:** Moderação de mensagens
- **OpenRouter:** Backup de IA
- **Supabase:** Banco de dados

## 🔧 Comandos Úteis

- `!ban @user` - Banir usuário
- `!unban @user` - Desbanir
- `!strikes @user` - Ver strikes
- `!stats` - Estatísticas do grupo
- `!logs` - Ver logs administrativos

## 📝 Arquivos Importantes

- `.env` - Configurações e chaves
- `SUPABASE_UPDATE.sql` - SQL para criar tabelas
- `dashboard/server.js` - Servidor do dashboard
- `functions/aiModeration.js` - IA de moderação

## 🆘 Problemas?

1. **Bot não conecta:** Escaneie o QR code
2. **Dashboard não abre:** Verifique se a porta 3001 está livre
3. **IA não funciona:** Chaves já configuradas no código
4. **Erro no Supabase:** Execute o SQL novamente

## 🎯 Próximos Passos

1. Personalize mensagens de boas-vindas
2. Configure horários de abertura/fechamento
3. Adicione palavras banidas customizadas
4. Explore o dashboard para monitorar grupos
