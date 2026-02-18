

# Corrigir visibilidade do menu "Cobranças" no ADM Master

## Diagnostico

O menu "Cobranças" **ja existe no codigo** (linha 117 do AdminSidebar.tsx) e a rota `/admin/cobrancas` tambem esta registrada no App.tsx. O problema e que o grupo "Gestao" na sidebar possui **14 itens**, e "Cobrancas" e o penultimo item -- ficando abaixo da area visivel da tela sem scroll.

## Solucao

Reorganizar os itens da sidebar para melhorar a visibilidade, movendo "Cobrancas" para uma posicao mais alta (logo apos "Financeiro") e, opcionalmente, agrupando itens relacionados.

## Alteracoes

### 1. `src/components/layout/AdminSidebar.tsx`
- Mover o item "Cobrancas" (atualmente na posicao 13 de 14) para logo apos "Financeiro" (posicao 5-6), ja que sao temas relacionados.
- Resultado: o item ficara visivel sem necessidade de scroll na maioria das resoluções.

### Ordem proposta dos itens no grupo "Gestao":
```text
1. Dashboard
2. Dashboard CEO
3. Analytics (SaaS)
4. Escolas
5. Financeiro
6. Cobrancas        <-- movido para ca
7. Planos
8. Suporte (Help Desk)
9. Retencao (Anti-churn)
10. RBAC / Permissoes
11. Governanca / LGPD
12. Monitoramento
13. Modulos
14. Usuarios
15. Log de Atividades
16. Configuracoes
```

Essa reorganizacao nao altera nenhuma funcionalidade, apenas a ordem visual dos itens no menu lateral.

