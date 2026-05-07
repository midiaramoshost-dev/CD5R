-- Tabela para rastrear sessões de teste por IP
CREATE TABLE public.trial_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  fingerprint text,
  user_agent text,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '72 hours'),
  blocked boolean NOT NULL DEFAULT false,
  blocked_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_trial_sessions_ip ON public.trial_sessions(ip_address);
CREATE INDEX idx_trial_sessions_fingerprint ON public.trial_sessions(fingerprint);

ALTER TABLE public.trial_sessions ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ler/modificar diretamente; a edge function usa service role
CREATE POLICY "Admins podem ver trial_sessions"
  ON public.trial_sessions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar trial_sessions"
  ON public.trial_sessions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar trial_sessions"
  ON public.trial_sessions FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_trial_sessions_updated_at
BEFORE UPDATE ON public.trial_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trial das escolas após cadastro: adicionar coluna de expiração
ALTER TABLE public.escolas
ADD COLUMN IF NOT EXISTS trial_expires_at timestamp with time zone;

-- Backfill: escolas em trial começam com 72h a partir do cadastro
UPDATE public.escolas
SET trial_expires_at = created_at + interval '72 hours'
WHERE status = 'trial' AND trial_expires_at IS NULL;