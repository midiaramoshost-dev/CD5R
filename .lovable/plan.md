

## Funcionalidade Real para Botoes Ver, Baixar e Assistir - Materiais do Aluno

### Resumo
Adicionar funcionalidade real aos botoes da pagina de Materiais do Aluno, criando infraestrutura no Supabase (tabela + storage bucket) para armazenamento de arquivos e implementando visualizacao, download e reproducao de video no frontend.

### O que sera feito

1. **Criar tabela `materiais_didaticos` no banco de dados** com campos: id, titulo, disciplina, professor, tipo (pdf/video/slides/imagem), descricao, arquivo_path, tamanho, duracao, url_externa, escola_id, created_at.

2. **Criar bucket de storage `materiais`** (publico) para armazenar os arquivos, com politicas RLS que permitem leitura para usuarios autenticados e upload apenas para perfis de escola/professor.

3. **Implementar funcionalidades dos botoes**:
   - **Baixar**: Gera URL publica do Supabase Storage e dispara download via `<a download>`.
   - **Ver**: Abre um Dialog/modal com preview do conteudo (PDF em iframe, imagem em `<img>`, slides em iframe).
   - **Assistir**: Abre um Dialog/modal com player de video (`<video>` nativo ou iframe para URLs externas como YouTube).

4. **Atualizar a pagina de Materiais** para buscar dados reais do Supabase em vez de dados mock, mantendo os dados mock como fallback enquanto nao ha materiais cadastrados.

### Detalhes Tecnicos

**Migracao SQL:**
```sql
CREATE TABLE public.materiais_didaticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  professor TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('pdf','video','slides','imagem')),
  descricao TEXT,
  arquivo_path TEXT,
  url_externa TEXT,
  tamanho TEXT,
  duracao TEXT,
  escola_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.materiais_didaticos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados podem ler materiais"
  ON public.materiais_didaticos FOR SELECT
  TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('materiais', 'materiais', true);

CREATE POLICY "Leitura publica materiais"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'materiais');
```

**Componentes novos:**
- `src/components/materiais/VisualizarMaterialDialog.tsx` - Modal para preview de PDFs, imagens e slides
- `src/components/materiais/VideoPlayerDialog.tsx` - Modal com player de video

**Alteracoes em arquivos existentes:**
- `src/pages/aluno/Materiais.tsx` - Substituir dados mock por query ao Supabase via React Query, conectar botoes aos dialogs de visualizacao/download

**Fluxo de download:**
```text
Botao Baixar -> supabase.storage.from('materiais').getPublicUrl(path)
             -> Criar elemento <a> com href e download
             -> Disparar click programatico
```

**Fluxo de visualizacao:**
```text
Botao Ver/Assistir -> Abrir Dialog com material selecionado
                   -> PDF/Slides: <iframe src={publicUrl}>
                   -> Imagem: <img src={publicUrl}>
                   -> Video: <video src={publicUrl}> ou <iframe> para YouTube
```

Os dados mock serao mantidos como fallback visual caso a tabela esteja vazia, garantindo que a pagina nunca fique em branco.

