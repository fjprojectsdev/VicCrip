# iMavyBot Dashboard

Dashboard web moderno para gerenciamento e monitoramento do iMavyBot.

## 🚀 Funcionalidades

- ✅ Autenticação JWT segura
- ✅ Gerenciamento de palavras banidas
- ✅ Controle de grupos permitidos
- ✅ Visualização de administradores
- ✅ Logs em tempo real
- ✅ Estatísticas do bot
- ✅ Interface responsiva e moderna
- ✅ Auto-refresh a cada 30 segundos

## 📦 Instalação

```bash
cd dashboard
npm install
```

## ⚙️ Configuração

Configure as variáveis de ambiente no arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
ADMIN_PASSWORD=FJMR2025
```

## 🎯 Como Usar

1. Inicie o servidor:
```bash
npm start
```

2. Acesse no navegador:
```
http://localhost:3000
```

3. Faça login com a senha configurada (padrão: FJMR2025)

## 🎨 Interface

O dashboard possui:

- **Cards de Estatísticas**: Visualização rápida de métricas importantes
- **Gerenciamento de Palavras**: Adicione/remova palavras banidas
- **Controle de Grupos**: Gerencie grupos permitidos
- **Lista de Admins**: Visualize administradores ativos
- **Logs**: Acompanhe ações em tempo real

## 🔒 Segurança

- Autenticação JWT com expiração de 24h
- Tokens armazenados localmente
- Todas as rotas protegidas por middleware
- Logs de todas as ações administrativas

## 🛠️ Tecnologias

- **Backend**: Express.js, JWT, File System
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilo**: CSS moderno com gradientes e animações

## 📱 Responsivo

Interface totalmente responsiva, funciona perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🔄 API Endpoints

### Autenticação
- `POST /api/login` - Login

### Estatísticas
- `GET /api/stats` - Estatísticas gerais

### Palavras Banidas
- `GET /api/banned-words` - Lista palavras
- `POST /api/banned-words` - Adiciona palavra
- `DELETE /api/banned-words/:word` - Remove palavra

### Grupos
- `GET /api/allowed-groups` - Lista grupos
- `POST /api/allowed-groups` - Adiciona grupo
- `DELETE /api/allowed-groups/:name` - Remove grupo

### Administradores
- `GET /api/admins` - Lista admins

### Logs
- `GET /api/logs` - Logs recentes

## 📄 Licença

MIT
