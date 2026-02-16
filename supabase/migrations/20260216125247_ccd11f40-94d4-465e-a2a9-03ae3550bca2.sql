
-- Tabela singleton para configurações da plataforma
CREATE TABLE public.platform_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number text NOT NULL DEFAULT '5515997625135',
  nome_plataforma text NOT NULL DEFAULT 'i ESCOLAS',
  email_suporte text NOT NULL DEFAULT 'suporte@iescolas.com.br',
  telefone_suporte text NOT NULL DEFAULT '(11) 99999-9999',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler (landing page pública)
CREATE POLICY "Qualquer um pode ler configuracoes"
ON public.platform_settings
FOR SELECT
USING (true);

-- Apenas admins podem atualizar
CREATE POLICY "Admins podem atualizar configuracoes"
ON public.platform_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Apenas admins podem inserir
CREATE POLICY "Admins podem inserir configuracoes"
ON public.platform_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Inserir registro padrão
INSERT INTO public.platform_settings (whatsapp_number, nome_plataforma, email_suporte, telefone_suporte)
VALUES ('5515997625135', 'i ESCOLAS', 'suporte@iescolas.com.br', '(11) 99999-9999');

-- Trigger para updated_at
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
