import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Send, Users, GraduationCap, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const ALUNOS_REMAT = [
  { id: "1", nome: "Ana Carolina Silva", turmaAtual: "9º A", proximaSerie: "1º EM", responsavel: "Maria Silva", status: "pendente", situacao: "Aprovado" },
  { id: "2", nome: "Bruno Henrique Costa", turmaAtual: "9º A", proximaSerie: "1º EM", responsavel: "Carlos Costa", status: "pendente", situacao: "Aprovado" },
  { id: "3", nome: "Carla Beatriz Oliveira", turmaAtual: "8º B", proximaSerie: "9º B", responsavel: "Lucia Oliveira", status: "confirmada", situacao: "Aprovado" },
  { id: "4", nome: "Daniel Souza Lima", turmaAtual: "8º B", proximaSerie: "9º B", responsavel: "Roberto Lima", status: "pendente", situacao: "Aprovado" },
  { id: "5", nome: "Eduarda Martins", turmaAtual: "1º EM", proximaSerie: "2º EM", responsavel: "Sandra Martins", status: "pendente", situacao: "Aprovado" },
  { id: "6", nome: "Felipe Almeida", turmaAtual: "1º EM", proximaSerie: "1º EM", responsavel: "Pedro Almeida", status: "pendente", situacao: "Reprovado" },
  { id: "7", nome: "Gabriela Ribeiro", turmaAtual: "7º A", proximaSerie: "8º A", responsavel: "Helena Ribeiro", status: "pendente", situacao: "Aprovado" },
  { id: "8", nome: "Henrique Pereira", turmaAtual: "6º A", proximaSerie: "7º A", responsavel: "Marcos Pereira", status: "recusada", situacao: "Aprovado" },
];

export default function RematriculasMassa() {
  const [alunos, setAlunos] = useState(ALUNOS_REMAT);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [anoLetivo, setAnoLetivo] = useState("2026");
  const [reajuste, setReajuste] = useState("8");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [progresso, setProgresso] = useState(0);
  const [processando, setProcessando] = useState(false);

  const filtrados = alunos.filter((a) => filtroStatus === "todos" || a.status === filtroStatus);

  const toggle = (id: string) =>
    setSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleTodos = () =>
    setSelecionados((prev) => (prev.length === filtrados.length ? [] : filtrados.map((a) => a.id)));

  const efetivar = async () => {
    if (selecionados.length === 0) {
      toast.error("Selecione ao menos um aluno");
      return;
    }
    setProcessando(true);
    setProgresso(0);
    const total = selecionados.length;
    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 200));
      setProgresso(Math.round(((i + 1) / total) * 100));
    }
    setAlunos((prev) =>
      prev.map((a) => (selecionados.includes(a.id) ? { ...a, status: "confirmada" } : a))
    );

    const historico = JSON.parse(localStorage.getItem("rematriculas") || "[]");
    selecionados.forEach((id) => {
      const aluno = alunos.find((a) => a.id === id);
      if (aluno) {
        historico.push({
          id: crypto.randomUUID(),
          alunoId: id,
          aluno: aluno.nome,
          de: aluno.turmaAtual,
          para: aluno.proximaSerie,
          ano: anoLetivo,
          reajuste: Number(reajuste),
          confirmadaEm: new Date().toISOString(),
        });
      }
    });
    localStorage.setItem("rematriculas", JSON.stringify(historico));

    setSelecionados([]);
    setProcessando(false);
    toast.success(`${total} rematrículas efetivadas para ${anoLetivo}!`);
  };

  const enviarConvites = () => {
    if (selecionados.length === 0) {
      toast.error("Selecione ao menos um aluno");
      return;
    }
    toast.success(`Convites de rematrícula enviados a ${selecionados.length} responsáveis`);
  };

  const stats = {
    total: alunos.length,
    confirmadas: alunos.filter((a) => a.status === "confirmada").length,
    pendentes: alunos.filter((a) => a.status === "pendente").length,
    recusadas: alunos.filter((a) => a.status === "recusada").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rematrículas em Massa</h1>
        <p className="text-muted-foreground">Renove a matrícula de múltiplos alunos para o próximo ano letivo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-3xl font-bold">{stats.total}</p></div><Users className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Confirmadas</p><p className="text-3xl font-bold text-emerald-600">{stats.confirmadas}</p></div><CheckCircle2 className="h-8 w-8 text-emerald-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-3xl font-bold text-amber-600">{stats.pendentes}</p></div><RefreshCw className="h-8 w-8 text-amber-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Taxa</p><p className="text-3xl font-bold">{Math.round((stats.confirmadas / stats.total) * 100)}%</p></div><TrendingUp className="h-8 w-8 text-sky-500" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração da Rematrícula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Ano Letivo</Label>
              <Input value={anoLetivo} onChange={(e) => setAnoLetivo(e.target.value)} />
            </div>
            <div>
              <Label>Reajuste de mensalidade (%)</Label>
              <Input type="number" value={reajuste} onChange={(e) => setReajuste(e.target.value)} />
            </div>
            <div>
              <Label>Filtrar por status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="recusada">Recusadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle>Alunos Elegíveis</CardTitle>
              <CardDescription>{selecionados.length} de {filtrados.length} selecionado(s)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={enviarConvites} disabled={processando}>
                <Send className="mr-2 h-4 w-4" /> Enviar Convites
              </Button>
              <Button onClick={efetivar} disabled={processando}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Efetivar Rematrículas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {processando && (
            <div className="mb-4 space-y-2">
              <Progress value={progresso} />
              <p className="text-xs text-muted-foreground text-center">Processando {progresso}%...</p>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selecionados.length === filtrados.length && filtrados.length > 0}
                    onCheckedChange={toggleTodos}
                  />
                </TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Turma Atual</TableHead>
                <TableHead>Próxima Série</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Checkbox
                      checked={selecionados.includes(a.id)}
                      onCheckedChange={() => toggle(a.id)}
                      disabled={a.situacao === "Reprovado"}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{a.nome}</TableCell>
                  <TableCell>{a.responsavel}</TableCell>
                  <TableCell><Badge variant="outline">{a.turmaAtual}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <Badge>{a.proximaSerie}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={a.situacao === "Aprovado" ? "bg-emerald-500" : "bg-rose-500"}>
                      {a.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={a.status === "confirmada" ? "default" : "outline"} className={
                      a.status === "confirmada" ? "bg-emerald-500" :
                      a.status === "recusada" ? "border-rose-500 text-rose-500" :
                      "border-amber-500 text-amber-600"
                    }>
                      {a.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
