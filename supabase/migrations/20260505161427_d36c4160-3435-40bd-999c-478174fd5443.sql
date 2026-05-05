
-- Fix: payment_gateways - remove public read policy
DROP POLICY IF EXISTS "Service role pode ler gateways" ON public.payment_gateways;

-- Fix: notificacoes_chamada - scope by escola_id
DROP POLICY IF EXISTS "Admin e escola podem ver notificacoes" ON public.notificacoes_chamada;
DROP POLICY IF EXISTS "Admin e escola podem atualizar notificacoes" ON public.notificacoes_chamada;
DROP POLICY IF EXISTS "Admin e escola podem inserir notificacoes" ON public.notificacoes_chamada;

CREATE POLICY "Escola pode ver proprias notificacoes"
ON public.notificacoes_chamada FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

CREATE POLICY "Escola pode atualizar proprias notificacoes"
ON public.notificacoes_chamada FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

CREATE POLICY "Escola pode inserir proprias notificacoes"
ON public.notificacoes_chamada FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

-- Fix: materiais_didaticos - scope writes by escola_id
DROP POLICY IF EXISTS "Escolas podem atualizar materiais" ON public.materiais_didaticos;
DROP POLICY IF EXISTS "Escolas podem deletar materiais" ON public.materiais_didaticos;
DROP POLICY IF EXISTS "Escolas podem inserir materiais" ON public.materiais_didaticos;

CREATE POLICY "Escola pode inserir proprios materiais"
ON public.materiais_didaticos FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

CREATE POLICY "Escola pode atualizar proprios materiais"
ON public.materiais_didaticos FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

CREATE POLICY "Escola pode deletar proprios materiais"
ON public.materiais_didaticos FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

-- Fix: anunciantes - hide contact data from public
DROP POLICY IF EXISTS "Qualquer um pode ver anunciantes ativos" ON public.anunciantes;

CREATE POLICY "Public pode ver anunciantes ativos sem contato"
ON public.anunciantes FOR SELECT
USING (ativo = true OR has_role(auth.uid(), 'admin'::app_role));

-- Note: Application code reading 'anunciantes' should not select contact fields publicly.
-- For full protection, create a sanitized view:
CREATE OR REPLACE VIEW public.anunciantes_publicos AS
SELECT id, nome, descricao, logo_url, website, categoria, ativo
FROM public.anunciantes
WHERE ativo = true;

GRANT SELECT ON public.anunciantes_publicos TO anon, authenticated;

-- Restrict full anunciantes table read (with contact info) to admins
DROP POLICY IF EXISTS "Public pode ver anunciantes ativos sem contato" ON public.anunciantes;
CREATE POLICY "Admins podem ver anunciantes completos"
ON public.anunciantes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Lock down SECURITY DEFINER trigger-only functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_material_tipo() FROM PUBLIC, anon, authenticated;
