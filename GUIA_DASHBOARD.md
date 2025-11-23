# 🎯 Guia Rápido - Dashboard iMavyBot

## 🚀 Início Rápido

### 1. Instalação
```bash
cd dashboard
npm install
```

### 2. Iniciar Dashboard
**Opção 1 - Atalho Windows:**
```bash
INICIAR_DASHBOARD.bat
```

**Opção 2 - Manual:**
```bash
cd dashboard
npm start
```

### 3. Acessar
Abra o navegador em: **http://localhost:3000**

Senha padrão: **FJMR2025**

---

## 📊 Funcionalidades

### 🔐 Login
- Autenticação segura com JWT
- Token válido por 24 horas
- Logout automático ao expirar

### 📈 Dashboard Principal
Visualize em tempo real:
- Total de palavras banidas
- Grupos permitidos
- Administradores ativos
- Lembretes configurados

### 🚫 Gerenciar Palavras Banidas
1. Digite a palavra no campo
2. Clique em "Adicionar"
3. Para remover, clique no botão "Remover" ao lado da palavra

### 👥 Gerenciar Grupos
1. Digite o nome do grupo
2. Clique em "Adicionar"
3. Para remover, clique no botão "Remover"

### 📝 Logs
- Visualize as últimas 50 ações
- Atualização automática a cada 30 segundos
- Timestamp de cada ação

---

## ⚙️ Configuração

### Alterar Senha
Edite o arquivo `.env` na raiz do projeto:
```env
ADMIN_PASSWORD=SuaSenhaAqui
```

### Alterar Porta
```env
PORT=3000
```

### Chave JWT Personalizada
```env
JWT_SECRET=sua_chave_super_secreta
```

---

## 🎨 Interface

### Cores e Tema
- Gradiente roxo moderno
- Cards com sombras suaves
- Animações suaves
- Design responsivo

### Responsividade
Funciona perfeitamente em:
- 💻 Desktop (1920x1080+)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667)

---

## 🔧 Solução de Problemas

### Dashboard não inicia
```bash
# Reinstale as dependências
cd dashboard
rm -rf node_modules
npm install
npm start
```

### Erro de autenticação
1. Limpe o localStorage do navegador
2. Verifique a senha no arquivo `.env`
3. Reinicie o servidor

### Porta já em uso
Altere a porta no `.env`:
```env
PORT=3001
```

### Dados não aparecem
1. Verifique se os arquivos JSON existem na raiz
2. Verifique permissões de leitura
3. Veja os logs no console do servidor

---

## 📡 API Endpoints

### Autenticação
```
POST /api/login
Body: { "password": "FJMR2025" }
Response: { "token": "jwt_token", "message": "Login realizado" }
```

### Estatísticas
```
GET /api/stats
Headers: { "Authorization": "Bearer {token}" }
```

### Palavras Banidas
```
GET /api/banned-words
POST /api/banned-words
DELETE /api/banned-words/:word
```

### Grupos
```
GET /api/allowed-groups
POST /api/allowed-groups
DELETE /api/allowed-groups/:name
```

### Administradores
```
GET /api/admins
```

### Logs
```
GET /api/logs
```

---

## 🚀 Deploy

### Railway
1. Conecte o repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Heroku
```bash
heroku create imavy-dashboard
heroku config:set ADMIN_PASSWORD=SuaSenha
git push heroku main
```

### VPS (Linux)
```bash
# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone e configure
git clone https://github.com/fjprojectsdev/stts.git
cd stts/dashboard
npm install

# Use PM2 para manter rodando
npm install -g pm2
pm2 start server.js --name imavy-dashboard
pm2 startup
pm2 save
```

---

## 🔒 Segurança

### Boas Práticas
- ✅ Altere a senha padrão
- ✅ Use HTTPS em produção
- ✅ Configure JWT_SECRET forte
- ✅ Mantenha dependências atualizadas
- ✅ Não exponha arquivos sensíveis

### Proteção
- JWT com expiração
- Middleware de autenticação
- Logs de todas as ações
- CORS configurado
- Validação de entrada

---

## 📞 Suporte

### Problemas?
1. Verifique os logs do servidor
2. Consulte a documentação
3. Abra uma issue no GitHub

### Melhorias?
Contribuições são bem-vindas!
1. Fork o projeto
2. Crie uma branch
3. Faça suas alterações
4. Envie um Pull Request

---

## 📝 Changelog

### v1.0.0 (2025)
- ✅ Dashboard completo
- ✅ Autenticação JWT
- ✅ Gerenciamento de palavras
- ✅ Gerenciamento de grupos
- ✅ Visualização de logs
- ✅ Interface responsiva
- ✅ Auto-refresh

---

## 📄 Licença

MIT License - Livre para uso pessoal e comercial

---

**Desenvolvido com ❤️ para a comunidade iMavyBot**
