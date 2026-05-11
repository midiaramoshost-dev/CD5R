
-- 1. Tighten materiais_didaticos SELECT: scope to same school or admin only (remove "any authenticated user" clause)
DROP POLICY IF EXISTS "Materiais visiveis para autenticados da mesma escola" ON public.materiais_didaticos;

CREATE POLICY "Materiais visiveis apenas para mesma escola ou admin"
ON public.materiais_didaticos
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

-- 2. Add UPDATE/DELETE policies on storage.objects for 'materiais' bucket, scoped to owners/admin
DROP POLICY IF EXISTS "Materiais bucket: escola/admin podem atualizar" ON storage.objects;
CREATE POLICY "Materiais bucket: escola/admin podem atualizar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'materiais'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.materiais_didaticos m
      JOIN public.escolas e ON e.id = m.escola_id
      WHERE m.arquivo_path = storage.objects.name
        AND e.user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Materiais bucket: escola/admin podem deletar" ON storage.objects;
CREATE POLICY "Materiais bucket: escola/admin podem deletar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'materiais'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.materiais_didaticos m
      JOIN public.escolas e ON e.id = m.escola_id
      WHERE m.arquivo_path = storage.objects.name
        AND e.user_id = auth.uid()
    )
  )
);

-- 3. Restrict listing on 'materiais' public bucket to authenticated users only
DROP POLICY IF EXISTS "Materiais bucket: listing requires auth" ON storage.objects;
CREATE POLICY "Materiais bucket: listing requires auth"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materiais');

-- 4. Revoke anon/authenticated EXECUTE on get_user_role (only used server-side / via definer chains)
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO service_role;
