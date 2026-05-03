import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileSignature, Send, Download, Users, FileCheck2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

const ALUNOS = [
  { id: "1", nome: "Ana Carolina Silva", responsavel: "Maria Silva", cpf: "111.222.333-44", turma: "9º A", valor: 1200 },
  { id: "2", nome: "Bruno Henrique Costa", responsavel: "Carlos Costa", cpf: "222.333.444-55", turma: "9º A", valor: 1200 },
  { id: "3", nome: "Carla Beatriz Oliveira", responsavel: "Lucia Oliveira", cpf: "333.444.555-66", turma: "8º B", valor: 1100 },
  { id: "4", nome: "Daniel Souza Lima", responsavel: "Roberto Lima", cpf: "444.555.666-77", turma: "8º B", valor: 1100 },
  { id: "5", nome: "Eduarda Martins", responsavel: "Sandra Martins", cpf: "555.666.777-88", turma: "1º EM", valor: 1450 },
  { id: "6", nome: "Felipe Almeida", responsavel: "Pedro Almeida", cpf: "666.777.888-99", turma: "1º EM", valor: 1450 },
];

const TEMPLATE_PADRAO = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS - {{ANO}}

CONTRATANTE: {{RESPONSAVEL}}, CPF {{CPF}}
ALUNO: {{ALUNO}} - Turma {{TURMA}}
CONTRATADA: i ESCOLAS - Instituição de Ensino

OBJETO: Prestação de serviços educacionais para o ano letivo de {{ANO}}.

VALOR: R$ {{VALOR}} mensais, com vencimento todo dia 10.
PARCELAS: 12 (doze) parcelas iguais.

CLÁUSULAS:
1. O CONTRATANTE compromete-se a efetuar os pagamentos pontualmente.
2. A CONTRATADA prestará os serviços conforme calendário escolar.
3. Multa de 2% e juros de 1% ao mês em caso de atraso.
4. Rescisão mediante aviso prévio de 30 dias.

Sorocaba, {{DATA}}.

_____________________________
{{RESPONSAVEL}}`;

export default function ContratosMassa() {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [filtroTurma, setFiltroTurma] = useState("todas");
  const [template, setTemplate] = useState(TEMPLATE_PADRAO);
  const [ano, setAno] = useState("2026");
  const [progresso, setProgresso] = useState(0);
  const [gerando, setGerando] = useState(false);

  const alunosFiltrados = ALUNOS.filter((a) => filtroTurma === "todas" || a.turma === filtroTurma);

  const toggle = (id: string) =>
    setSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleTodos = () =>
    setSelecionados((prev) => (prev.length === alunosFiltrados.length ? [] : alunosFiltrados.map((a) => a.id)));

  const renderizar = (aluno: typeof ALUNOS[0]) =>
    template
      .replace(/{{ANO}}/g, ano)
      .replace(/{{RESPONSAVEL}}/g, aluno.responsavel)
      .replace(/{{CPF}}/g, aluno.cpf)
      .replace(/{{ALUNO}}/g, aluno.nome)
      .replace(/{{TURMA}}/g, aluno.turma)
      .replace(/{{VALOR}}/g, aluno.valor.toFixed(2))
      .replace(/{{DATA}}/g, new Date().toLocaleDateString("pt-BR"));

  const gerarMassa = async () => {
    if (selecionados.length === 0) {
      toast.error("Selecione ao menos um aluno");
      return;
    }
    setGerando(true);
    setProgresso(0);
    const doc = new jsPDF();
    const lista = ALUNOS.filter((a) => selecionados.includes(a.id));

    for (let i = 0; i < lista.length; i++) {
      if (i > 0) doc.addPage();
      const aluno = lista[i];
      const texto = renderizar(aluno);
      doc.setFontSize(10);
      const linhas = doc.splitTextToSize(texto, 180);
      doc.text(linhas, 14, 20);
      setProgresso(Math.round(((i + 1) / lista.length) * 100));
      await new Promise((r) => setTimeout(r, 50));
    }
    doc.save(`contratos_${ano}_${selecionados.length}_alunos.pdf`);

    const historico = JSON.parse(localStorage.getItem("contratos_emitidos") || "[]");
    lista.forEach((a) => {
      historico.push({
        id: crypto.randomUUID(),
        alunoId: a.id,
        aluno: a.nome,
        ano,
        valor: a.valor,
        emitidoEm: new Date().toISOString(),
        status: "emitido",
      });
    });
    localStorage.setItem("contratos_emitidos", JSON.stringify(historico));

    setGerando(false);
    toast.success(`${lista.length} contratos gerados com sucesso!`);
  };

  const enviarEmail = () => {
    if (selecionados.length === 0) {
      toast.error("Selecione ao menos um aluno");
      return;
    }
    toast.success(`${selecionados.length} contratos enviados por e-mail aos responsáveis`);
  };

  const valorTotal = ALUNOS.filter((a) => selecionados.includes(a.id)).reduce((s, a) => s + a.valor * 12, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contratos em Massa</h1>
        <p className="text-muted-foreground">Geração e envio de contratos para múltiplos alunos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Selecionados</p><p className="text-3xl font-bold">{selecionados.length}</p></div><Users className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Valor Anual</p><p className="text-3xl font-bold">R$ {valorTotal.toLocaleString("pt-BR")}</p></div><FileCheck2 className="h-8 w-8 text-emerald-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Alunos</p><p className="text-3xl font-bold">{ALUNOS.length}</p></div><FileSignature className="h-8 w-8 text-sky-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Ano Letivo</p><p className="text-3xl font-bold">{ano}</p></div><AlertCircle className="h-8 w-8 text-amber-500" /></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Selecionar Alunos</CardTitle>
                <CardDescription>Marque os alunos para gerar contratos em lote</CardDescription>
              </div>
              <Select value={filtroTurma} onValueChange={setFiltroTurma}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as turmas</SelectItem>
                  <SelectItem value="8º B">8º B</SelectItem>
                  <SelectItem value="9º A">9º A</SelectItem>
                  <SelectItem value="1º EM">1º EM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selecionados.length === alunosFiltrados.length && alunosFiltrados.length > 0}
                      onCheckedChange={toggleTodos}
                    />
                  </TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead className="text-right">Valor/mês</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosFiltrados.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell><Checkbox checked={selecionados.includes(a.id)} onCheckedChange={() => toggle(a.id)} /></TableCell>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell>{a.responsavel}</TableCell>
                    <TableCell><Badge variant="outline">{a.turma}</Badge></TableCell>
                    <TableCell className="text-right">R$ {a.valor.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>Personalize o template do contrato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Ano Letivo</Label>
              <Input value={ano} onChange={(e) => setAno(e.target.value)} />
            </div>
            <div>
              <Label>Template do Contrato</Label>
              <Textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Variáveis: {`{{ALUNO}} {{RESPONSAVEL}} {{CPF}} {{TURMA}} {{VALOR}} {{ANO}} {{DATA}}`}
              </p>
            </div>
            {gerando && (
              <div className="space-y-2">
                <Progress value={progresso} />
                <p className="text-xs text-muted-foreground text-center">{progresso}% gerando...</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Button onClick={gerarMassa} disabled={gerando} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Gerar PDF em Lote
              </Button>
              <Button variant="outline" onClick={enviarEmail} disabled={gerando} className="w-full">
                <Send className="mr-2 h-4 w-4" /> Enviar por E-mail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
