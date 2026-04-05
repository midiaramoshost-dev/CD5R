import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  ChevronRight,
  Check,
  X,
  ArrowUpDown,
  Calendar,
  Building2,
  BarChart3,
  PieChart,
  Wallet,
  Calculator,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────
interface ContaContabil {
  id: string;
  codigo: string;
  nome: string;
  tipo: "ativo" | "passivo" | "receita" | "despesa" | "patrimonio_liquido";
  grupo: string;
  natureza: "devedora" | "credora";
  saldo: number;
  ativo: boolean;
}

interface Lancamento {
  id: string;
  numero: number;
  dataCompetencia: string;
  dataCaixa: string;
  descricao: string;
  documento: string;
  status: "rascunho" | "confirmado" | "estornado";
  totalDebito: number;
  totalCredito: number;
}

interface CentroCusto {
  id: string;
  codigo: string;
  nome: string;
  ativo: boolean;
}

// ── Mock Data ──────────────────────────────────────────
const planoContasMock: ContaContabil[] = [
  { id: "1", codigo: "1", nome: "ATIVO", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 285000, ativo: true },
  { id: "2", codigo: "1.1", nome: "Ativo Circulante", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 185000, ativo: true },
  { id: "3", codigo: "1.1.1", nome: "Caixa e Equivalentes", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 45000, ativo: true },
  { id: "4", codigo: "1.1.2", nome: "Bancos Conta Movimento", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 92000, ativo: true },
  { id: "5", codigo: "1.1.3", nome: "Mensalidades a Receber", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 48000, ativo: true },
  { id: "6", codigo: "1.2", nome: "Ativo Não Circulante", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 100000, ativo: true },
  { id: "7", codigo: "1.2.1", nome: "Imobilizado", tipo: "ativo", grupo: "Ativo", natureza: "devedora", saldo: 100000, ativo: true },
  { id: "8", codigo: "2", nome: "PASSIVO", tipo: "passivo", grupo: "Passivo", natureza: "credora", saldo: 85000, ativo: true },
  { id: "9", codigo: "2.1", nome: "Passivo Circulante", tipo: "passivo", grupo: "Passivo", natureza: "credora", saldo: 65000, ativo: true },
  { id: "10", codigo: "2.1.1", nome: "Fornecedores", tipo: "passivo", grupo: "Passivo", natureza: "credora", saldo: 18000, ativo: true },
  { id: "11", codigo: "2.1.2", nome: "Salários a Pagar", tipo: "passivo", grupo: "Passivo", natureza: "credora", saldo: 32000, ativo: true },
  { id: "12", codigo: "2.1.3", nome: "Impostos a Recolher", tipo: "passivo", grupo: "Passivo", natureza: "credora", saldo: 15000, ativo: true },
  { id: "13", codigo: "3", nome: "PATRIMÔNIO LÍQUIDO", tipo: "patrimonio_liquido", grupo: "Patrimônio", natureza: "credora", saldo: 200000, ativo: true },
  { id: "14", codigo: "4", nome: "RECEITAS", tipo: "receita", grupo: "Receita", natureza: "credora", saldo: 120000, ativo: true },
  { id: "15", codigo: "4.1", nome: "Receita de Mensalidades", tipo: "receita", grupo: "Receita", natureza: "credora", saldo: 98000, ativo: true },
  { id: "16", codigo: "4.2", nome: "Receita de Matrículas", tipo: "receita", grupo: "Receita", natureza: "credora", saldo: 15000, ativo: true },
  { id: "17", codigo: "4.3", nome: "Outras Receitas", tipo: "receita", grupo: "Receita", natureza: "credora", saldo: 7000, ativo: true },
  { id: "18", codigo: "5", nome: "DESPESAS", tipo: "despesa", grupo: "Despesa", natureza: "devedora", saldo: 82000, ativo: true },
  { id: "19", codigo: "5.1", nome: "Despesas com Pessoal", tipo: "despesa", grupo: "Despesa", natureza: "devedora", saldo: 48000, ativo: true },
  { id: "20", codigo: "5.2", nome: "Despesas Administrativas", tipo: "despesa", grupo: "Despesa", natureza: "devedora", saldo: 18000, ativo: true },
  { id: "21", codigo: "5.3", nome: "Despesas com Material", tipo: "despesa", grupo: "Despesa", natureza: "devedora", saldo: 9500, ativo: true },
  { id: "22", codigo: "5.4", nome: "Despesas com Manutenção", tipo: "despesa", grupo: "Despesa", natureza: "devedora", saldo: 6500, ativo: true },
];

const lancamentosMock: Lancamento[] = [
  { id: "1", numero: 1001, dataCompetencia: "2026-04-01", dataCaixa: "2026-04-01", descricao: "Recebimento mensalidades março", documento: "NF-001", status: "confirmado", totalDebito: 48000, totalCredito: 48000 },
  { id: "2", numero: 1002, dataCompetencia: "2026-04-02", dataCaixa: "2026-04-03", descricao: "Pagamento salários professores", documento: "FP-03/2026", status: "confirmado", totalDebito: 32000, totalCredito: 32000 },
  { id: "3", numero: 1003, dataCompetencia: "2026-04-05", dataCaixa: "2026-04-05", descricao: "Compra material didático", documento: "NF-2345", status: "confirmado", totalDebito: 4500, totalCredito: 4500 },
  { id: "4", numero: 1004, dataCompetencia: "2026-04-07", dataCaixa: "", descricao: "Provisão férias funcionários", documento: "", status: "rascunho", totalDebito: 8000, totalCredito: 8000 },
  { id: "5", numero: 1005, dataCompetencia: "2026-04-10", dataCaixa: "2026-04-10", descricao: "Pagamento energia elétrica", documento: "FAT-042026", status: "confirmado", totalDebito: 3200, totalCredito: 3200 },
  { id: "6", numero: 1006, dataCompetencia: "2026-04-12", dataCaixa: "2026-04-12", descricao: "Recebimento matrícula nova", documento: "REC-089", status: "confirmado", totalDebito: 1500, totalCredito: 1500 },
  { id: "7", numero: 1007, dataCompetencia: "2026-03-15", dataCaixa: "2026-03-15", descricao: "Estorno lançamento duplicado", documento: "EST-001", status: "estornado", totalDebito: 2000, totalCredito: 2000 },
];

const centrosCustoMock: CentroCusto[] = [
  { id: "1", codigo: "CC01", nome: "Educação Infantil", ativo: true },
  { id: "2", codigo: "CC02", nome: "Ensino Fundamental I", ativo: true },
  { id: "3", codigo: "CC03", nome: "Ensino Fundamental II", ativo: true },
  { id: "4", codigo: "CC04", nome: "Administrativo", ativo: true },
  { id: "5", codigo: "CC05", nome: "Manutenção", ativo: true },
];

// ── Helpers ────────────────────────────────────────────
const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const tipoLabel: Record<string, string> = {
  ativo: "Ativo",
  passivo: "Passivo",
  receita: "Receita",
  despesa: "Despesa",
  patrimonio_liquido: "Patrimônio Líquido",
};

const statusColor: Record<string, string> = {
  rascunho: "bg-warning/15 text-warning border-warning/30",
  confirmado: "bg-success/15 text-success border-success/30",
  estornado: "bg-destructive/15 text-destructive border-destructive/30",
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

// ── Component ──────────────────────────────────────────
export default function Contabilidade() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lancDialogOpen, setLancDialogOpen] = useState(false);

  // ── Computed ─────────────────────────────────────────
  const totalReceitas = planoContasMock.filter(c => c.tipo === "receita" && c.codigo.includes(".")).reduce((s, c) => s + c.saldo, 0);
  const totalDespesas = planoContasMock.filter(c => c.tipo === "despesa" && c.codigo.includes(".")).reduce((s, c) => s + c.saldo, 0);
  const resultado = totalReceitas - totalDespesas;
  const totalAtivo = planoContasMock.find(c => c.codigo === "1")?.saldo ?? 0;
  const totalPassivo = planoContasMock.find(c => c.codigo === "2")?.saldo ?? 0;
  const totalPL = planoContasMock.find(c => c.codigo === "3")?.saldo ?? 0;

  const filteredContas = useMemo(() =>
    planoContasMock.filter(c =>
      (filterTipo === "todos" || c.tipo === filterTipo) &&
      (c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.codigo.includes(searchTerm))
    ), [searchTerm, filterTipo]);

  const filteredLancamentos = useMemo(() =>
    lancamentosMock.filter(l =>
      (filterStatus === "todos" || l.status === filterStatus) &&
      (l.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || l.documento.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [searchTerm, filterStatus]);

  // ── DRE Data ─────────────────────────────────────────
  const dreData = [
    { label: "Receita Bruta", valor: totalReceitas, indent: 0 },
    { label: "(-) Deduções", valor: 0, indent: 1 },
    { label: "= Receita Líquida", valor: totalReceitas, indent: 0, bold: true },
    { label: "(-) Despesas com Pessoal", valor: -48000, indent: 1 },
    { label: "(-) Despesas Administrativas", valor: -18000, indent: 1 },
    { label: "(-) Despesas com Material", valor: -9500, indent: 1 },
    { label: "(-) Despesas com Manutenção", valor: -6500, indent: 1 },
    { label: "= Resultado Operacional", valor: resultado, indent: 0, bold: true },
    { label: "(-) Despesas Financeiras", valor: 0, indent: 1 },
    { label: "(+) Receitas Financeiras", valor: 0, indent: 1 },
    { label: "= Resultado Antes IR/CSLL", valor: resultado, indent: 0, bold: true },
    { label: "(-) IR/CSLL", valor: 0, indent: 1 },
    { label: "= Resultado Líquido", valor: resultado, indent: 0, bold: true, highlight: true },
  ];

  // ── Cash Flow Data ───────────────────────────────────
  const fluxoCaixaData = [
    { mes: "Jan", entradas: 95000, saidas: 72000 },
    { mes: "Fev", entradas: 98000, saidas: 75000 },
    { mes: "Mar", entradas: 102000, saidas: 78000 },
    { mes: "Abr", entradas: 120000, saidas: 82000 },
  ];

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-foreground/70" />
            Contabilidade
          </h1>
          <p className="text-sm text-muted-foreground">Gestão contábil completa — regime de competência e caixa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Exportar SPED
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setLancDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Lançamento
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Receitas", value: fmt(totalReceitas), icon: TrendingUp, color: "text-success" },
          { title: "Total Despesas", value: fmt(totalDespesas), icon: TrendingDown, color: "text-destructive" },
          { title: "Resultado", value: fmt(resultado), icon: DollarSign, color: resultado >= 0 ? "text-success" : "text-destructive" },
          { title: "Ativo Total", value: fmt(totalAtivo), icon: Building2, color: "text-foreground/70" },
        ].map((kpi, i) => (
          <Card key={i} className="border-border/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.title}</p>
                <p className="text-lg font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="plano-contas" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="plano-contas" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Plano de Contas</TabsTrigger>
            <TabsTrigger value="lancamentos" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Lançamentos</TabsTrigger>
            <TabsTrigger value="fluxo-caixa" className="gap-1.5"><Wallet className="h-3.5 w-3.5" /> Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="dre" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> DRE</TabsTrigger>
            <TabsTrigger value="balanco" className="gap-1.5"><PieChart className="h-3.5 w-3.5" /> Balanço</TabsTrigger>
            <TabsTrigger value="centros-custo" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Centros de Custo</TabsTrigger>
          </TabsList>

          {/* ── Plano de Contas ── */}
          <TabsContent value="plano-contas" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar conta..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="passivo">Passivo</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="patrimonio_liquido">Patrimônio Líquido</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="gap-1.5" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Nova Conta
              </Button>
            </div>

            <Card className="border-border/60">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Natureza</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContas.map(conta => {
                      const depth = conta.codigo.split(".").length - 1;
                      const isGroup = depth === 0;
                      return (
                        <TableRow key={conta.id} className={isGroup ? "bg-muted/40 font-semibold" : ""}>
                          <TableCell className="font-mono text-sm">{conta.codigo}</TableCell>
                          <TableCell style={{ paddingLeft: `${depth * 20 + 16}px` }}>{conta.nome}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{tipoLabel[conta.tipo]}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground capitalize">{conta.natureza}</TableCell>
                          <TableCell className={`text-right font-mono ${conta.tipo === "despesa" ? "text-destructive" : ""}`}>{fmt(conta.saldo)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={conta.ativo ? "border-success/30 text-success" : "border-muted-foreground/30 text-muted-foreground"}>
                              {conta.ativo ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ── Lançamentos ── */}
          <TabsContent value="lancamentos" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar lançamento..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="estornado">Estornado</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="gap-1.5" onClick={() => setLancDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Novo Lançamento
              </Button>
            </div>

            <Card className="border-border/60">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Data Comp.</TableHead>
                      <TableHead>Data Caixa</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead className="text-right">Débito</TableHead>
                      <TableHead className="text-right">Crédito</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLancamentos.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="font-mono">{l.numero}</TableCell>
                        <TableCell>{new Date(l.dataCompetencia).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{l.dataCaixa ? new Date(l.dataCaixa).toLocaleDateString("pt-BR") : "—"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{l.descricao}</TableCell>
                        <TableCell className="font-mono text-xs">{l.documento || "—"}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(l.totalDebito)}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(l.totalCredito)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={statusColor[l.status]}>{l.status}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ── Fluxo de Caixa ── */}
          <TabsContent value="fluxo-caixa" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/60">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">Entradas (Abril)</p>
                  <p className="text-2xl font-bold text-success">{fmt(120000)}</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">Saídas (Abril)</p>
                  <p className="text-2xl font-bold text-destructive">{fmt(82000)}</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">Saldo Líquido</p>
                  <p className="text-2xl font-bold">{fmt(38000)}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Fluxo de Caixa Mensal</CardTitle>
                <CardDescription>Comparativo entradas vs saídas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fluxoCaixaData.map((m, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{m.mes}</span>
                        <span className={m.entradas - m.saidas >= 0 ? "text-success" : "text-destructive"}>
                          Saldo: {fmt(m.entradas - m.saidas)}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-muted-foreground w-14">Entradas</span>
                        <div className="flex-1">
                          <Progress value={(m.entradas / 130000) * 100} className="h-2 bg-success/15 [&>div]:bg-success" />
                        </div>
                        <span className="text-xs font-mono w-24 text-right">{fmt(m.entradas)}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-muted-foreground w-14">Saídas</span>
                        <div className="flex-1">
                          <Progress value={(m.saidas / 130000) * 100} className="h-2 bg-destructive/15 [&>div]:bg-destructive" />
                        </div>
                        <span className="text-xs font-mono w-24 text-right">{fmt(m.saidas)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── DRE ── */}
          <TabsContent value="dre" className="space-y-4">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Demonstração do Resultado do Exercício</CardTitle>
                    <CardDescription>Período: Janeiro a Abril 2026</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="h-4 w-4" /> Exportar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor (R$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dreData.map((row, i) => (
                      <TableRow key={i} className={row.highlight ? "bg-muted/50" : ""}>
                        <TableCell className={`${row.bold ? "font-semibold" : ""}`} style={{ paddingLeft: `${row.indent * 24 + 16}px` }}>
                          {row.label}
                        </TableCell>
                        <TableCell className={`text-right font-mono ${row.bold ? "font-semibold" : ""} ${row.valor < 0 ? "text-destructive" : ""} ${row.highlight ? "text-lg" : ""}`}>
                          {row.valor !== 0 ? fmt(Math.abs(row.valor)) : "—"}
                          {row.valor < 0 && row.valor !== 0 ? " (D)" : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Balanço Patrimonial ── */}
          <TabsContent value="balanco" className="space-y-4">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Balanço Patrimonial</CardTitle>
                    <CardDescription>Posição em 05/04/2026</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="h-4 w-4" /> Exportar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* ATIVO */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm border-b pb-2">ATIVO</h3>
                    {planoContasMock.filter(c => c.tipo === "ativo").map(c => {
                      const depth = c.codigo.split(".").length - 1;
                      return (
                        <div key={c.id} className={`flex justify-between items-center text-sm ${depth === 0 ? "font-semibold" : ""}`} style={{ paddingLeft: `${depth * 16}px` }}>
                          <span>{c.codigo} - {c.nome}</span>
                          <span className="font-mono">{fmt(c.saldo)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center text-sm font-bold border-t pt-2">
                      <span>TOTAL ATIVO</span>
                      <span className="font-mono">{fmt(totalAtivo)}</span>
                    </div>
                  </div>

                  {/* PASSIVO + PL */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm border-b pb-2">PASSIVO + PATRIMÔNIO LÍQUIDO</h3>
                    {planoContasMock.filter(c => c.tipo === "passivo" || c.tipo === "patrimonio_liquido").map(c => {
                      const depth = c.codigo.split(".").length - 1;
                      return (
                        <div key={c.id} className={`flex justify-between items-center text-sm ${depth === 0 ? "font-semibold" : ""}`} style={{ paddingLeft: `${depth * 16}px` }}>
                          <span>{c.codigo} - {c.nome}</span>
                          <span className="font-mono">{fmt(c.saldo)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center text-sm font-bold border-t pt-2">
                      <span>TOTAL PASSIVO + PL</span>
                      <span className="font-mono">{fmt(totalPassivo + totalPL)}</span>
                    </div>
                  </div>
                </div>

                {/* Equilíbrio */}
                <div className="mt-6 rounded-lg bg-muted/40 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Verificação do Balanço</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono font-semibold">Ativo {fmt(totalAtivo)}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="font-mono font-semibold">Passivo+PL {fmt(totalPassivo + totalPL)}</span>
                    {totalAtivo === totalPassivo + totalPL ? (
                      <Badge className="bg-success/15 text-success border-success/30"><Check className="h-3 w-3 mr-1" /> Equilibrado</Badge>
                    ) : (
                      <Badge className="bg-destructive/15 text-destructive border-destructive/30"><X className="h-3 w-3 mr-1" /> Desequilíbrio</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Centros de Custo ── */}
          <TabsContent value="centros-custo" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Categorize lançamentos por centro de custo para análise departamental.</p>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Novo Centro</Button>
            </div>
            <Card className="border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centrosCustoMock.map(cc => (
                    <TableRow key={cc.id}>
                      <TableCell className="font-mono">{cc.codigo}</TableCell>
                      <TableCell>{cc.nome}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cc.ativo ? "border-success/30 text-success" : "border-muted-foreground/30 text-muted-foreground"}>
                          {cc.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Dialog: Nova Conta ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Conta Contábil</DialogTitle>
            <DialogDescription>Adicione uma conta ao plano de contas da instituição.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Código</Label>
                <Input placeholder="1.1.4" />
              </div>
              <div className="col-span-2">
                <Label>Nome</Label>
                <Input placeholder="Aplicações Financeiras" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="passivo">Passivo</SelectItem>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="patrimonio_liquido">Patrimônio Líquido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Natureza</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="devedora">Devedora</SelectItem>
                    <SelectItem value="credora">Credora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Grupo</Label>
              <Input placeholder="Ex: Ativo Circulante" />
            </div>
            <div>
              <Label>Conta Pai (opcional)</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Nenhuma (conta raiz)" /></SelectTrigger>
                <SelectContent>
                  {planoContasMock.filter(c => c.codigo.split(".").length <= 2).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.codigo} - {c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => { toast.success("Conta criada com sucesso!"); setDialogOpen(false); }}>Salvar Conta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Novo Lançamento ── */}
      <Dialog open={lancDialogOpen} onOpenChange={setLancDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Lançamento Contábil</DialogTitle>
            <DialogDescription>Registre um lançamento com partidas dobradas (débito = crédito).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data Competência</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Data Caixa (opcional)</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea placeholder="Descreva o lançamento..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nº Documento</Label>
                <Input placeholder="NF-001" />
              </div>
              <div>
                <Label>Tipo Documento</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nf">Nota Fiscal</SelectItem>
                    <SelectItem value="recibo">Recibo</SelectItem>
                    <SelectItem value="fatura">Fatura</SelectItem>
                    <SelectItem value="folha">Folha de Pagamento</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Partidas */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Partidas Dobradas</Label>
                <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Adicionar Linha</Button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium">
                  <div className="col-span-5">Conta</div>
                  <div className="col-span-2">Tipo</div>
                  <div className="col-span-3">Valor</div>
                  <div className="col-span-2">Centro Custo</div>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Select>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione conta" /></SelectTrigger>
                        <SelectContent>
                          {planoContasMock.filter(c => c.codigo.includes(".")).map(c => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">{c.codigo} - {c.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Select defaultValue={i === 1 ? "debito" : "credito"}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debito">Débito</SelectItem>
                          <SelectItem value="credito">Crédito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input type="number" placeholder="0,00" className="h-9 text-xs" />
                    </div>
                    <div className="col-span-2">
                      <Select>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          {centrosCustoMock.map(cc => (
                            <SelectItem key={cc.id} value={cc.id} className="text-xs">{cc.codigo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Total Débito: <strong className="font-mono">R$ 0,00</strong></span>
                <span>Total Crédito: <strong className="font-mono">R$ 0,00</strong></span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLancDialogOpen(false)}>Cancelar</Button>
            <Button variant="outline" onClick={() => { toast.info("Salvo como rascunho."); setLancDialogOpen(false); }}>Salvar Rascunho</Button>
            <Button onClick={() => { toast.success("Lançamento confirmado!"); setLancDialogOpen(false); }}>Confirmar Lançamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}