import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, Save, ClipboardCheck, Search, Download, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Status = "presente" | "falta" | "atraso" | "justificada";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  responsavel_nome?: string;
  telefone?: string;
  telegram_chat_id?: string;
}

interface Chamada {
  data: string;
  turma: string;
  disciplina: string;
  registros: Record<string, Status>;
}

const ALUNOS_MOCK: Aluno[] = [
  { id: "1", nome: "Ana Carolina Silva", matricula: "2025001", responsavel_nome: "Maria Silva", telefone: "+5515999990001" },
  { id: "2", nome: "Bruno Henrique Costa", matricula: "2025002", responsavel_nome: "José Costa", telefone: "+5515999990002" },
  { id: "3", nome: "Carla Beatriz Oliveira", matricula: "2025003", responsavel_nome: "Paula Oliveira", telefone: "+5515999990003" },
  { id: "4", nome: "Daniel Souza Lima", matricula: "2025004", responsavel_nome: "Ricardo Lima", telefone: "+5515999990004" },
  { id: "5", nome: "Eduarda Martins", matricula: "2025005", responsavel_nome: "Sandra Martins", telefone: "+5515999990005" },
  { id: "6", nome: "Felipe Almeida", matricula: "2025006", responsavel_nome: "Carlos Almeida", telefone: "+5515999990006" },
  { id: "7", nome: "Gabriela Ribeiro", matricula: "2025007", responsavel_nome: "Lucia Ribeiro", telefone: "+5515999990007" },
  { id: "8", nome: "Henrique Pereira", matricula: "2025008", responsavel_nome: "André Pereira", telefone: "+5515999990008" },
  { id: "9", nome: "Isabela Fernandes", matricula: "2025009", responsavel_nome: "Beatriz Fernandes", telefone: "+5515999990009" },
  { id: "10", nome: "João Pedro Santos", matricula: "2025010", responsavel_nome: "Marcelo Santos", telefone: "+5515999990010" },
];

const STATUS_CONFIG: Record<Status, { label: string; icon: any; className: string }> = {
  presente: { label: "Presente", icon: Check, className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  falta: { label: "Falta", icon: X, className: "bg-rose-500 hover:bg-rose-600 text-white" },
  atraso: { label: "Atraso", icon: Clock, className: "bg-amber-500 hover:bg-amber-600 text-white" },
  justificada: { label: "Justificada", icon: ClipboardCheck, className: "bg-sky-500 hover:bg-sky-600 text-white" },
};

export default function ChamadaEletronica() {
  const [turma, setTurma] = useState("9-A");
  const [disciplina, setDisciplina] = useState("Matemática");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [busca, setBusca] = useState("");
  const [registros, setRegistros] = useState<Record<string, Status>>({});

  const chaveAtual = `chamada_${turma}_${disciplina}_${data}`;

  useEffect(() => {
    const saved = localStorage.getItem(chaveAtual);
    if (saved) {
      setRegistros(JSON.parse(saved));
    } else {
      const inicial: Record<string, Status> = {};
      ALUNOS_MOCK.forEach((a) => (inicial[a.id] = "presente"));
      setRegistros(inicial);
    }
  }, [chaveAtual]);

  const setStatus = (alunoId: string, status: Status) => {
    setRegistros((prev) => ({ ...prev, [alunoId]: status }));
  };

  const marcarTodos = (status: Status) => {
    const todos: Record<string, Status> = {};
    ALUNOS_MOCK.forEach((a) => (todos[a.id] = status));
    setRegistros(todos);
  };

  const salvar = () => {
    const chamadas: Chamada[] = JSON.parse(localStorage.getItem("chamadas") || "[]");
    const idx = chamadas.findIndex(
      (c) => c.data === data && c.turma === turma && c.disciplina === disciplina
    );
    const nova: Chamada = { data, turma, disciplina, registros };
    if (idx >= 0) chamadas[idx] = nova;
    else chamadas.push(nova);
    localStorage.setItem("chamadas", JSON.stringify(chamadas));
    localStorage.setItem(chaveAtual, JSON.stringify(registros));
    toast.success("Chamada salva com sucesso!");
  };

  const exportarCSV = () => {
    const linhas = ["Matrícula,Aluno,Status"];
    ALUNOS_MOCK.forEach((a) => {
      linhas.push(`${a.matricula},${a.nome},${STATUS_CONFIG[registros[a.id] || "presente"].label}`);
    });
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chamada_${turma}_${data}.csv`;
    link.click();
  };

  const [enviando, setEnviando] = useState(false);
  const notificarResponsaveis = async () => {
    const destinatarios = ALUNOS_MOCK
      .filter((a) => registros[a.id] === "falta" || registros[a.id] === "atraso")
      .map((a) => ({
        aluno_nome: a.nome,
        aluno_matricula: a.matricula,
        responsavel_nome: a.responsavel_nome,
        telefone: a.telefone,
        telegram_chat_id: a.telegram_chat_id,
        status_chamada: registros[a.id] as "falta" | "atraso",
      }));

    if (!destinatarios.length) {
      toast.info("Nenhum aluno com falta ou atraso para notificar.");
      return;
    }

    setEnviando(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("notificar-responsavel", {
        body: { destinatarios, disciplina, turma, data },
      });
      if (error) throw error;
      const enviados = resp?.enviados ?? 0;
      const total = resp?.total ?? 0;
      if (total === 0) {
        toast.warning("Nenhum canal de envio configurado. Conecte Twilio e/ou Telegram nos secrets.");
      } else {
        toast.success(`Notificações enviadas: ${enviados}/${total}`);
      }
    } catch (e: any) {
      toast.error("Falha ao notificar: " + (e?.message ?? e));
    } finally {
      setEnviando(false);
    }
  };

  const alunosFiltrados = ALUNOS_MOCK.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const contagens = {
    presente: Object.values(registros).filter((s) => s === "presente").length,
    falta: Object.values(registros).filter((s) => s === "falta").length,
    atraso: Object.values(registros).filter((s) => s === "atraso").length,
    justificada: Object.values(registros).filter((s) => s === "justificada").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chamada Eletrônica</h1>
          <p className="text-muted-foreground">Registro digital de presenças e faltas</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={exportarCSV}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button variant="outline" onClick={notificarResponsaveis} disabled={enviando}>
            {enviando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Notificar Responsáveis
          </Button>
          <Button onClick={salvar}>
            <Save className="mr-2 h-4 w-4" /> Salvar Chamada
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros da Chamada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Data</Label>
              <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div>
              <Label>Turma</Label>
              <Select value={turma} onValueChange={setTurma}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-A">6º Ano A</SelectItem>
                  <SelectItem value="7-A">7º Ano A</SelectItem>
                  <SelectItem value="8-A">8º Ano A</SelectItem>
                  <SelectItem value="9-A">9º Ano A</SelectItem>
                  <SelectItem value="1-EM">1º EM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Disciplina</Label>
              <Select value={disciplina} onValueChange={setDisciplina}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Português">Português</SelectItem>
                  <SelectItem value="História">História</SelectItem>
                  <SelectItem value="Geografia">Geografia</SelectItem>
                  <SelectItem value="Ciências">Ciências</SelectItem>
                  <SelectItem value="Inglês">Inglês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar aluno</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <Card key={s}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{cfg.label}s</p>
                    <p className="text-3xl font-bold">{contagens[s]}</p>
                  </div>
                  <div className={`rounded-full p-3 ${cfg.className}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle>Lista de Chamada</CardTitle>
              <CardDescription>{turma} • {disciplina} • {new Date(data).toLocaleDateString("pt-BR")}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => marcarTodos("presente")}>
                Todos presentes
              </Button>
              <Button size="sm" variant="outline" onClick={() => marcarTodos("falta")}>
                Todos faltas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunosFiltrados.map((aluno) => {
                const statusAtual = registros[aluno.id] || "presente";
                return (
                  <TableRow key={aluno.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{aluno.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{aluno.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{aluno.matricula}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
                          const cfg = STATUS_CONFIG[s];
                          const Icon = cfg.icon;
                          const ativo = statusAtual === s;
                          return (
                            <Button
                              key={s}
                              size="sm"
                              variant={ativo ? "default" : "outline"}
                              className={ativo ? cfg.className : ""}
                              onClick={() => setStatus(aluno.id, s)}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="hidden lg:inline ml-1">{cfg.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
