import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  UserCheck,
  UserX,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const turmasData = [
  { id: "1", nome: "1º Ano A" },
  { id: "2", nome: "2º Ano A" },
  { id: "3", nome: "3º Ano B" },
  { id: "4", nome: "4º Ano A" },
  { id: "5", nome: "5º Ano B" },
];

const mesesData = [
  { id: "1", nome: "Janeiro" },
  { id: "2", nome: "Fevereiro" },
  { id: "3", nome: "Março" },
  { id: "4", nome: "Abril" },
  { id: "5", nome: "Maio" },
  { id: "6", nome: "Junho" },
  { id: "7", nome: "Julho" },
  { id: "8", nome: "Agosto" },
  { id: "9", nome: "Setembro" },
  { id: "10", nome: "Outubro" },
  { id: "11", nome: "Novembro" },
  { id: "12", nome: "Dezembro" },
];

const frequenciaAlunos = [
  { id: "1", nome: "Ana Silva", presencas: 18, faltas: 2, justificadas: 1, percentual: 90 },
  { id: "2", nome: "Bruno Costa", presencas: 16, faltas: 4, justificadas: 2, percentual: 80 },
  { id: "3", nome: "Carla Dias", presencas: 20, faltas: 0, justificadas: 0, percentual: 100 },
  { id: "4", nome: "Daniel Ferreira", presencas: 12, faltas: 8, justificadas: 3, percentual: 60 },
  { id: "5", nome: "Elena Gomes", presencas: 17, faltas: 3, justificadas: 1, percentual: 85 },
  { id: "6", nome: "Felipe Henrique", presencas: 14, faltas: 6, justificadas: 2, percentual: 70 },
  { id: "7", nome: "Gabriela Lima", presencas: 19, faltas: 1, justificadas: 0, percentual: 95 },
  { id: "8", nome: "Henrique Martins", presencas: 15, faltas: 5, justificadas: 4, percentual: 75 },
];

const frequenciaDiaria = [
  { data: "20/01/2025", presentes: 28, ausentes: 2, percentual: 93 },
  { data: "21/01/2025", presentes: 27, ausentes: 3, percentual: 90 },
  { data: "22/01/2025", presentes: 29, ausentes: 1, percentual: 97 },
  { data: "23/01/2025", presentes: 25, ausentes: 5, percentual: 83 },
  { data: "24/01/2025", presentes: 30, ausentes: 0, percentual: 100 },
];

const statsCards = [
  { title: "Frequência Média", value: "89%", icon: UserCheck, trend: "up", change: "+2%" },
  { title: "Total de Alunos", value: "342", icon: Users, trend: "up", change: "+12" },
  { title: "Faltas no Mês", value: "156", icon: UserX, trend: "down", change: "-23" },
  { title: "Alunos em Alerta", value: "18", icon: AlertTriangle, trend: "down", change: "-5" },
];

export default function Frequencia() {
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlunos = frequenciaAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFrequenciaStatus = (percentual: number) => {
    if (percentual >= 90) return { label: "Excelente", color: "bg-emerald-500/20 text-emerald-600" };
    if (percentual >= 75) return { label: "Regular", color: "bg-amber-500/20 text-amber-600" };
    return { label: "Crítico", color: "bg-red-500/20 text-red-600" };
  };

  const getProgressColor = (percentual: number) => {
    if (percentual >= 90) return "bg-emerald-500";
    if (percentual >= 75) return "bg-amber-500";
    return "bg-red-500";
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
          <h1 className="text-3xl font-bold tracking-tight">Frequência</h1>
          <p className="text-muted-foreground">
            Acompanhe a frequência dos alunos por turma e período
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
                <span className="text-muted-foreground">vs. mês anterior</span>
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

              <Select value={selectedMes} onValueChange={setSelectedMes}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {mesesData.map((mes) => (
                    <SelectItem key={mes.id} value={mes.id}>
                      {mes.nome}
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="alunos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="alunos" className="gap-2">
              <Users className="h-4 w-4" />
              Por Aluno
            </TabsTrigger>
            <TabsTrigger value="diaria" className="gap-2">
              <Calendar className="h-4 w-4" />
              Diária
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alunos">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Frequência por Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="text-center">Presenças</TableHead>
                      <TableHead className="text-center">Faltas</TableHead>
                      <TableHead className="text-center">Justificadas</TableHead>
                      <TableHead className="text-center">Frequência</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlunos.map((aluno) => {
                      const status = getFrequenciaStatus(aluno.percentual);
                      return (
                        <TableRow key={aluno.id}>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center gap-1">
                              <UserCheck className="h-4 w-4 text-emerald-500" />
                              {aluno.presencas}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center gap-1">
                              <UserX className="h-4 w-4 text-red-500" />
                              {aluno.faltas}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">{aluno.justificadas}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={aluno.percentual} 
                                className="h-2 w-20"
                              />
                              <span className="font-medium">{aluno.percentual}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diaria">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Frequência Diária
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-center">Presentes</TableHead>
                      <TableHead className="text-center">Ausentes</TableHead>
                      <TableHead className="text-center">Percentual</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {frequenciaDiaria.map((dia, index) => {
                      const status = getFrequenciaStatus(dia.percentual);
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {dia.data}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center gap-1 text-emerald-600">
                              <UserCheck className="h-4 w-4" />
                              {dia.presentes}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center gap-1 text-red-500">
                              <UserX className="h-4 w-4" />
                              {dia.ausentes}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress 
                                value={dia.percentual} 
                                className="h-2 w-20"
                              />
                              <span className="font-medium">{dia.percentual}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
