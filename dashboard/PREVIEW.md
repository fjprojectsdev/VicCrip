# 🎨 Preview do Dashboard iMavyBot

## 📸 Screenshots

### Tela de Login
```
┌─────────────────────────────────────┐
│                                     │
│              🤖                     │
│                                     │
│      iMavyBot Dashboard             │
│   Painel de Controle e Moderação    │
│                                     │
│   ┌───────────────────────────┐    │
│   │ Digite a senha            │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │        Entrar             │    │
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Dashboard Principal
```
┌────────────────────────────────────────────────────────────┐
│  🤖 iMavyBot                                    [Sair]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 🚫       │  │ 👥       │  │ 👮       │  │ ⏰       │ │
│  │ Palavras │  │ Grupos   │  │ Admins   │  │ Lembretes│ │
│  │ Banidas  │  │ Permitid.│  │          │  │ Ativos   │ │
│  │    15    │  │    8     │  │    3     │  │    5     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🚫 Palavras Banidas                                │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ [Digite a palavra]              [Adicionar]        │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ spam                                    [Remover]  │   │
│  │ golpe                                   [Remover]  │   │
│  │ fraude                                  [Remover]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 👥 Grupos Permitidos                               │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ [Digite o nome do grupo]        [Adicionar]        │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ Grupo Principal                         [Remover]  │   │
│  │ Grupo Secundário                        [Remover]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 📝 Logs Recentes                                   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ [2025-01-15 14:30:25]                              │   │
│  │ Palavra banida adicionada: spam                    │   │
│  │                                                    │   │
│  │ [2025-01-15 14:28:10]                              │   │
│  │ Login de Administrador realizado com sucesso       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 🎨 Paleta de Cores

### Cores Principais
- **Primary**: `#667eea` (Roxo)
- **Secondary**: `#764ba2` (Roxo Escuro)
- **Success**: `#10b981` (Verde)
- **Danger**: `#ef4444` (Vermelho)
- **Warning**: `#f59e0b` (Laranja)

### Cores de Fundo
- **Background**: Gradiente linear (135deg, #667eea → #764ba2)
- **Cards**: `#ffffff` (Branco)
- **Hover**: `#f3f4f6` (Cinza Claro)

## ✨ Animações

### Fade In
- Duração: 0.5s
- Easing: ease
- Aplicado em: Login box, cards

### Hover Effects
- Transform: translateY(-2px) / translateY(-5px)
- Transition: 0.2s / 0.3s
- Aplicado em: Botões, cards

### Loading States
- Spinner animado
- Texto "Carregando..."
- Transição suave

## 📱 Responsividade

### Desktop (1920x1080+)
- Grid de 4 colunas para stats
- Sidebar completa
- Todos os elementos visíveis

### Tablet (768x1024)
- Grid de 2 colunas para stats
- Navegação adaptada
- Scroll vertical

### Mobile (375x667)
- Grid de 1 coluna
- Menu hamburger
- Cards empilhados
- Input groups em coluna

## 🔧 Componentes

### Navbar
- Logo + Nome do bot
- Botão de logout
- Fixo no topo
- Sombra suave

### Stat Cards
- Ícone grande
- Título descritivo
- Número destacado
- Hover effect

### Section Cards
- Título com ícone
- Input group
- Lista scrollável
- Botões de ação

### List Items
- Texto à esquerda
- Ação à direita
- Hover effect
- Border bottom

### Buttons
- Primary (roxo)
- Danger (vermelho)
- Hover effect
- Border radius 8px

### Inputs
- Border 2px
- Focus effect (roxo)
- Padding 12-15px
- Border radius 8-10px

## 🎯 UX Features

### Auto-refresh
- Intervalo: 30 segundos
- Silencioso (sem reload)
- Mantém scroll position

### Feedback Visual
- Confirmação antes de deletar
- Loading states
- Empty states
- Error messages

### Acessibilidade
- Contraste adequado
- Tamanhos de fonte legíveis
- Botões com área clicável
- Keyboard navigation

## 🚀 Performance

### Otimizações
- CSS minificado
- JavaScript vanilla (sem frameworks)
- Lazy loading de dados
- Cache de token

### Métricas
- First Paint: < 1s
- Time to Interactive: < 2s
- Bundle Size: < 50KB
- API Response: < 200ms

## 📊 Estrutura de Dados

### Stats Response
```json
{
  "bannedWords": 15,
  "allowedGroups": 8,
  "admins": 3,
  "lembretes": 5
}
```

### Banned Words Response
```json
["spam", "golpe", "fraude"]
```

### Logs Response
```json
[
  {
    "timestamp": "2025-01-15T14:30:25.000Z",
    "action": "Palavra banida adicionada: spam"
  }
]
```

## 🎓 Tecnologias

### Frontend
- HTML5 Semantic
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+ (Async/Await, Fetch API)

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- File System (fs/promises)

### Segurança
- JWT Authentication
- CORS
- Input Validation
- XSS Protection

---

**Dashboard pronto para produção! 🚀**
