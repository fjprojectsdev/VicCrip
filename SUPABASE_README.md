# Configuração Supabase

## Passo 1: Criar Tabelas

1. Acesse: https://supabase.com/dashboard/project/lxqyacryiizzcyrkcfya/editor
2. Clique em "SQL Editor" (ícone de raio no menu lateral)
3. Clique em "+ New query"
4. Copie TODO o conteúdo do arquivo `SUPABASE_SETUP.sql`
5. Cole no editor
6. Clique em "Run" (ou F5)

## Passo 2: Verificar Tabelas

Vá em "Table Editor" e confirme que foram criadas:
- ✅ strikes
- ✅ banned_words
- ✅ allowed_groups
- ✅ admins
- ✅ lembretes
- ✅ scheduled_messages

## Passo 3: Migrar Dados (Opcional)

Se você já tem dados nos arquivos JSON, execute:

```bash
node migrate_to_supabase.js
```

## Pronto!

O bot agora usa Supabase. Todos os dados são salvos na nuvem e não somem no deploy.

## Vantagens

- ✅ Dados persistem entre deploys
- ✅ Backup automático
- ✅ Dashboard visual
- ✅ Escalável
- ✅ Grátis até 500MB
