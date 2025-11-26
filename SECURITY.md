# 🔒 Guia de Segurança

## ⚠️ NUNCA FAÇA ISSO:

❌ Commitar arquivo `.env` com credenciais
❌ Expor API keys no código
❌ Compartilhar tokens em issues/PRs
❌ Fazer push de `auth_info/` (sessão WhatsApp)

## ✅ SEMPRE FAÇA ISSO:

### 1. Configure o .env corretamente

```bash
# Copie o exemplo
cp .env.example .env

# Edite com suas credenciais REAIS
nano .env
```

### 2. Verifique o .gitignore

O arquivo `.env` DEVE estar no `.gitignore`:

```
.env
.env.local
.env.production
```

### 3. Use variáveis de ambiente

```javascript
// ✅ CORRETO
const apiKey = process.env.GROQ_API_KEY;

// ❌ ERRADO
const apiKey = "gsk_abc123...";
```

### 4. Deploy em produção

**Render/Railway/Heroku:**
- Configure as variáveis no dashboard
- Nunca coloque no código

**VPS:**
```bash
# Crie o .env no servidor
nano .env
# Cole suas credenciais
# Salve e feche
```

## 🔑 Onde conseguir as chaves

### Groq API (IA - Gratuito)
1. https://console.groq.com
2. Create API Key
3. Copie e cole no `.env`

### Supabase (Banco de dados - Opcional)
1. https://supabase.com
2. Crie projeto
3. Settings → API → URL e anon key

## 🚨 Se você expôs uma chave

1. **Revogue imediatamente** no painel da API
2. **Gere nova chave**
3. **Atualize o .env**
4. **Nunca faça push da chave antiga**

## 📝 Checklist antes de commit

- [ ] `.env` está no `.gitignore`
- [ ] Nenhuma credencial no código
- [ ] Apenas `.env.example` commitado
- [ ] Variáveis usando `process.env`
