CREATE TABLE public.notificacoes_chamada (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  escola_id uuid,
  aluno_nome text NOT NULL,
  aluno_matricula text,
  responsavel_nome text,
  telefone text,
  telegram_chat_id text,
  status_chamada text NOT NULL,
  disciplina text,
  turma text,
  data_chamada date NOT NULL,
  canal text NOT NULL,
  status_envio text NOT NULL DEFAULT 'pendente',
  erro text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notificacoes_chamada ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin e escola podem ver notificacoes"
  ON public.notificacoes_chamada FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'escola'::app_role));

CREATE POLICY "Admin e escola podem inserir notificacoes"
  ON public.notificacoes_chamada FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'escola'::app_role));

CREATE POLICY "Admin e escola podem atualizar notificacoes"
  ON public.notificacoes_chamada FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'escola'::app_role));