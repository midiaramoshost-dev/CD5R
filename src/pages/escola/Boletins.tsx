import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer,
  Eye,
  Send,
  Users,
  BookOpen,
  Award,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const turmasData = [
  { id: "1", nome: "1º Ano A" },
  { id: "2", nome: "2º Ano A" },
  { id: "3", nome: "3º Ano B" },
  { id: "4", nome: "4º Ano A" },
  { id: "5", nome: "5º Ano B" },
];

const bimestresData = [
  { id: "1", nome: "1º Bimestre" },
  { id: "2", nome: "2º Bimestre" },
  { id: "3", nome: "3º Bimestre" },
  { id: "4", nome: "4º Bimestre" },
];

const alunosBoletim = [
  { 
    id: "1", 
    nome: "Ana Silva", 
    matricula: "2025001",
    turma: "3º Ano A",
    mediaGeral: 8.5,
    frequencia: 95,
    status: "Aprovado",
    disciplinas: [
      { nome: "Matemática", b1: 8.0, b2: 8.5, b3: 9.0, b4: 8.5, media: 8.5 },
      { nome: "Português", b1: 9.0, b2: 8.0, b3: 8.5, b4: 9.0, media: 8.6 },
      { nome: "Ciências", b1: 7.5, b2: 8.0, b3: 8.5, b4: 8.0, media: 8.0 },
      { nome: "História", b1: 9.0, b2: 9.5, b3: 9.0, b4: 9.0, media: 9.1 },
      { nome: "Geografia", b1: 8.5, b2: 8.0, b3: 8.5, b4: 8.5, media: 8.4 },
    ]
  },
  { 
    id: "2", 
    nome: "Bruno Costa", 
    matricula: "2025002",
    turma: "3º Ano A",
    mediaGeral: 6.8,
    frequencia: 82,
    status: "Aprovado",
    disciplinas: [
      { nome: "Matemática", b1: 6.0, b2: 6.5, b3: 7.0, b4: 7.5, media: 6.8 },
      { nome: "Português", b1: 7.0, b2: 6.5, b3: 7.0, b4: 7.0, media: 6.9 },
      { nome: "Ciências", b1: 6.5, b2: 7.0, b3: 6.5, b4: 7.0, media: 6.8 },
      { nome: "História", b1: 7.0, b2: 6.5, b3: 7.0, b4: 6.5, media: 6.8 },
      { nome: "Geografia", b1: 6.5, b2: 7.0, b3: 6.5, b4: 7.0, media: 6.8 },
    ]
  },
  { 
    id: "3", 
    nome: "Carla Dias", 
    matricula: "2025003",
    turma: "3º Ano A",
    mediaGeral: 9.5,
    frequencia: 100,
    status: "Aprovado",
    disciplinas: [
      { nome: "Matemática", b1: 10.0, b2: 9.5, b3: 9.5, b4: 10.0, media: 9.8 },
      { nome: "Português", b1: 9.5, b2: 9.5, b3: 10.0, b4: 9.5, media: 9.6 },
      { nome: "Ciências", b1: 9.0, b2: 9.5, b3: 9.5, b4: 9.5, media: 9.4 },
      { nome: "História", b1: 9.5, b2: 10.0, b3: 9.5, b4: 9.5, media: 9.6 },
      { nome: "Geografia", b1: 9.0, b2: 9.5, b3: 9.0, b4: 9.5, media: 9.3 },
    ]
  },
  { 
    id: "4", 
    nome: "Daniel Ferreira", 
    matricula: "2025004",
    turma: "3º Ano A",
    mediaGeral: 5.2,
    frequencia: 68,
    status: "Recuperação",
    disciplinas: [
      { nome: "Matemática", b1: 4.0, b2: 5.0, b3: 5.5, b4: 6.0, media: 5.1 },
      { nome: "Português", b1: 5.0, b2: 5.5, b3: 5.0, b4: 5.5, media: 5.3 },
      { nome: "Ciências", b1: 5.5, b2: 5.0, b3: 5.5, b4: 5.0, media: 5.3 },
      { nome: "História", b1: 5.0, b2: 5.5, b3: 5.0, b4: 5.5, media: 5.3 },
      { nome: "Geografia", b1: 5.0, b2: 5.0, b3: 5.5, b4: 5.0, media: 5.1 },
    ]
  },
  { 
    id: "5", 
    nome: "Elena Gomes", 
    matricula: "2025005",
    turma: "3º Ano A",
    mediaGeral: 7.8,
    frequencia: 88,
    status: "Aprovado",
    disciplinas: [
      { nome: "Matemática", b1: 7.5, b2: 8.0, b3: 7.5, b4: 8.0, media: 7.8 },
      { nome: "Português", b1: 8.0, b2: 7.5, b3: 8.0, b4: 8.0, media: 7.9 },
      { nome: "Ciências", b1: 7.5, b2: 8.0, b3: 7.5, b4: 8.0, media: 7.8 },
      { nome: "História", b1: 8.0, b2: 7.5, b3: 8.0, b4: 7.5, media: 7.8 },
      { nome: "Geografia", b1: 7.5, b2: 8.0, b3: 7.5, b4: 8.0, media: 7.8 },
    ]
  },
];

const statsCards = [
  { title: "Boletins Gerados", value: "342", icon: FileText, color: "bg-primary/10 text-primary" },
  { title: "Média da Turma", value: "7.6", icon: Award, color: "bg-emerald-500/10 text-emerald-500" },
  { title: "Aprovados", value: "89%", icon: TrendingUp, color: "bg-blue-500/10 text-blue-500" },
  { title: "Enviados", value: "298", icon: Send, color: "bg-violet-500/10 text-violet-500" },
];

export default function Boletins() {
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedBimestre, setSelectedBimestre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<typeof alunosBoletim[0] | null>(null);

  const filteredAlunos = alunosBoletim.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.matricula.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">Aprovado</Badge>;
      case "Recuperação":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Recuperação</Badge>;
      case "Reprovado":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Reprovado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMediaColor = (media: number) => {
    if (media >= 7) return "text-emerald-600";
    if (media >= 5) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boletins</h1>
          <p className="text-muted-foreground">
            Gere, visualize e envie boletins escolares dos alunos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir Todos
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Enviar para Responsáveis
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmasData.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBimestre} onValueChange={setSelectedBimestre}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anual">Anual (Consolidado)</SelectItem>
                  {bimestresData.map((bimestre) => (
                    <SelectItem key={bimestre.id} value={bimestre.id}>
                      {bimestre.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Boletins Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lista de Boletins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead className="text-center">Média Geral</TableHead>
                  <TableHead className="text-center">Frequência</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{aluno.matricula}</TableCell>
                    <TableCell>{aluno.turma}</TableCell>
                    <TableCell className={`text-center font-bold ${getMediaColor(aluno.mediaGeral)}`}>
                      {aluno.mediaGeral.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={aluno.frequencia} className="h-2 w-16" />
                        <span className="text-sm">{aluno.frequencia}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(aluno.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedAluno(aluno)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Boletim Escolar</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              {/* Student Info */}
                              <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Aluno</p>
                                    <p className="font-semibold">{aluno.nome}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Matrícula</p>
                                    <p className="font-semibold">{aluno.matricula}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Turma</p>
                                    <p className="font-semibold">{aluno.turma}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Ano Letivo</p>
                                    <p className="font-semibold">2025</p>
                                  </div>
                                </div>
                              </div>

                              {/* Grades Table */}
                              <div>
                                <h4 className="mb-3 font-semibold">Notas por Disciplina</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Disciplina</TableHead>
                                      <TableHead className="text-center">1º Bim</TableHead>
                                      <TableHead className="text-center">2º Bim</TableHead>
                                      <TableHead className="text-center">3º Bim</TableHead>
                                      <TableHead className="text-center">4º Bim</TableHead>
                                      <TableHead className="text-center">Média</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {aluno.disciplinas.map((disc, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="font-medium">{disc.nome}</TableCell>
                                        <TableCell className="text-center">{disc.b1.toFixed(1)}</TableCell>
                                        <TableCell className="text-center">{disc.b2.toFixed(1)}</TableCell>
                                        <TableCell className="text-center">{disc.b3.toFixed(1)}</TableCell>
                                        <TableCell className="text-center">{disc.b4.toFixed(1)}</TableCell>
                                        <TableCell className={`text-center font-bold ${getMediaColor(disc.media)}`}>
                                          {disc.media.toFixed(1)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              <Separator />

                              {/* Summary */}
                              <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                                  <p className="text-sm text-muted-foreground">Média Geral</p>
                                  <p className={`text-2xl font-bold ${getMediaColor(aluno.mediaGeral)}`}>
                                    {aluno.mediaGeral.toFixed(1)}
                                  </p>
                                </div>
                                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                                  <p className="text-sm text-muted-foreground">Frequência</p>
                                  <p className="text-2xl font-bold">{aluno.frequencia}%</p>
                                </div>
                                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                                  <p className="text-sm text-muted-foreground">Situação</p>
                                  <div className="mt-1">{getStatusBadge(aluno.status)}</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" className="gap-2">
                                  <Download className="h-4 w-4" />
                                  Baixar PDF
                                </Button>
                                <Button variant="outline" className="gap-2">
                                  <Printer className="h-4 w-4" />
                                  Imprimir
                                </Button>
                                <Button className="gap-2">
                                  <Send className="h-4 w-4" />
                                  Enviar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
