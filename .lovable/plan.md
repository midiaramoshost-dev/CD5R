## Objetivo

Ativar cobrança real via Mercado Pago em ambos os fluxos, mantendo a inserção das chaves nos formulários já existentes.

## 1. ADM Master — mensalidades das escolas

**Chaves:** continuam sendo inseridas no formulário atual em Cobranças → Gateways (tabela `payment_gateways`, id=`mercadopago`). Sem mudança de UI de configuração.

**Novo webhook `mercadopago-webhook` (edge function pública):**
- Recebe notificação IPN/Webhook do Mercado Pago.
- Busca `access_token` em `payment_gateways` e consulta `GET /v1/payments/{id}` para validar status.
- Atualiza `pagamentos.status`, `data_pagamento` usando `external_reference` = `pagamentos.id`.
- Se aprovado e for mensalidade da plataforma, muda `escolas.status` para `ativo` e estende `trial_expires_at` conforme plano.

**Atualização em `create-mercadopago-payment`:**
- Insere `pagamentos` (status `pendente`) antes de chamar o Mercado Pago.
- Envia `external_reference` e `notification_url` (URL do webhook novo).

**UI ADM:** mostrar URL do webhook copiável na tela de Cobranças/Gateways para colar em Mercado Pago → Notificações → Webhooks.

## 2. Painel da Escola — cobrança de responsáveis

**Nova tabela `escola_payment_gateways`:**
```
id, escola_id, gateway, api_key, secret_key, public_key,
sandbox, enabled, webhook_secret, created_at, updated_at
UNIQUE(escola_id, gateway)
```
- GRANT authenticated + service_role.
- RLS: escola gerencia apenas o próprio (`escola_id IN (SELECT id FROM escolas WHERE user_id = auth.uid())`); admin vê tudo.

**Formulário existente** em Contas a Receber → Configurar Pagamentos passa a persistir nessa tabela (hoje só salva em estado local). Sem mudança visual, apenas troca da fonte de dados.

**Nova edge function `create-escola-payment`:**
- Requer JWT. Recebe `pagamento_id`, `escola_id`, `amount`, `description`, `payer_email`, `payment_method` (`pix`/`card`).
- Lê chaves da escola em `escola_payment_gateways`.
- Cria pagamento Pix ou preferência de cartão no Mercado Pago com `external_reference = pagamento_id` e `notification_url` para o webhook da escola.

**Nova edge function `escola-mercadopago-webhook` (pública):**
- Path: `/escola-mercadopago-webhook/{escola_id}`.
- Busca chaves da escola, consulta pagamento, atualiza `pagamentos.status`.

**Substituição do mock:** `PaymentDialog` deixa de usar `mockPaymentService` e chama `create-escola-payment`. Renderiza QR Pix e/ou link `init_point` de cartão retornados.

**UI Escola:** exibir URL do webhook da escola no formulário de configuração para ela colar na conta Mercado Pago dela.

## 3. Atualização de status em tempo real

- Adicionar coluna `external_id text` em `pagamentos` (payment id do Mercado Pago) para matching robusto.
- Hook `usePaymentStatus(pagamentoId)` com polling `select` (5s) em `pagamentos.status` durante o dialog aberto. Realtime fica como melhoria futura.

## Migrações

```sql
-- 1) coluna auxiliar
ALTER TABLE public.pagamentos ADD COLUMN external_id text;

-- 2) tabela por escola
CREATE TABLE public.escola_payment_gateways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  escola_id uuid NOT NULL,
  gateway text NOT NULL DEFAULT 'mercadopago',
  api_key text NOT NULL DEFAULT '',
  secret_key text NOT NULL DEFAULT '',
  public_key text NOT NULL DEFAULT '',
  sandbox boolean NOT NULL DEFAULT true,
  enabled boolean NOT NULL DEFAULT false,
  webhook_secret text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(escola_id, gateway)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.escola_payment_gateways TO authenticated;
GRANT ALL ON public.escola_payment_gateways TO service_role;
ALTER TABLE public.escola_payment_gateways ENABLE ROW LEVEL SECURITY;
-- policies: escola dona OU admin (SELECT/INSERT/UPDATE/DELETE)
```

## Edge functions — padrão

- `verify_jwt = false` nas duas webhooks; validação via `external_reference` + consulta autenticada ao MP.
- `create-escola-payment` valida JWT com `getClaims()` e checa se o usuário é dono da escola.
- Todas com CORS, zod para validar input, `npm:@supabase/supabase-js@2`.

## URLs do webhook (mostradas na UI)

- ADM: `https://ocieayhwtvjhwdezkesm.supabase.co/functions/v1/mercadopago-webhook`
- Escola: `https://ocieayhwtvjhwdezkesm.supabase.co/functions/v1/escola-mercadopago-webhook/{escola_id}`

## Fora do escopo

Boleto, assinaturas recorrentes nativas do MP, split, antecipação, outros gateways.

## Entregáveis

1. Migração: `escola_payment_gateways` + `pagamentos.external_id` + policies.
2. Edge functions: novas `mercadopago-webhook`, `create-escola-payment`, `escola-mercadopago-webhook`; atualizar `create-mercadopago-payment`.
3. Front: persistir chaves da escola, trocar mock por edge function no `PaymentDialog`, exibir URLs dos webhooks nos dois formulários, hook de polling do status.
