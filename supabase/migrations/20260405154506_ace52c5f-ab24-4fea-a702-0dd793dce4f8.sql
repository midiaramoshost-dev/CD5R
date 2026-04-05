
-- Plano de Contas
CREATE TABLE public.plano_contas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  escola_id uuid NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  codigo text NOT NULL,
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ativo','passivo','receita','despesa','patrimonio_liquido')),
  grupo text NOT NULL,
  natureza text NOT NULL CHECK (natureza IN ('devedora','credora')),
  conta_pai_id uuid REFERENCES public.plano_contas(id) ON DELETE SET NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(escola_id, codigo)
);

ALTER TABLE public.plano_contas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Escola pode ver proprio plano de contas" ON public.plano_contas FOR SELECT USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode inserir plano de contas" ON public.plano_contas FOR INSERT WITH CHECK (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode atualizar plano de contas" ON public.plano_contas FOR UPDATE USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode deletar plano de contas" ON public.plano_contas FOR DELETE USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

-- Centros de Custo
CREATE TABLE public.centros_custo (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  escola_id uuid NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  codigo text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(escola_id, codigo)
);

ALTER TABLE public.centros_custo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Escola pode ver centros de custo" ON public.centros_custo FOR SELECT USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode inserir centros de custo" ON public.centros_custo FOR INSERT WITH CHECK (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode atualizar centros de custo" ON public.centros_custo FOR UPDATE USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode deletar centros de custo" ON public.centros_custo FOR DELETE USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

-- Lançamentos Contábeis
CREATE TABLE public.lancamentos_contabeis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  escola_id uuid NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  numero integer NOT NULL,
  data_competencia date NOT NULL,
  data_caixa date,
  descricao text NOT NULL,
  numero_documento text,
  tipo_documento text,
  status text NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho','confirmado','estornado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(escola_id, numero)
);

ALTER TABLE public.lancamentos_contabeis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Escola pode ver lancamentos" ON public.lancamentos_contabeis FOR SELECT USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode inserir lancamentos" ON public.lancamentos_contabeis FOR INSERT WITH CHECK (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode atualizar lancamentos" ON public.lancamentos_contabeis FOR UPDATE USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode deletar lancamentos" ON public.lancamentos_contabeis FOR DELETE USING (
  escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

-- Lançamento Itens (Partidas Dobradas)
CREATE TABLE public.lancamento_itens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lancamento_id uuid NOT NULL REFERENCES public.lancamentos_contabeis(id) ON DELETE CASCADE,
  conta_id uuid NOT NULL REFERENCES public.plano_contas(id),
  tipo text NOT NULL CHECK (tipo IN ('debito','credito')),
  valor numeric NOT NULL CHECK (valor > 0),
  historico text,
  centro_custo_id uuid REFERENCES public.centros_custo(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lancamento_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Escola pode ver itens de lancamento" ON public.lancamento_itens FOR SELECT USING (
  lancamento_id IN (SELECT id FROM public.lancamentos_contabeis WHERE escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid()))
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode inserir itens de lancamento" ON public.lancamento_itens FOR INSERT WITH CHECK (
  lancamento_id IN (SELECT id FROM public.lancamentos_contabeis WHERE escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid()))
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode atualizar itens de lancamento" ON public.lancamento_itens FOR UPDATE USING (
  lancamento_id IN (SELECT id FROM public.lancamentos_contabeis WHERE escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid()))
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Escola pode deletar itens de lancamento" ON public.lancamento_itens FOR DELETE USING (
  lancamento_id IN (SELECT id FROM public.lancamentos_contabeis WHERE escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid()))
  OR has_role(auth.uid(), 'admin')
);

-- Triggers de updated_at
CREATE TRIGGER update_plano_contas_updated_at BEFORE UPDATE ON public.plano_contas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_centros_custo_updated_at BEFORE UPDATE ON public.centros_custo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lancamentos_contabeis_updated_at BEFORE UPDATE ON public.lancamentos_contabeis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_plano_contas_escola ON public.plano_contas(escola_id);
CREATE INDEX idx_centros_custo_escola ON public.centros_custo(escola_id);
CREATE INDEX idx_lancamentos_escola_data ON public.lancamentos_contabeis(escola_id, data_competencia);
CREATE INDEX idx_lancamento_itens_lancamento ON public.lancamento_itens(lancamento_id);
CREATE INDEX idx_lancamento_itens_conta ON public.lancamento_itens(conta_id);
