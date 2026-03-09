import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bus, MapPin, User, Clock, Shield, Phone, AlertTriangle, CheckCircle2,
  Plus, Search, Eye, Pencil, Trash2, Navigation, Users, Fuel, Calendar,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────
interface Rota {
  id: string;
  nome: string;
  origem: string;
  destino: string;
  distancia: string;
  tempoEstimado: string;
  motorista: string;
  veiculo: string;
  alunos: number;
  turno: "manhã" | "tarde" | "integral";
  status: "ativa" | "inativa" | "em_andamento";
  paradas: string[];
}

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
  capacidade: number;
  ocupacao: number;
  km: number;
  status: "disponivel" | "em_rota" | "manutencao";
  vencimentoSeguro: string;
  ultimaRevisao: string;
}

interface Motorista {
  id: string;
  nome: string;
  cnh: string;
  categoriaCNH: string;
  vencimentoCNH: string;
  telefone: string;
  veiculo: string;
  rota: string;
  status: "ativo" | "inativo" | "em_rota";
  avaliacaoMedia: number;
}

interface Rastreamento {
  id: string;
  rota: string;
  motorista: string;
  veiculo: string;
  horaSaida: string;
  horaPrevisao: string;
  progresso: number;
  alunosEmbarcados: number;
  totalAlunos: number;
  status: "em_andamento" | "concluida" | "atrasada" | "aguardando";
  ultimaAtualizacao: string;
}

// ── Mock Data ──────────────────────────────────────────────────
const initialRotas: Rota[] = [
  { id: "1", nome: "Rota Centro-Norte", origem: "Terminal Central", destino: "Escola iESCOLAS", distancia: "12.5 km", tempoEstimado: "35 min", motorista: "Carlos Silva", veiculo: "Van Sprinter - ABC-1234", alunos: 18, turno: "manhã", status: "em_andamento", paradas: ["Ponto 1 - Av. Brasil", "Ponto 2 - R. das Flores", "Ponto 3 - Pça. Central", "Ponto 4 - R. Augusta"] },
  { id: "2", nome: "Rota Sul", origem: "Bairro Jardim", destino: "Escola iESCOLAS", distancia: "8.3 km", tempoEstimado: "25 min", motorista: "Roberto Santos", veiculo: "Ônibus Escolar - DEF-5678", alunos: 32, turno: "manhã", status: "ativa", paradas: ["Ponto 1 - R. São Paulo", "Ponto 2 - Av. Independência", "Ponto 3 - R. 7 de Setembro"] },
  { id: "3", nome: "Rota Leste", origem: "Condomínio Park", destino: "Escola iESCOLAS", distancia: "15.0 km", tempoEstimado: "45 min", motorista: "Ana Oliveira", veiculo: "Van Master - GHI-9012", alunos: 14, turno: "manhã", status: "ativa", paradas: ["Ponto 1 - Cond. Park", "Ponto 2 - Av. Leste", "Ponto 3 - R. Rio Branco", "Ponto 4 - R. Tiradentes", "Ponto 5 - Terminal Leste"] },
  { id: "4", nome: "Rota Oeste", origem: "Vila Nova", destino: "Escola iESCOLAS", distancia: "10.0 km", tempoEstimado: "30 min", motorista: "Pedro Lima", veiculo: "Van Ducato - JKL-3456", alunos: 12, turno: "tarde", status: "ativa", paradas: ["Ponto 1 - Vila Nova", "Ponto 2 - R. Paraná"] },
  { id: "5", nome: "Rota Noturna", origem: "Centro", destino: "Escola iESCOLAS", distancia: "5.0 km", tempoEstimado: "15 min", motorista: "—", veiculo: "—", alunos: 0, turno: "integral", status: "inativa", paradas: [] },
];

const initialVeiculos: Veiculo[] = [
  { id: "1", placa: "ABC-1234", modelo: "Mercedes Sprinter 515", ano: 2022, capacidade: 20, ocupacao: 18, km: 45200, status: "em_rota", vencimentoSeguro: "2025-08-15", ultimaRevisao: "2025-01-10" },
  { id: "2", placa: "DEF-5678", modelo: "Iveco Daily 70C17", ano: 2021, capacidade: 35, ocupacao: 32, km: 68400, status: "disponivel", vencimentoSeguro: "2025-06-20", ultimaRevisao: "2025-02-05" },
  { id: "3", placa: "GHI-9012", modelo: "Renault Master", ano: 2023, capacidade: 16, ocupacao: 14, km: 22100, status: "em_rota", vencimentoSeguro: "2025-12-01", ultimaRevisao: "2025-03-01" },
  { id: "4", placa: "JKL-3456", modelo: "Fiat Ducato Minibus", ano: 2020, capacidade: 15, ocupacao: 12, km: 89300, status: "disponivel", vencimentoSeguro: "2025-04-10", ultimaRevisao: "2024-12-20" },
  { id: "5", placa: "MNO-7890", modelo: "VW Volksbus 9.160", ano: 2019, capacidade: 40, ocupacao: 0, km: 112000, status: "manutencao", vencimentoSeguro: "2025-09-30", ultimaRevisao: "2025-02-28" },
];

const initialMotoristas: Motorista[] = [
  { id: "1", nome: "Carlos Silva", cnh: "12345678900", categoriaCNH: "D", vencimentoCNH: "2027-05-20", telefone: "(11) 98765-1234", veiculo: "Sprinter ABC-1234", rota: "Centro-Norte", status: "em_rota", avaliacaoMedia: 4.8 },
  { id: "2", nome: "Roberto Santos", cnh: "98765432100", categoriaCNH: "D", vencimentoCNH: "2026-11-15", telefone: "(11) 98765-5678", veiculo: "Iveco DEF-5678", rota: "Sul", status: "ativo", avaliacaoMedia: 4.5 },
  { id: "3", nome: "Ana Oliveira", cnh: "45678912300", categoriaCNH: "D", vencimentoCNH: "2026-08-10", telefone: "(11) 98765-9012", veiculo: "Master GHI-9012", rota: "Leste", status: "em_rota", avaliacaoMedia: 4.9 },
  { id: "4", nome: "Pedro Lima", cnh: "78912345600", categoriaCNH: "D", vencimentoCNH: "2025-03-25", telefone: "(11) 98765-3456", veiculo: "Ducato JKL-3456", rota: "Oeste", status: "ativo", avaliacaoMedia: 4.2 },
  { id: "5", nome: "Mariana Costa", cnh: "32165498700", categoriaCNH: "D", vencimentoCNH: "2027-01-30", telefone: "(11) 98765-7890", veiculo: "—", rota: "—", status: "inativo", avaliacaoMedia: 4.6 },
];

const rastreamentos: Rastreamento[] = [
  { id: "1", rota: "Rota Centro-Norte", motorista: "Carlos Silva", veiculo: "Sprinter ABC-1234", horaSaida: "06:30", horaPrevisao: "07:05", progresso: 72, alunosEmbarcados: 14, totalAlunos: 18, status: "em_andamento", ultimaAtualizacao: "06:52" },
  { id: "2", rota: "Rota Leste", motorista: "Ana Oliveira", veiculo: "Master GHI-9012", horaSaida: "06:15", horaPrevisao: "07:00", progresso: 85, alunosEmbarcados: 13, totalAlunos: 14, status: "em_andamento", ultimaAtualizacao: "06:55" },
  { id: "3", rota: "Rota Sul", motorista: "Roberto Santos", veiculo: "Iveco DEF-5678", horaSaida: "06:45", horaPrevisao: "07:10", progresso: 40, alunosEmbarcados: 18, totalAlunos: 32, status: "atrasada", ultimaAtualizacao: "06:50" },
  { id: "4", rota: "Rota Oeste", motorista: "Pedro Lima", veiculo: "Ducato JKL-3456", horaSaida: "—", horaPrevisao: "12:30", progresso: 0, alunosEmbarcados: 0, totalAlunos: 12, status: "aguardando", ultimaAtualizacao: "—" },
];

const statsCards = [
  { title: "Rotas Ativas", value: "4", icon: MapPin, sub: "1 em andamento", color: "text-primary" },
  { title: "Veículos", value: "5", icon: Bus, sub: "1 em manutenção", color: "text-green-500" },
  { title: "Motoristas", value: "5", icon: User, sub: "2 em rota", color: "text-blue-500" },
  { title: "Alunos Transportados", value: "76", icon: Users, sub: "4 rotas cobertas", color: "text-amber-500" },
];

// ── Component ──────────────────────────────────────────────────
export default function TransporteEscolar() {
  const [rotas] = useState<Rota[]>(initialRotas);
  const [veiculos] = useState<Veiculo[]>(initialVeiculos);
  const [motoristas] = useState<Motorista[]>(initialMotoristas);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRota, setSelectedRota] = useState<Rota | null>(null);
  const [selectedMotorista, setSelectedMotorista] = useState<Motorista | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"rota" | "motorista">("rota");

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      ativa: { label: "Ativa", variant: "default" },
      em_andamento: { label: "Em Andamento", variant: "secondary" },
      inativa: { label: "Inativa", variant: "outline" },
      disponivel: { label: "Disponível", variant: "default" },
      em_rota: { label: "Em Rota", variant: "secondary" },
      manutencao: { label: "Manutenção", variant: "destructive" },
      ativo: { label: "Ativo", variant: "default" },
      concluida: { label: "Concluída", variant: "default" },
      atrasada: { label: "Atrasada", variant: "destructive" },
      aguardando: { label: "Aguardando", variant: "outline" },
    };
    const m = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={m.variant}>{m.label}</Badge>;
  };

  const openRotaDetail = (rota: Rota) => {
    setSelectedRota(rota);
    setDialogType("rota");
    setDialogOpen(true);
  };

  const openMotoristaDetail = (motorista: Motorista) => {
    setSelectedMotorista(motorista);
    setDialogType("motorista");
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bus className="h-7 w-7 text-primary" />
            Transporte Escolar
          </h1>
          <p className="text-muted-foreground mt-1">Gestão de rotas, veículos, motoristas e rastreamento em tempo real</p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade de criação em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" /> Nova Rota
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rastreamento" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="rastreamento">Rastreamento</TabsTrigger>
          <TabsTrigger value="rotas">Rotas</TabsTrigger>
          <TabsTrigger value="veiculos">Veículos</TabsTrigger>
          <TabsTrigger value="motoristas">Motoristas</TabsTrigger>
        </TabsList>

        {/* ── Rastreamento ── */}
        <TabsContent value="rastreamento" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rastreamentos.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className={`hover:shadow-md transition-shadow ${r.status === "atrasada" ? "border-destructive/50" : ""}`}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-primary" />
                          {r.rota}
                        </h3>
                        <p className="text-sm text-muted-foreground">{r.motorista} • {r.veiculo}</p>
                      </div>
                      {getStatusBadge(r.status)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso da rota</span>
                        <span className="font-medium text-foreground">{r.progresso}%</span>
                      </div>
                      <Progress value={r.progresso} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Saída</p>
                        <p className="text-sm font-medium text-foreground">{r.horaSaida}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Previsão</p>
                        <p className="text-sm font-medium text-foreground">{r.horaPrevisao}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Embarcados</p>
                        <p className="text-sm font-medium text-foreground">{r.alunosEmbarcados}/{r.totalAlunos}</p>
                      </div>
                    </div>

                    {r.status === "atrasada" && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        Rota com atraso detectado
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Última atualização: {r.ultimaAtualizacao}</span>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-3 w-3 mr-1" /> Contatar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* ── Rotas ── */}
        <TabsContent value="rotas" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar rota..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rota</TableHead>
                    <TableHead>Trajeto</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotas.filter((r) => r.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((rota) => (
                    <TableRow key={rota.id} className="cursor-pointer" onClick={() => openRotaDetail(rota)}>
                      <TableCell className="font-medium text-foreground">{rota.nome}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{rota.origem} → {rota.destino}<br /><span className="text-xs">{rota.distancia} • {rota.tempoEstimado}</span></TableCell>
                      <TableCell className="text-muted-foreground">{rota.motorista}</TableCell>
                      <TableCell className="text-foreground">{rota.alunos}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{rota.turno}</Badge></TableCell>
                      <TableCell>{getStatusBadge(rota.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openRotaDetail(rota)}><Eye className="h-4 w-4 mr-2" /> Detalhes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Edição em desenvolvimento")}><Pencil className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => toast.info("Exclusão em desenvolvimento")}><Trash2 className="h-4 w-4 mr-2" /> Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Veículos ── */}
        <TabsContent value="veiculos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {veiculos.map((v) => {
              const ocupacaoPct = Math.round((v.ocupacao / v.capacidade) * 100);
              const seguroVencido = new Date(v.vencimentoSeguro) < new Date();
              return (
                <motion.div key={v.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className={`hover:shadow-md transition-shadow ${seguroVencido ? "border-destructive/50" : ""}`}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Bus className="h-4 w-4 text-primary" />
                            {v.modelo}
                          </h3>
                          <p className="text-sm text-muted-foreground">{v.placa} • {v.ano}</p>
                        </div>
                        {getStatusBadge(v.status)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Ocupação</span>
                          <span>{v.ocupacao}/{v.capacidade} lugares</span>
                        </div>
                        <Progress value={ocupacaoPct} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Fuel className="h-3 w-3" /> {v.km.toLocaleString("pt-BR")} km
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Shield className="h-3 w-3" /> Seguro: {new Date(v.vencimentoSeguro).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" /> Revisão: {new Date(v.ultimaRevisao).toLocaleDateString("pt-BR")}
                        </div>
                      </div>

                      {seguroVencido && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-xs">
                          <AlertTriangle className="h-3 w-3" /> Seguro vencido — renovar imediatamente
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Motoristas ── */}
        <TabsContent value="motoristas" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motorista</TableHead>
                    <TableHead>CNH</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motoristas.map((m) => {
                    const cnhVencida = new Date(m.vencimentoCNH) < new Date();
                    return (
                      <TableRow key={m.id} className="cursor-pointer" onClick={() => openMotoristaDetail(m)}>
                        <TableCell className="font-medium text-foreground">{m.nome}</TableCell>
                        <TableCell className="text-muted-foreground">
                          Cat. {m.categoriaCNH}
                          {cnhVencida && <Badge variant="destructive" className="ml-2 text-xs">Vencida</Badge>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{m.telefone}</TableCell>
                        <TableCell className="text-muted-foreground">{m.veiculo}</TableCell>
                        <TableCell className="text-muted-foreground">{m.rota}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500">★</span>
                            <span className="text-foreground font-medium">{m.avaliacaoMedia}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(m.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openMotoristaDetail(m); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {dialogType === "rota" && selectedRota && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> {selectedRota.nome}</DialogTitle>
                <DialogDescription>{selectedRota.origem} → {selectedRota.destino}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><Label className="text-muted-foreground">Distância</Label><p className="text-foreground font-medium">{selectedRota.distancia}</p></div>
                  <div><Label className="text-muted-foreground">Tempo Estimado</Label><p className="text-foreground font-medium">{selectedRota.tempoEstimado}</p></div>
                  <div><Label className="text-muted-foreground">Motorista</Label><p className="text-foreground font-medium">{selectedRota.motorista}</p></div>
                  <div><Label className="text-muted-foreground">Veículo</Label><p className="text-foreground font-medium">{selectedRota.veiculo}</p></div>
                  <div><Label className="text-muted-foreground">Alunos</Label><p className="text-foreground font-medium">{selectedRota.alunos}</p></div>
                  <div><Label className="text-muted-foreground">Turno</Label><p className="text-foreground font-medium capitalize">{selectedRota.turno}</p></div>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Paradas ({selectedRota.paradas.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedRota.paradas.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">{i + 1}</div>
                        <span className="text-foreground">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {dialogType === "motorista" && selectedMotorista && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> {selectedMotorista.nome}</DialogTitle>
                <DialogDescription>Detalhes do motorista</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><Label className="text-muted-foreground">CNH</Label><p className="text-foreground font-medium">{selectedMotorista.cnh}</p></div>
                  <div><Label className="text-muted-foreground">Categoria</Label><p className="text-foreground font-medium">{selectedMotorista.categoriaCNH}</p></div>
                  <div><Label className="text-muted-foreground">Vencimento CNH</Label><p className="text-foreground font-medium">{new Date(selectedMotorista.vencimentoCNH).toLocaleDateString("pt-BR")}</p></div>
                  <div><Label className="text-muted-foreground">Telefone</Label><p className="text-foreground font-medium">{selectedMotorista.telefone}</p></div>
                  <div><Label className="text-muted-foreground">Veículo</Label><p className="text-foreground font-medium">{selectedMotorista.veiculo}</p></div>
                  <div><Label className="text-muted-foreground">Rota</Label><p className="text-foreground font-medium">{selectedMotorista.rota}</p></div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-muted-foreground">Avaliação Média</Label>
                    <p className="text-2xl font-bold text-foreground flex items-center gap-1">
                      <span className="text-amber-500">★</span> {selectedMotorista.avaliacaoMedia}
                    </p>
                  </div>
                  {getStatusBadge(selectedMotorista.status)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
