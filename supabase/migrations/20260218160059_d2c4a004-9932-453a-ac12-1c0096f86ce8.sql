
-- =============================================
-- FIX: Convert all RESTRICTIVE policies to PERMISSIVE
-- =============================================

-- payment_gateways
DROP POLICY IF EXISTS "Admins podem ver gateways" ON public.payment_gateways;
DROP POLICY IF EXISTS "Admins podem inserir gateways" ON public.payment_gateways;
DROP POLICY IF EXISTS "Admins podem atualizar gateways" ON public.payment_gateways;
DROP POLICY IF EXISTS "Admins podem deletar gateways" ON public.payment_gateways;

CREATE POLICY "Admins podem ver gateways" ON public.payment_gateways FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem inserir gateways" ON public.payment_gateways FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem atualizar gateways" ON public.payment_gateways FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem deletar gateways" ON public.payment_gateways FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Also allow service_role (edge functions) to read gateways
CREATE POLICY "Service role pode ler gateways" ON public.payment_gateways FOR SELECT USING (true);

-- admin_usuarios
DROP POLICY IF EXISTS "Admins podem ver usuarios admin" ON public.admin_usuarios;
DROP POLICY IF EXISTS "Admins podem inserir usuarios admin" ON public.admin_usuarios;
DROP POLICY IF EXISTS "Admins podem atualizar usuarios admin" ON public.admin_usuarios;
DROP POLICY IF EXISTS "Admins podem deletar usuarios admin" ON public.admin_usuarios;

CREATE POLICY "Admins podem ver usuarios admin" ON public.admin_usuarios FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem inserir usuarios admin" ON public.admin_usuarios FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem atualizar usuarios admin" ON public.admin_usuarios FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem deletar usuarios admin" ON public.admin_usuarios FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- escolas
DROP POLICY IF EXISTS "Admins podem ver todas escolas" ON public.escolas;
DROP POLICY IF EXISTS "Admins podem inserir escolas" ON public.escolas;
DROP POLICY IF EXISTS "Admins podem atualizar escolas" ON public.escolas;
DROP POLICY IF EXISTS "Admins podem deletar escolas" ON public.escolas;
DROP POLICY IF EXISTS "Escola pode ver proprio registro" ON public.escolas;

CREATE POLICY "Admins podem ver todas escolas" ON public.escolas FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem inserir escolas" ON public.escolas FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem atualizar escolas" ON public.escolas FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem deletar escolas" ON public.escolas FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Escola pode ver proprio registro" ON public.escolas FOR SELECT USING (auth.uid() = user_id);

-- pagamentos
DROP POLICY IF EXISTS "Admins podem ver todos pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Admins podem inserir pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Admins podem atualizar pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Admins podem deletar pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Escolas podem ver proprios pagamentos" ON public.pagamentos;

CREATE POLICY "Admins podem ver todos pagamentos" ON public.pagamentos FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem inserir pagamentos" ON public.pagamentos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem atualizar pagamentos" ON public.pagamentos FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem deletar pagamentos" ON public.pagamentos FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Escolas podem ver proprios pagamentos" ON public.pagamentos FOR SELECT USING (escola_id IN (SELECT id FROM escolas WHERE user_id = auth.uid()));

-- materiais_didaticos
DROP POLICY IF EXISTS "Usuarios autenticados podem ler materiais" ON public.materiais_didaticos;
DROP POLICY IF EXISTS "Escolas podem inserir materiais" ON public.materiais_didaticos;
DROP POLICY IF EXISTS "Escolas podem atualizar materiais" ON public.materiais_didaticos;
DROP POLICY IF EXISTS "Escolas podem deletar materiais" ON public.materiais_didaticos;

CREATE POLICY "Usuarios autenticados podem ler materiais" ON public.materiais_didaticos FOR SELECT USING (true);
CREATE POLICY "Escolas podem inserir materiais" ON public.materiais_didaticos FOR INSERT WITH CHECK (has_role(auth.uid(), 'escola'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Escolas podem atualizar materiais" ON public.materiais_didaticos FOR UPDATE USING (has_role(auth.uid(), 'escola'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Escolas podem deletar materiais" ON public.materiais_didaticos FOR DELETE USING (has_role(auth.uid(), 'escola'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- planos
DROP POLICY IF EXISTS "Qualquer um pode ler planos" ON public.planos;
DROP POLICY IF EXISTS "Admins podem inserir planos" ON public.planos;
DROP POLICY IF EXISTS "Admins podem atualizar planos" ON public.planos;
DROP POLICY IF EXISTS "Admins podem deletar planos" ON public.planos;

CREATE POLICY "Qualquer um pode ler planos" ON public.planos FOR SELECT USING (true);
CREATE POLICY "Admins podem inserir planos" ON public.planos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem atualizar planos" ON public.planos FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem deletar planos" ON public.planos FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- platform_settings
DROP POLICY IF EXISTS "Qualquer um pode ler configuracoes" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins podem inserir configuracoes" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins podem atualizar configuracoes" ON public.platform_settings;

CREATE POLICY "Qualquer um pode ler configuracoes" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins podem inserir configuracoes" ON public.platform_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem atualizar configuracoes" ON public.platform_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- profiles
DROP POLICY IF EXISTS "Usuarios podem ver proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Inserir perfil para proprio usuario" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios podem atualizar proprio perfil" ON public.profiles;

CREATE POLICY "Usuarios podem ver proprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Inserir perfil para proprio usuario" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuarios podem atualizar proprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_roles
DROP POLICY IF EXISTS "Admins podem ver todas roles" ON public.user_roles;
DROP POLICY IF EXISTS "Usuarios podem ver propria role" ON public.user_roles;

CREATE POLICY "Admins podem ver todas roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Usuarios podem ver propria role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
