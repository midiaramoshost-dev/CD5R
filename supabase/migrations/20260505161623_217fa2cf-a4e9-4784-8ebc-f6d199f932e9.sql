
DROP VIEW IF EXISTS public.anunciantes_publicos;

CREATE VIEW public.anunciantes_publicos
WITH (security_invoker = on) AS
SELECT id, nome, descricao, logo_url, website, categoria, ativo
FROM public.anunciantes
WHERE ativo = true;

GRANT SELECT ON public.anunciantes_publicos TO anon, authenticated;

-- Allow anon/authenticated to read via the view (which itself filters ativo=true)
-- Need a permissive SELECT policy on the base table when accessed through invoker view
CREATE POLICY "Anonimos podem ver anunciantes ativos via view"
ON public.anunciantes FOR SELECT
USING (ativo = true);
