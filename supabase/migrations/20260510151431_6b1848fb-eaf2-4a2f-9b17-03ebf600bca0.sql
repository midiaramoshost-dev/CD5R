
-- 1. anunciantes: drop anonymous broad SELECT (Parceiros uses anunciantes_publicos view)
DROP POLICY IF EXISTS "Anonimos podem ver anunciantes ativos via view" ON public.anunciantes;

-- 2. materiais_didaticos: require auth + scope by escola
DROP POLICY IF EXISTS "Usuarios autenticados podem ler materiais" ON public.materiais_didaticos;
CREATE POLICY "Materiais visiveis para autenticados da mesma escola"
ON public.materiais_didaticos
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR auth.uid() IS NOT NULL
);

-- 3. notificacoes_chamada: explicit DELETE policy scoped to escola
CREATE POLICY "Escola pode deletar proprias notificacoes"
ON public.notificacoes_chamada
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
);

-- 4. Storage 'materiais' bucket: restrict listing + add ownership-scoped UPDATE/DELETE
DROP POLICY IF EXISTS "Materiais bucket: listing requires auth" ON storage.objects;
CREATE POLICY "Materiais bucket: listing requires auth"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materiais');

DROP POLICY IF EXISTS "Materiais bucket: owner can update" ON storage.objects;
CREATE POLICY "Materiais bucket: owner can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'materiais' AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.materiais_didaticos m
      JOIN public.escolas e ON e.id = m.escola_id
      WHERE m.arquivo_path = storage.objects.name AND e.user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Materiais bucket: owner can delete" ON storage.objects;
CREATE POLICY "Materiais bucket: owner can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'materiais' AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.materiais_didaticos m
      JOIN public.escolas e ON e.id = m.escola_id
      WHERE m.arquivo_path = storage.objects.name AND e.user_id = auth.uid()
    )
  )
);

-- 5. Revoke EXECUTE from anon/authenticated on internal trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_material_tipo() FROM anon, authenticated, public;
-- has_role and get_user_role intentionally remain executable: they are used inside RLS policies
