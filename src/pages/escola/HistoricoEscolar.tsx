import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, Download, Search, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface AnoLetivo {
  ano: number;
  serie: string;
  escola: string;
  disciplinas: { nome: string; nota: number; cargaHoraria: number; situacao: string }[];
  cargaTotal: number;
  freq: number;
  resultado: "Aprovado" | "Reprovado" | "Em curso";
}

const ALUNOS = [
  { id: "1", nome: "Ana Carolina Silva", matricula: "2025001", nascimento: "12/03/2009", rg: "55.123.456-7", responsavel: "Maria Silva" },
  { id: "2", nome: "Bruno Henrique Costa", matricula: "2025002", nascimento: "07/08/2008", rg: "55.234.567-8", responsavel: "Carlos Costa" },
  { id: "3", nome: "Carla Beatriz Oliveira", matricula: "2025003", nascimento: "23/11/2009", rg: "55.345.678-9", responsavel: "Lucia Oliveira" },
];

const HISTORICO_MOCK: Record<string, AnoLetivo[]> = {
  "1": [
    {
      ano: 2022, serie: "6º Ano EF", escola: "Colégio Modelo", cargaTotal: 800, freq: 96, resultado: "Aprovado",
      disciplinas: [
        { nome: "Língua Portuguesa", nota: 8.5, cargaHoraria: 160, situacao: "Aprovado" },
        { nome: "Matemática", nota: 7.8, cargaHoraria: 160, situacao: "Aprovado" },
        { nome: "História", nota: 9.0, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Geografia", nota: 8.7, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Ciências", nota: 8.2, cargaHoraria: 120, situacao: "Aprovado" },
        { nome: "Inglês", nota: 9.5, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Educação Física", nota: 9.8, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Arte", nota: 9.0, cargaHoraria: 40, situacao: "Aprovado" },
      ],
    },
    {
      ano: 2023, serie: "7º Ano EF", escola: "Colégio Modelo", cargaTotal: 800, freq: 94, resultado: "Aprovado",
      disciplinas: [
        { nome: "Língua Portuguesa", nota: 8.7, cargaHoraria: 160, situacao: "Aprovado" },
        { nome: "Matemática", nota: 8.3, cargaHoraria: 160, situacao: "Aprovado" },
        { nome: "História", nota: 9.2, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Geografia", nota: 8.5, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Ciências", nota: 8.8, cargaHoraria: 120, situacao: "Aprovado" },
        { nome: "Inglês", nota: 9.7, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Educação Física", nota: 9.5, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Arte", nota: 9.2, cargaHoraria: 40, situacao: "Aprovado" },
      ],
    },
    {
      ano: 2024, serie: "8º Ano EF", escola: "Colégio Modelo", cargaTotal: 800, freq: 97, resultado: "Aprovado",
      disciplinas: [
        { nome: "Língua Portuguesa", nota: 9.0, cargaHoraria: 160, situacao: "Aprovado" },
        { nome: "Matemática", nota: 8.7, cargaHoraria: 160, situacao: "Aprovado" },
        { nome: "História", nota: 9.5, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Geografia", nota: 8.9, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Ciências", nota: 9.0, cargaHoraria: 120, situacao: "Aprovado" },
        { nome: "Inglês", nota: 9.8, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Educação Física", nota: 9.7, cargaHoraria: 80, situacao: "Aprovado" },
        { nome: "Arte", nota: 9.4, cargaHoraria: 40, situacao: "Aprovado" },
      ],
    },
    {
      ano: 2025, serie: "9º Ano EF", escola: "Colégio Modelo", cargaTotal: 800, freq: 95, resultado: "Em curso",
      disciplinas: [
        { nome: "Língua Portuguesa", nota: 8.8, cargaHoraria: 160, situacao: "Em curso" },
        { nome: "Matemática", nota: 9.0, cargaHoraria: 160, situacao: "Em curso" },
      ],
    },
  ],
};

export default function HistoricoEscolar() {
  const [busca, setBusca] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("1");
  const printRef = useRef<HTMLDivElement>(null);

  const aluno = ALUNOS.find((a) => a.id === alunoSelecionado);
  const historico = HISTORICO_MOCK[alunoSelecionado] || [];

  const alunosFiltrados = ALUNOS.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) || a.matricula.includes(busca)
  );

  const gerarPDF = () => {
    if (!aluno) return;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("HISTÓRICO ESCOLAR", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(10);
    doc.text("Ensino Fundamental II", 105, y, { align: "center" });
    y += 12;

    doc.setFontSize(11);
    doc.text(`Aluno: ${aluno.nome}`, 14, y); y += 6;
    doc.text(`Matrícula: ${aluno.matricula}`, 14, y);
    doc.text(`Nascimento: ${aluno.nascimento}`, 110, y); y += 6;
    doc.text(`RG: ${aluno.rg}`, 14, y);
    doc.text(`Responsável: ${aluno.responsavel}`, 110, y); y += 10;

    historico.forEach((ano) => {
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`${ano.ano} • ${ano.serie} • ${ano.escola}`, 14, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.text("Disciplina", 14, y);
      doc.text("C/H", 110, y);
      doc.text("Nota", 140, y);
      doc.text("Situação", 170, y);
      y += 4;
      doc.line(14, y, 196, y);
      y += 4;
      ano.disciplinas.forEach((d) => {
        doc.text(d.nome, 14, y);
        doc.text(String(d.cargaHoraria), 110, y);
        doc.text(d.nota.toFixed(1), 140, y);
        doc.text(d.situacao, 170, y);
        y += 5;
        if (y > 270) { doc.addPage(); y = 20; }
      });
      doc.setFont(undefined, "bold");
      doc.text(`Carga Horária Total: ${ano.cargaTotal}h`, 14, y);
      doc.text(`Frequência: ${ano.freq}%`, 90, y);
      doc.text(`Resultado: ${ano.resultado}`, 150, y);
      y += 10;
      if (y > 250) { doc.addPage(); y = 20; }
    });

    doc.save(`historico_${aluno.matricula}.pdf`);
    toast.success("Histórico gerado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico Escolar</h1>
          <p className="text-muted-foreground">Emissão e consulta de histórico acadêmico</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Selecionar Aluno</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            <div className="space-y-1 max-h-[500px] overflow-auto">
              {alunosFiltrados.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAlunoSelecionado(a.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    alunoSelecionado === a.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                >
                  <p className="font-medium text-sm">{a.nome}</p>
                  <p className="text-xs text-muted-foreground">Mat. {a.matricula}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {aluno && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{aluno.nome}</CardTitle>
                        <CardDescription>Matrícula {aluno.matricula} • Nasc. {aluno.nascimento}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Imprimir
                      </Button>
                      <Button onClick={gerarPDF}>
                        <Download className="mr-2 h-4 w-4" /> Baixar PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><Label className="text-muted-foreground">RG</Label><p>{aluno.rg}</p></div>
                    <div><Label className="text-muted-foreground">Responsável</Label><p>{aluno.responsavel}</p></div>
                    <div><Label className="text-muted-foreground">Anos cursados</Label><p>{historico.length}</p></div>
                    <div><Label className="text-muted-foreground">Status</Label><Badge>Ativo</Badge></div>
                  </div>
                </CardContent>
              </Card>

              <div ref={printRef} className="space-y-4">
                {historico.map((ano) => (
                  <Card key={ano.ano}>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg">{ano.ano} — {ano.serie}</CardTitle>
                            <CardDescription>{ano.escola}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">C/H: {ano.cargaTotal}h</Badge>
                          <Badge variant="outline">Freq: {ano.freq}%</Badge>
                          <Badge className={ano.resultado === "Aprovado" ? "bg-emerald-500" : ano.resultado === "Reprovado" ? "bg-rose-500" : "bg-amber-500"}>
                            {ano.resultado}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Disciplina</TableHead>
                            <TableHead>C/H</TableHead>
                            <TableHead>Nota Final</TableHead>
                            <TableHead>Situação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ano.disciplinas.map((d) => (
                            <TableRow key={d.nome}>
                              <TableCell className="font-medium">{d.nome}</TableCell>
                              <TableCell>{d.cargaHoraria}h</TableCell>
                              <TableCell>
                                <span className={d.nota >= 7 ? "text-emerald-600 font-semibold" : d.nota >= 5 ? "text-amber-600 font-semibold" : "text-rose-600 font-semibold"}>
                                  {d.nota.toFixed(1)}
                                </span>
                              </TableCell>
                              <TableCell><Badge variant="outline">{d.situacao}</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
