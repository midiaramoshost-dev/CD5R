
-- Tabela para armazenar configurações de gateways de pagamento
CREATE TABLE public.payment_gateways (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  logo text NOT NULL DEFAULT '💳',
  enabled boolean NOT NULL DEFAULT false,
  api_key text NOT NULL DEFAULT '',
  secret_key text NOT NULL DEFAULT '',
  sandbox boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- Only admins can manage gateways
CREATE POLICY "Admins podem ver gateways" ON public.payment_gateways
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir gateways" ON public.payment_gateways
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar gateways" ON public.payment_gateways
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar gateways" ON public.payment_gateways
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Edge functions need to read gateway configs (service role bypasses RLS)
-- No additional policy needed since edge functions use service_role key

-- Trigger for updated_at
CREATE TRIGGER update_payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default gateways
INSERT INTO public.payment_gateways (id, name, logo, enabled, api_key, secret_key, sandbox) VALUES
  ('mercadopago', 'Mercado Pago', '🟡', false, '', '', true),
  ('asaas', 'Asaas', '🔵', false, '', '', true),
  ('stripe', 'Stripe', '💳', false, '', '', true),
  ('pagseguro', 'PagSeguro', '🟢', false, '', '', true);
