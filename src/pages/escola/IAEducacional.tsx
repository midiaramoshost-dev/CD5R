import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  FileText,
  Sparkles,
  Loader2,
  GraduationCap,
  BarChart3,
  Users,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { streamAIEducational, type AIRequest } from "@/lib/ai-educational";
import ReactMarkdown from "react-markdown";

// Mock data for demonstration
const mockStudents = [
  { name: "Ana Silva", grade: "7º Ano", average: 4.2, attendance: 68, subjects: { Matematica: 3.5, Portugues: 5.0, Ciencias: 4.1, Historia: 4.2 } },
  { name: "Carlos Santos", grade: "7º Ano", average: 3.8, attendance: 72, subjects: { Matematica: 2.9, Portugues: 4.5, Ciencias: 3.8, Historia: 4.0 } },
  { name: "Maria Oliveira", grade: "8º Ano", average: 8.5, attendance: 95, subjects: { Matematica: 9.0, Portugues: 8.0, Ciencias: 8.5, Historia: 8.5 } },
  { name: "João Pedro", grade: "8º Ano", average: 5.1, attendance: 78, subjects: { Matematica: 4.0, Portugues: 6.0, Ciencias: 5.5, Historia: 4.9 } },
  { name: "Beatriz Costa", grade: "9º Ano", average: 7.2, attendance: 88, subjects: { Matematica: 7.0, Portugues: 7.5, Ciencias: 7.0, Historia: 7.3 } },
  { name: "Lucas Lima", grade: "9º Ano", average: 3.2, attendance: 55, subjects: { Matematica: 2.5, Portugues: 3.8, Ciencias: 3.0, Historia: 3.5 } },
];

const mockSubjects = [
  { name: "Matemática", average: 5.8, passRate: 62, students: 120 },
  { name: "Português", average: 6.5, passRate: 75, students: 120 },
  { name: "Ciências", average: 6.2, passRate: 70, students: 118 },
  { name: "História", average: 6.0, passRate: 68, students: 115 },
  { name: "Geografia", average: 6.8, passRate: 78, students: 115 },
];

const riskStudents = mockStudents.filter((s) => s.average < 6 || s.attendance < 75);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function IAEducacional() {
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  // Exam generator state
  const [examSubject, setExamSubject] = useState("Matemática");
  const [examGrade, setExamGrade] = useState("7º Ano");
  const [examTopic, setExamTopic] = useState("");
  const [examQuestions, setExamQuestions] = useState("10");
  const [includeMultipleChoice, setIncludeMultipleChoice] = useState(true);
  const [includeEssay, setIncludeEssay] = useState(true);

  // Exercises state
  const [exSubject, setExSubject] = useState("Matemática");
  const [exGrade, setExGrade] = useState("7º Ano");
  const [exTopic, setExTopic] = useState("");
  const [exDifficulty, setExDifficulty] = useState("médio");
  const [exQuantity, setExQuantity] = useState("5");

  const runAI = useCallback(async (request: AIRequest, label: string) => {
    setIsLoading(true);
    setAiResponse("");
    setActiveAnalysis(label);

    let accumulated = "";
    await streamAIEducational({
      request,
      onDelta: (text) => {
        accumulated += text;
        setAiResponse(accumulated);
      },
      onDone: () => {
        setIsLoading(false);
        toast.success("Análise concluída!");
      },
      onError: (error) => {
        setIsLoading(false);
        toast.error(error);
      },
    });
  }, []);

  const handleRiskAnalysis = () => {
    runAI(
      { type: "risk_analysis", data: { students: mockStudents } },
      "Análise de Risco de Reprovação"
    );
  };

  const handlePerformanceAnalysis = () => {
    runAI(
      { type: "performance_analysis", data: { subjects: mockSubjects } },
      "Análise de Desempenho por Disciplina"
    );
  };

  const handleRecommendations = (student: typeof mockStudents[0]) => {
    runAI(
      {
        type: "recommendations",
        data: {
          studentName: student.name,
          grades: student.subjects,
          attendance: student.attendance,
        },
      },
      `Recomendações para ${student.name}`
    );
  };

  const handleGenerateReport = () => {
    runAI(
      {
        type: "generate_report",
        data: {
          className: "7º Ano A",
          period: "1º Bimestre 2026",
          classData: {
            students: mockStudents.filter((s) => s.grade === "7º Ano"),
            subjects: mockSubjects.slice(0, 4),
          },
        },
      },
      "Relatório Pedagógico da Turma"
    );
  };

  const handleGenerateExam = () => {
    runAI(
      {
        type: "generate_exam",
        data: {
          subject: examSubject,
          grade: examGrade,
          topic: examTopic || undefined,
          questionCount: parseInt(examQuestions),
          includeMultipleChoice,
          includeEssay,
        },
      },
      `Prova de ${examSubject} - ${examGrade}`
    );
  };

  const handleGenerateExercises = () => {
    runAI(
      {
        type: "generate_exercises",
        data: {
          subject: exSubject,
          grade: exGrade,
          topic: exTopic || undefined,
          difficulty: exDifficulty,
          quantity: parseInt(exQuantity),
        },
      },
      `Exercícios de ${exSubject}`
    );
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            IA Educacional
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights pedagógicos e ferramentas inteligentes com inteligência artificial
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" /> Powered by AI
        </Badge>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alunos em Risco</p>
              <p className="text-2xl font-bold">{riskStudents.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
              <p className="text-2xl font-bold">{mockStudents.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média Geral</p>
              <p className="text-2xl font-bold">
                {(mockStudents.reduce((a, s) => a + s.average, 0) / mockStudents.length).toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
              <p className="text-2xl font-bold">
                {Math.round((mockStudents.filter((s) => s.average >= 6).length / mockStudents.length) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="insights" className="gap-1">
              <Brain className="h-4 w-4" /> Insights
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-1">
              <Users className="h-4 w-4" /> Alunos
            </TabsTrigger>
            <TabsTrigger value="generator" className="gap-1">
              <ClipboardList className="h-4 w-4" /> Provas
            </TabsTrigger>
            <TabsTrigger value="exercises" className="gap-1">
              <BookOpen className="h-4 w-4" /> Exercícios
            </TabsTrigger>
          </TabsList>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleRiskAnalysis}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Análise de Risco
                  </CardTitle>
                  <CardDescription>
                    Identifica alunos com risco de reprovação com base em notas e frequência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    {isLoading && activeAnalysis?.includes("Risco") ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    Analisar Riscos
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handlePerformanceAnalysis}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Desempenho por Disciplina
                  </CardTitle>
                  <CardDescription>
                    Analisa o desempenho dos alunos em cada disciplina com insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    {isLoading && activeAnalysis?.includes("Desempenho") ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    Analisar Desempenho
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleGenerateReport}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-amber-500" />
                    Relatório Pedagógico
                  </CardTitle>
                  <CardDescription>
                    Gera um relatório completo da turma com análise de IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    {isLoading && activeAnalysis?.includes("Relatório") ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              {/* Disciplines overview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5 text-green-500" />
                    Visão por Disciplina
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockSubjects.map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="text-muted-foreground">{s.passRate}% aprovação</span>
                      </div>
                      <Progress value={s.passRate} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockStudents.map((student) => (
                <Card
                  key={student.name}
                  className={student.average < 6 ? "border-destructive/50" : ""}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      {student.average < 6 && (
                        <Badge variant="destructive" className="text-xs">Em Risco</Badge>
                      )}
                    </div>
                    <CardDescription>{student.grade}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Média: <strong className={student.average < 6 ? "text-destructive" : "text-green-600"}>{student.average}</strong></span>
                      <span>Frequência: <strong className={student.attendance < 75 ? "text-destructive" : ""}>{student.attendance}%</strong></span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(student.subjects).map(([subj, grade]) => (
                        <div key={subj} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{subj}</span>
                          <span className={Number(grade) < 6 ? "text-destructive font-medium" : ""}>{grade}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRecommendations(student)}
                      disabled={isLoading}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Recomendações IA
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Exam Generator Tab */}
          <TabsContent value="generator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Gerador de Provas com IA
                </CardTitle>
                <CardDescription>
                  Crie provas completas automaticamente com gabarito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Disciplina</Label>
                    <Select value={examSubject} onValueChange={setExamSubject}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Matemática", "Português", "Ciências", "História", "Geografia", "Inglês", "Educação Física", "Artes"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Série/Ano</Label>
                    <Select value={examGrade} onValueChange={setExamGrade}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º EM", "2º EM", "3º EM"].map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tema (opcional)</Label>
                    <Input value={examTopic} onChange={(e) => setExamTopic(e.target.value)} placeholder="Ex: Equações do 2º grau" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nº de Questões</Label>
                    <Select value={examQuestions} onValueChange={setExamQuestions}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["5", "10", "15", "20"].map((n) => (
                          <SelectItem key={n} value={n}>{n} questões</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={includeMultipleChoice} onCheckedChange={setIncludeMultipleChoice} />
                    <Label>Múltipla Escolha</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={includeEssay} onCheckedChange={setIncludeEssay} />
                    <Label>Dissertativas</Label>
                  </div>
                </div>
                <Button onClick={handleGenerateExam} disabled={isLoading} className="w-full md:w-auto">
                  {isLoading && activeAnalysis?.includes("Prova") ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar Prova
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Gerador de Exercícios com IA
                </CardTitle>
                <CardDescription>
                  Crie listas de exercícios personalizados com gabarito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Disciplina</Label>
                    <Select value={exSubject} onValueChange={setExSubject}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Matemática", "Português", "Ciências", "História", "Geografia", "Inglês"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Série/Ano</Label>
                    <Select value={exGrade} onValueChange={setExGrade}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º EM", "2º EM", "3º EM"].map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tema (opcional)</Label>
                    <Input value={exTopic} onChange={(e) => setExTopic(e.target.value)} placeholder="Ex: Frações" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dificuldade</Label>
                    <Select value={exDifficulty} onValueChange={setExDifficulty}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fácil">Fácil</SelectItem>
                        <SelectItem value="médio">Médio</SelectItem>
                        <SelectItem value="difícil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Select value={exQuantity} onValueChange={setExQuantity}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["3", "5", "10", "15", "20"].map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGenerateExercises} disabled={isLoading} className="w-full md:w-auto">
                  {isLoading && activeAnalysis?.includes("Exercícios") ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar Exercícios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* AI Response Panel */}
      {(aiResponse || isLoading) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {activeAnalysis || "Resultado da IA"}
                </CardTitle>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <ScrollArea className="max-h-[500px]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{aiResponse || "Gerando análise..."}</ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
