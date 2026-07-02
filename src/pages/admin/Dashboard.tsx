import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  Loader2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface EscolaRow {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  plano: string;
  alunos: number;
  status: string;
  created_at: string;
}

const planoStyle: Record<string, string> = {
  premium: "border-primary/30 bg-primary/10 text-primary",
  pro: "border-violet-500/30 bg-violet-500/10 text-violet-500",
  start: "border-sky-500/30 bg-sky-500/10 text-sky-500",
  free: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

const statusStyle: Record<string, string> = {
  ativo: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  trial: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  inativo: "border-rose-500/30 bg-rose-500/10 text-rose-500",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [escolas, setEscolas] = useState<EscolaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("escolas")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setEscolas(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalEscolas = escolas.length;
  const totalAlunos = escolas.reduce((acc, e) => acc + (e.alunos || 0), 0);
  const escolasAtivas = escolas.filter((e) => e.status === "ativo").length;
  const escolasTrial = escolas.filter((e) => e.status === "trial").length;
  const escolasInativas = escolas.filter((e) => e.status === "inativo").length;

  const planos = ["Free", "Start", "Pro", "Premium"];
  const planoDistribuicao = planos.map((plano) => {
    const count = escolas.filter((e) => e.plano.toLowerCase() === plano.toLowerCase()).length;
    return {
      plano,
      escolas: count,
      percentual: totalEscolas > 0 ? Math.round((count / totalEscolas) * 1000) / 10 : 0,
    };
  });

  const escolasRecentes = escolas.slice(0, 5);

  const kpis = [
    {
      title: "Total de Escolas",
      value: totalEscolas.toString(),
      icon: Building2,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Alunos Ativos",
      value: totalAlunos.toLocaleString("pt-BR"),
      icon: GraduationCap,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Escolas Ativas",
      value: escolasAtivas.toString(),
      icon: CheckCircle,
      trend: `${totalEscolas > 0 ? Math.round((escolasAtivas / totalEscolas) * 100) : 0}%`,
      trendUp: true,
    },
    {
      title: "Em Trial",
      value: escolasTrial.toString(),
      icon: Clock,
      trend: "Conversão",
      trendUp: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              Painel ADM Master
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Visão geral da plataforma
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Acompanhe em tempo real o desempenho, crescimento e saúde de todas as escolas i ESCOLAS.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full backdrop-blur bg-background/60" onClick={() => navigate("/admin/monitoramento")}>
              <Activity className="mr-2 h-4 w-4" />
              Monitoramento
            </Button>
            <Button size="sm" className="rounded-full" onClick={() => navigate("/admin/escolas")}>
              <Building2 className="mr-2 h-4 w-4" />
              Nova Escola
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <motion.div key={kpi.title} variants={itemVariants} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="group relative overflow-hidden border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/40">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground truncate">{kpi.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">{kpi.value}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/60 p-2 shrink-0">
                    <kpi.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className={cn(
                  "mt-3 inline-flex items-center gap-1 text-xs font-medium",
                  kpi.trendUp ? "text-emerald-500" : "text-muted-foreground"
                )}>
                  {kpi.trendUp && <ArrowUpRight className="h-3 w-3" />}
                  {kpi.trend}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Resumo */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Resumo operacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {escolasInativas > 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <p className="text-sm">{escolasInativas} escola(s) inativa(s)</p>
                </div>
              )}
              {escolasTrial > 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <p className="text-sm">{escolasTrial} escola(s) em trial</p>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-sm">{escolasAtivas} escola(s) ativa(s)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribuição por Plano */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                Distribuição por plano
              </CardTitle>
              <CardDescription>Escolas por tipo de assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planoDistribuicao.map((item) => (
                  <div key={item.plano} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.plano}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {item.escolas} · <span className="text-foreground font-medium">{item.percentual}%</span>
                      </span>
                    </div>
                    <Progress value={item.percentual} className="h-1.5" />
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3 border-t border-border/60 pt-4">
                {[
                  { label: "Total", value: totalEscolas, color: "text-foreground" },
                  { label: "Ativos", value: escolasAtivas, color: "text-emerald-500" },
                  { label: "Trial", value: escolasTrial, color: "text-amber-500" },
                  { label: "Inativos", value: escolasInativas, color: "text-rose-500" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.value}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Escolas Recentes */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="h-4 w-4 text-primary" />
                  Escolas recentes
                </CardTitle>
                <CardDescription>Últimos cadastros na plataforma</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate("/admin/escolas")}>
                Ver todas
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {escolasRecentes.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">Nenhuma escola cadastrada ainda.</p>
            ) : (
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">Escola</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Cidade</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Plano</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-center">Alunos</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escolasRecentes.map((escola) => (
                    <TableRow key={escola.id} className="border-border/40 hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium">{escola.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{escola.cidade} - {escola.uf}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-full font-medium capitalize", planoStyle[escola.plano.toLowerCase()] || planoStyle.free)}>
                          {escola.plano}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">{escola.alunos.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-full font-medium capitalize", statusStyle[escola.status] || statusStyle.inativo)}>
                          {escola.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => navigate("/admin/escolas")}>
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
