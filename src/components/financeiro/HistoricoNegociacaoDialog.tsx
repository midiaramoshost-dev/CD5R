import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Clock,
  Plus,
  ChevronRight,
  User,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Handshake,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Inadimplente } from "./EnviarCobrancaDialog";

const STORAGE_KEY = "iescolas_historico_negociacao";

export type StatusNegociacao = 
  | "pendente" 
  | "em_contato" 
  | "negociando" 
  | "acordo_feito" 
  | "pagamento_parcial" 
  | "quitado" 
  | "sem_resposta"
  | "recusado";

export type CanalContato = "whatsapp" | "email" | "telefone" | "presencial" | "outro";

export interface RegistroContato {
  id: string;
  inadimplenteId: string;
  dataContato: string;
  canal: CanalContato;
  anotacao: string;
  statusAnterior: StatusNegociacao;
  statusNovo: StatusNegociacao;
  valorNegociado?: number;
  proximoContato?: string;
  criadoPor: string;
}

export interface HistoricoNegociacao {
  inadimplenteId: string;
  statusAtual: StatusNegociacao;
  registros: RegistroContato[];
  valorOriginal: number;
  valorNegociado?: number;
  dataAcordo?: string;
  observacoesGerais?: string;
}

interface HistoricoNegociacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inadimplente: Inadimplente | null;
  onStatusChange?: (id: string, status: StatusNegociacao) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const generateId = () => `registro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getHistoricosFromStorage = (): Record<string, HistoricoNegociacao> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveHistoricosToStorage = (historicos: Record<string, HistoricoNegociacao>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historicos));
};

export const statusConfig: Record<StatusNegociacao, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { 
    label: "Pendente", 
    color: "bg-muted text-muted-foreground border-muted-foreground/20",
    icon: <Clock className="h-3 w-3" />
  },
  em_contato: { 
    label: "Em Contato", 
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    icon: <Phone className="h-3 w-3" />
  },
  negociando: { 
    label: "Negociando", 
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    icon: <Handshake className="h-3 w-3" />
  },
  acordo_feito: { 
    label: "Acordo Feito", 
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: <CheckCircle2 className="h-3 w-3" />
  },
  pagamento_parcial: { 
    label: "Pag. Parcial", 
    color: "bg-violet-500/10 text-violet-600 border-violet-200",
    icon: <DollarSign className="h-3 w-3" />
  },
  quitado: { 
    label: "Quitado", 
    color: "bg-emerald-600/20 text-emerald-700 border-emerald-300",
    icon: <CheckCircle2 className="h-3 w-3" />
  },
  sem_resposta: { 
    label: "Sem Resposta", 
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
    icon: <RefreshCw className="h-3 w-3" />
  },
  recusado: { 
    label: "Recusado", 
    color: "bg-red-500/10 text-red-600 border-red-200",
    icon: <XCircle className="h-3 w-3" />
  },
};

const canalConfig: Record<CanalContato, { label: string; icon: React.ReactNode; color: string }> = {
  whatsapp: { 
    label: "WhatsApp", 
    icon: <MessageCircle className="h-4 w-4" />,
    color: "text-emerald-600"
  },
  email: { 
    label: "E-mail", 
    icon: <Mail className="h-4 w-4" />,
    color: "text-blue-600"
  },
  telefone: { 
    label: "Telefone", 
    icon: <Phone className="h-4 w-4" />,
    color: "text-violet-600"
  },
  presencial: { 
    label: "Presencial", 
    icon: <User className="h-4 w-4" />,
    color: "text-amber-600"
  },
  outro: { 
    label: "Outro", 
    icon: <FileText className="h-4 w-4" />,
    color: "text-muted-foreground"
  },
};

export function HistoricoNegociacaoDialog({
  open,
  onOpenChange,
  inadimplente,
  onStatusChange,
}: HistoricoNegociacaoDialogProps) {
  const { toast } = useToast();
  const [historico, setHistorico] = useState<HistoricoNegociacao | null>(null);
  const [novoRegistroOpen, setNovoRegistroOpen] = useState(false);
  
  // Form state for new registro
  const [canal, setCanal] = useState<CanalContato>("whatsapp");
  const [statusNovo, setStatusNovo] = useState<StatusNegociacao>("em_contato");
  const [anotacao, setAnotacao] = useState("");
  const [valorNegociado, setValorNegociado] = useState("");
  const [proximoContato, setProximoContato] = useState("");

  useEffect(() => {
    if (open && inadimplente) {
      const historicos = getHistoricosFromStorage();
      const existente = historicos[inadimplente.id];
      
      if (existente) {
        setHistorico(existente);
      } else {
        // Create new historico
        const novo: HistoricoNegociacao = {
          inadimplenteId: inadimplente.id,
          statusAtual: "pendente",
          registros: [],
          valorOriginal: inadimplente.valorTotal,
        };
        setHistorico(novo);
      }
    }
  }, [open, inadimplente]);

  const resetForm = () => {
    setCanal("whatsapp");
    setStatusNovo("em_contato");
    setAnotacao("");
    setValorNegociado("");
    setProximoContato("");
  };

  const salvarRegistro = () => {
    if (!historico || !inadimplente) return;

    if (!anotacao.trim()) {
      toast({
        title: "Anotação obrigatória",
        description: "Descreva o que foi conversado ou acordado.",
        variant: "destructive",
      });
      return;
    }

    const novoRegistro: RegistroContato = {
      id: generateId(),
      inadimplenteId: inadimplente.id,
      dataContato: new Date().toISOString(),
      canal,
      anotacao: anotacao.trim(),
      statusAnterior: historico.statusAtual,
      statusNovo,
      valorNegociado: valorNegociado ? parseFloat(valorNegociado.replace(/\D/g, "")) / 100 : undefined,
      proximoContato: proximoContato || undefined,
      criadoPor: "Usuário",
    };

    const historicoAtualizado: HistoricoNegociacao = {
      ...historico,
      statusAtual: statusNovo,
      registros: [novoRegistro, ...historico.registros],
      valorNegociado: novoRegistro.valorNegociado || historico.valorNegociado,
      dataAcordo: statusNovo === "acordo_feito" ? new Date().toISOString() : historico.dataAcordo,
    };

    // Save to storage
    const historicos = getHistoricosFromStorage();
    historicos[inadimplente.id] = historicoAtualizado;
    saveHistoricosToStorage(historicos);

    setHistorico(historicoAtualizado);
    setNovoRegistroOpen(false);
    resetForm();

    // Notify parent about status change
    if (onStatusChange && statusNovo !== historico.statusAtual) {
      onStatusChange(inadimplente.id, statusNovo);
    }

    toast({
      title: "Registro salvo!",
      description: "O histórico de negociação foi atualizado.",
    });
  };

  if (!inadimplente) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Histórico de Negociação
            </DialogTitle>
            <DialogDescription>
              Acompanhe todos os contatos e negociações realizadas
            </DialogDescription>
          </DialogHeader>

          {/* Inadimplente Info Card */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{inadimplente.responsavel}</h3>
                <p className="text-sm text-muted-foreground">
                  {inadimplente.aluno} • {inadimplente.turma}
                </p>
              </div>
              {historico && (
                <Badge className={cn("gap-1", statusConfig[historico.statusAtual].color)}>
                  {statusConfig[historico.statusAtual].icon}
                  {statusConfig[historico.statusAtual].label}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-muted-foreground">Valor devido</p>
                  <p className="font-semibold text-destructive">{formatCurrency(inadimplente.valorTotal)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-muted-foreground">Meses</p>
                  <p className="font-semibold">{inadimplente.mesesDevidos}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Último contato</p>
                  <p className="font-semibold">
                    {format(new Date(inadimplente.ultimoContato), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {historico?.valorNegociado && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <Handshake className="h-4 w-4 text-emerald-600" />
                <span className="text-sm">Valor negociado:</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(historico.valorNegociado)}
                </span>
              </div>
            )}
          </div>

          {/* Add new registro button */}
          <Button onClick={() => setNovoRegistroOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Contato
          </Button>

          {/* Timeline */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            {historico?.registros.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhum registro de contato</p>
                <p className="text-sm">Clique em "Registrar Contato" para iniciar</p>
              </div>
            ) : (
              <div className="relative space-y-0 py-2">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
                
                {historico?.registros.map((registro, index) => (
                  <div key={registro.id} className="relative flex gap-4 pb-6">
                    {/* Timeline dot */}
                    <div className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                      canalConfig[registro.canal].color
                    )}>
                      {canalConfig[registro.canal].icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{canalConfig[registro.canal].label}</span>
                          {registro.statusAnterior !== registro.statusNovo && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs py-0">
                                {statusConfig[registro.statusAnterior].label}
                              </Badge>
                              <ChevronRight className="h-3 w-3" />
                              <Badge className={cn("text-xs py-0", statusConfig[registro.statusNovo].color)}>
                                {statusConfig[registro.statusNovo].label}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(registro.dataContato), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="rounded-lg bg-muted/50 p-3 text-sm">
                        <p className="whitespace-pre-wrap">{registro.anotacao}</p>
                        
                        {(registro.valorNegociado || registro.proximoContato) && (
                          <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-3 text-xs">
                            {registro.valorNegociado && (
                              <div className="flex items-center gap-1 text-emerald-600">
                                <DollarSign className="h-3 w-3" />
                                Valor: {formatCurrency(registro.valorNegociado)}
                              </div>
                            )}
                            {registro.proximoContato && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <Calendar className="h-3 w-3" />
                                Próximo contato: {registro.proximoContato}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Sheet for new registro */}
      <Sheet open={novoRegistroOpen} onOpenChange={setNovoRegistroOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Registrar Contato</SheetTitle>
            <SheetDescription>
              Adicione detalhes sobre a conversa ou negociação
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Canal de Contato</Label>
              <Select value={canal} onValueChange={(v) => setCanal(v as CanalContato)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(canalConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className={cn("flex items-center gap-2", config.color)}>
                        {config.icon}
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status da Negociação</Label>
              <Select value={statusNovo} onValueChange={(v) => setStatusNovo(v as StatusNegociacao)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {config.icon}
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Anotação *</Label>
              <Textarea
                placeholder="Descreva o que foi conversado, acordos feitos, próximos passos..."
                value={anotacao}
                onChange={(e) => setAnotacao(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Negociado (opcional)</Label>
                <Input
                  placeholder="R$ 0,00"
                  value={valorNegociado}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const formatted = (parseInt(value) / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    });
                    setValorNegociado(value ? formatted : "");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Próximo Contato</Label>
                <Input
                  type="date"
                  value={proximoContato}
                  onChange={(e) => setProximoContato(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => {
                setNovoRegistroOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={salvarRegistro}>
                Salvar Registro
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Hook to get negotiation status for an inadimplente
export function useHistoricoNegociacao(inadimplenteId: string): HistoricoNegociacao | null {
  const historicos = getHistoricosFromStorage();
  return historicos[inadimplenteId] || null;
}

// Get all historicos
export function getAllHistoricos(): Record<string, HistoricoNegociacao> {
  return getHistoricosFromStorage();
}
