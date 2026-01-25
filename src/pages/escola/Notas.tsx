import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  AlertTriangle
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

const turmasData = [
  { id: "1", nome: "1º Ano A" },
  { id: "2", nome: "2º Ano A" },
  { id: "3", nome: "3º Ano B" },
  { id: "4", nome: "4º Ano A" },
  { id: "5", nome: "5º Ano B" },
];

const disciplinasData = [
  { id: "1", nome: "Matemática" },
  { id: "2", nome: "Português" },
  { id: "3", nome: "Ciências" },
  { id: "4", nome: "História" },
  { id: "5", nome: "Geografia" },
];

const bimestresData = [
  { id: "1", nome: "1º Bimestre" },
  { id: "2", nome: "2º Bimestre" },
  { id: "3", nome: "3º Bimestre" },
  { id: "4", nome: "4º Bimestre" },
];

const notasAlunos = [
  { id: "1", nome: "Ana Silva", av1: 8.5, av2: 9.0, trabalho: 8.0, media: 8.5, status: "Aprovado" },
  { id: "2", nome: "Bruno Costa", av1: 6.0, av2: 5.5, trabalho: 7.0, media: 6.2, status: "Aprovado" },
  { id: "3", nome: "Carla Dias", av1: 9.5, av2: 10.0, trabalho: 9.5, media: 9.7, status: "Aprovado" },
  { id: "4", nome: "Daniel Ferreira", av1: 4.0, av2: 5.0, trabalho: 6.0, media: 5.0, status: "Recuperação" },
  { id: "5", nome: "Elena Gomes", av1: 7.5, av2: 8.0, trabalho: 7.5, media: 7.7, status: "Aprovado" },
  { id: "6", nome: "Felipe Henrique", av1: 3.5, av2: 4.0, trabalho: 5.0, media: 4.2, status: "Reprovado" },
  { id: "7", nome: "Gabriela Lima", av1: 8.0, av2: 8.5, trabalho: 9.0, media: 8.5, status: "Aprovado" },
  { id: "8", nome: "Henrique Martins", av1: 6.5, av2: 7.0, trabalho: 6.5, media: 6.7, status: "Aprovado" },
];

const statsCards = [
  { title: "Média Geral", value: "7.2", icon: Award, trend: "up", change: "+0.3" },
  { title: "Alunos Avaliados", value: "342", icon: Users, trend: "up", change: "+28" },
  { title: "Em Recuperação", value: "45", icon: AlertTriangle, trend: "down", change: "-8" },
  { title: "Acima da Média", value: "68%", icon: TrendingUp, trend: "up", change: "+5%" },
];

export default function Notas() {
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [selectedBimestre, setSelectedBimestre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<typeof notasAlunos[0] | null>(null);

  const filteredAlunos = notasAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">Notas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie as notas dos alunos por turma e disciplina
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
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
                <div className={`rounded-full p-3 ${
                  stat.trend === "up" ? "bg-emerald-500/10" : "bg-red-500/10"
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }`} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">vs. bimestre anterior</span>
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
            <div className="grid gap-4 md:grid-cols-4">
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

              <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinasData.map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBimestre} onValueChange={setSelectedBimestre}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bimestre" />
                </SelectTrigger>
                <SelectContent>
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
                  placeholder="Buscar aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notas Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas dos Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">AV1</TableHead>
                  <TableHead className="text-center">AV2</TableHead>
                  <TableHead className="text-center">Trabalho</TableHead>
                  <TableHead className="text-center">Média</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell className="text-center">{aluno.av1.toFixed(1)}</TableCell>
                    <TableCell className="text-center">{aluno.av2.toFixed(1)}</TableCell>
                    <TableCell className="text-center">{aluno.trabalho.toFixed(1)}</TableCell>
                    <TableCell className={`text-center font-bold ${getMediaColor(aluno.media)}`}>
                      {aluno.media.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(aluno.status)}</TableCell>
                    <TableCell className="text-right">
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
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes das Notas - {aluno.nome}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Avaliação 1 (AV1)</span>
                                <span className="font-bold">{aluno.av1.toFixed(1)}</span>
                              </div>
                              <Progress value={aluno.av1 * 10} className="h-2" />

                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Avaliação 2 (AV2)</span>
                                <span className="font-bold">{aluno.av2.toFixed(1)}</span>
                              </div>
                              <Progress value={aluno.av2 * 10} className="h-2" />

                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Trabalho</span>
                                <span className="font-bold">{aluno.trabalho.toFixed(1)}</span>
                              </div>
                              <Progress value={aluno.trabalho * 10} className="h-2" />
                            </div>

                            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-medium">Média Final</span>
                                <span className={`text-2xl font-bold ${getMediaColor(aluno.media)}`}>
                                  {aluno.media.toFixed(1)}
                                </span>
                              </div>
                              <div className="mt-2">
                                {getStatusBadge(aluno.status)}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
