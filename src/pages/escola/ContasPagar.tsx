import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Printer,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Save,
  Users,
  FileCheck,
  Receipt,
  Image,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAlunosResponsaveis } from "@/contexts/AlunosResponsaveisContext";

// ─── Types ───────────────────────────────────────────────────────────

interface ContaPagar {
  id: string;
  descricao: string;
  fornecedor: string;
  categoria: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: "pendente" | "pago" | "vencido";
  anexo?: string;
  observacoes?: string;
}

interface DocTemplate {
  id: string;
  title: string;
  fileName: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Default Contract Template ──────────────────────────────────────

const DEFAULT_CONTRACT_TEMPLATE = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE EDUCAÇÃO ESCOLAR - {{ANO_LETIVO}}

Documento integrante do REQUERIMENTO DE MATRÍCULA Nº {{MATRICULA}}

ALUNO: {{NOME_ALUNO}}, inscrito sob RG nº ___________________, com CPF Nº ________________________ e matrícula nº {{MATRICULA}}, beneficiário exclusivo da prestação do serviço educacional, representado/assistido pelo(a) Sr(a). {{NOME_RESPONSAVEL}}, na qualidade de CONTRATANTE sendo RESPONSÁVEL FINANCEIRO: {{NOME_RESPONSAVEL}}, CPF nº {{CPF_RESPONSAVEL}}, RG nº __________________________, com residência na {{ENDERECO_RESPONSAVEL}}, e {{NOME_ESCOLA}}, pessoa jurídica de direito privado, na qualidade de CONTRATADA, celebram o presente contrato de prestação de serviços educacionais para o nível de ( ) Educação Infantil, ( ) Ensino Fundamental ou ( ) Ensino Médio na turma ou ano: {{TURMA}} — {{SERIE}}, na modalidade preferencial de educação PRESENCIAL, regido pelas seguintes considerações, cláusulas e condições:

CONSIDERANDO

a liberdade do ensino pela iniciativa privada e o pluralismo pedagógico, princípios expressos nos arts. 205, 206 e 209 da Constituição da República;

a consciente opção dos CONTRATANTES pelo serviço privado de ensino;

que o art. 1.566 do Código Civil e 55 e 56 do Estatuto da Criança e do Adolescente atribuem aos pais ou responsáveis a obrigação de matrícula escolar e a supervisão do rendimento dos educandos;

que os arts. 15 e s.s. do Estatuto da Criança e do Adolescente asseguram aos educandos o direito de liberdade e dignidade, e inclusive atribuem aos pais a obrigação de respeito aos objetos pessoais, especialmente no que se refere ao uso diário de material didático e cadernos adequados que atendam às necessidades de aprendizagem;

que o aluno, beneficiário exclusivo da prestação do serviço educacional, deverá observar princípios éticos, morais e disciplinares adotados pela instituição de ensino, respeitando as normas de boa convivência junto aos demais integrantes da comunidade escolar;

que o art. 421‑A do Código Civil impõe que se respeite a alocação de risco definido pelos contratantes do negócio;

que o art. 394 do Código Civil admite que os contratantes estabeleçam as circunstâncias da mora.

RESOLVEM:

Cláusula 1ª – O contrato objetiva regular a prestação de serviços de educação escolar: presencial, remoto ou híbrido, observada a legislação de ensino, o Projeto Político‑Pedagógico (PPP) e o Regimento Interno da CONTRATADA, durante o ano letivo de {{ANO_LETIVO}}; definir a contraprestação pecuniária e a forma de pagamento por parte do(s) CONTRATANTE(S), bem como estabelecer os demais dispositivos complementares.

§1º - O planejamento dos serviços, a designação da época e do modo de avaliação do rendimento, a fixação de carga horária e horário de aulas, a designação de professores, a orientação didático‑pedagógica e educacional, além de outras providências que as atividades docentes exigirem, inserem‑se na responsabilidade exclusiva da CONTRATADA, vedada a ingerência do(s) CONTRATANTE(S).

§2º – As aulas que compõem a prestação do serviço, inclusive as extraordinárias, serão ministradas nas salas, horários e endereços físicos ou virtuais indicados pela CONTRATADA, observada a natureza do conteúdo e a técnica pedagógica que se fizerem necessárias.

§3º - A CONTRATADA, observado o prazo de 10 (dez) dias do início do ano letivo, indicado no calendário escolar, reserva‑se no direito de cancelamento do serviço ofertado caso o número de alunos se revele insuficiente ao custeio das despesas de operação, assegurado ao(s) CONTRATANTE(S) o direito de opção pela alteração do horário ou a devolução do pagamento efetuado.

§4º ‑ A execução do serviço de educação escolar pelo meio exclusivamente remoto constitui circunstância previsível e ordinária que obriga o(s) CONTRATANTE(S) no pagamento da integralidade do preço ajustado.

Cláusula 2ª — O(s) CONTRATANTE(S) se declararam cientes da estrutura física e virtual disponibilizada pela CONTRATADA.

§1º – O(s) CONTRATANTE(S) assumem o compromisso de investimento na aquisição de aparelhos adequados ao acesso aos endereços virtuais indicados pela CONTRATADA.

Cláusula 3ª — O pedido de matrícula se processa apenas através do preenchimento e da entrega do requerimento específico e dos demais documentos exigidos pela Secretaria Pedagógica da CONTRATADA.

§1º - O deferimento do pedido de matrícula constitui ato da CONTRATADA, condicionado à existência de vaga, à apresentação do histórico escolar e da identificação civil, à prova da idoneidade financeira e econômica quando exercida a opção pelo pagamento parcelado.

§2º - A quitação de quaisquer obrigações financeiras do(s) CONTRATANTE(S), inclusive a satisfação da primeira parcela referente ao ano letivo, certificada pela Tesouraria da CONTRATADA, constitui‑se condição para o deferimento da matrícula.

Cláusula 4ª — A prestação do serviço de educação escolar depende da aquisição do material didático, físico e/ou virtual, indicado pela CONTRATADA.

Parágrafo único - O(s) CONTRATANTE(S) se declara(m) ciente(s) de que o material didático‑pedagógico se encontra protegido pela Lei nº 9.610/98, ficando PROIBIDA A SUA REPRODUÇÃO TOTAL OU PARCIAL sem expressa autorização da CONTRATADA.

Cláusula 5ª — O(s) CONTRATANTE(S) reconhece(m) sua responsabilidade em acompanhar o progresso dos estudos do(s) aluno(s), bem como tomar ciência do conteúdo e de comunicações feitas pela CONTRATADA.

§1º ‑ Obriga‑se o(s) CONTRATANTE(S) a fazer(em) com que o(s) estudante(s) cumpra(m) o calendário escolar e os horários estabelecidos pela CONTRATADA, assumindo total responsabilidade pelas consequências advindas da não observância destes.

§2º ‑ O uso do uniforme escolar completo por parte do(s) aluno(s) é obrigatório.

Cláusula 6ª — O(s) CONTRATANTE(S) pagará(ão) pelo serviço de educação escolar o valor da anuidade referente ao período letivo de {{ANO_LETIVO}}, necessárias para a manutenção da atividade educacional.

§1º ‑ As parcelas mensais vencem no dia 10 de cada mês. Os pagamentos serão efetuados nas instituições financeiras autorizadas.

§2º - Na hipótese de inadimplemento de quaisquer das prestações, serão acrescidos 2% (dois por cento) a título de multa moratória e juros diário de 0,033% mais correção monetária (INPC) até o efetivo pagamento.

§3º - A ausência do aluno(a) nos endereços, físicos ou virtuais, aonde a CONTRATADA presta os serviços educacionais não exime do pagamento.

Cláusula 7ª — O(s) educando(s) que causar(em) danos ao estabelecimento ou a terceiros será(ão) notificado(s) na pessoa do(s) CONTRATANTE(S) para reparação (art. 927 do Código Civil).

Cláusula 8ª — O(s) CONTRATANTE(S) autoriza(m) a CONTRATADA a se utilizar de sua imagem para fins de divulgação de suas atividades, nos termos da legislação vigente. A autorização para uso da imagem se estende por tempo indeterminado.

§1º ‑ O(s) CONTRATANTE(S) autoriza(m) a coleta de dados pessoais nos termos da Lei Federal nº 13.709/2018 (LGPD).

Cláusula 9ª — O(s) CONTRATANTE(S) poderá(ão) resilir o contrato, ficando a seu encargo comunicar expressamente à CONTRATADA com pelo menos 30 (trinta) dias de antecedência e, ainda, a título de multa, obrigado(s) a satisfazer(em) a prestação vencida e a vincenda do mês subsequente ao exercício do direito.

Cláusula 10ª — A CONTRATADA poderá rescindir o contrato por desarmonia entre as partes ou quando constatado que o aluno violou a lei ou as regras do regimento interno.

Cláusula 11ª — O pagamento do preço da anuidade escolar constitui obrigação solidária dos pais e do(s) CONTRATANTE(S), mesmo na hipótese de separação ou divórcio.

Cláusula 12ª — As informações a respeito do rendimento educacional do educando serão disponibilizadas aos pais ou responsáveis legais.

Cláusula 13ª — O(s) CONTRATANTE(S) se responsabiliza pelos dados declarados, comprometendo-se a informar à CONTRATADA qualquer alteração de endereço.

Cláusula 14ª — A CONTRATADA se exime da indenização dos bens de uso do educando, extraviados ou danificados sob a responsabilidade do mesmo.

Cláusula 15ª — As partes atribuem ao contrato plena eficácia e força executiva extrajudicial.

Cláusula 16ª — Fica eleito o Foro do Município da prestação do serviço para dirimir qualquer conflito decorrente do contrato.

E sendo a expressão da vontade, declaram as partes que leram e concordam com todos os termos, assinando o presente contrato junto às testemunhas.

{{CIDADE_ESCOLA}}, _____ de ________________ de {{ANO_LETIVO}}.


___________________________________
CONTRATANTE: {{NOME_RESPONSAVEL}}
CPF: {{CPF_RESPONSAVEL}}


___________________________________
{{NOME_ESCOLA}} - CONTRATADA


___________________________________
Testemunha
CPF ________________________________


___________________________________
Testemunha
CPF ________________________________`;

// ─── Data ────────────────────────────────────────────────────────────

const initialContas: ContaPagar[] = [
  { id: "1", descricao: "Energia Elétrica - Janeiro", fornecedor: "CPFL Energia", categoria: "Utilidades", valor: 2850.0, dataVencimento: "2024-01-25", status: "pendente" },
  { id: "2", descricao: "Internet Fibra", fornecedor: "Vivo Empresas", categoria: "Telecomunicações", valor: 450.0, dataVencimento: "2024-01-20", dataPagamento: "2024-01-18", status: "pago" },
  { id: "3", descricao: "Material de Limpeza", fornecedor: "Distribuidora Clean", categoria: "Suprimentos", valor: 1200.0, dataVencimento: "2024-01-15", status: "vencido" },
  { id: "4", descricao: "Manutenção Ar Condicionado", fornecedor: "Clima Tech", categoria: "Manutenção", valor: 800.0, dataVencimento: "2024-01-30", status: "pendente" },
  { id: "5", descricao: "Material Didático", fornecedor: "Editora Educação", categoria: "Material Pedagógico", valor: 5500.0, dataVencimento: "2024-02-05", status: "pendente" },
];

const categorias = ["Utilidades", "Telecomunicações", "Suprimentos", "Manutenção", "Material Pedagógico", "Alimentação", "Transporte", "Outros"];

type PaymentProviderKey = "mercadopago" | "pagarme" | "stripe" | "asaas";

const contractVariables = [
  { key: "{{NOME_RESPONSAVEL}}", desc: "Nome do responsável" },
  { key: "{{CPF_RESPONSAVEL}}", desc: "CPF do responsável" },
  { key: "{{ENDERECO_RESPONSAVEL}}", desc: "Endereço do responsável" },
  { key: "{{TELEFONE_RESPONSAVEL}}", desc: "Telefone do responsável" },
  { key: "{{EMAIL_RESPONSAVEL}}", desc: "E-mail do responsável" },
  { key: "{{PARENTESCO}}", desc: "Parentesco" },
  { key: "{{NOME_ALUNO}}", desc: "Nome do aluno" },
  { key: "{{MATRICULA}}", desc: "Matrícula do aluno" },
  { key: "{{TURMA}}", desc: "Turma do aluno" },
  { key: "{{SERIE}}", desc: "Série do aluno" },
  { key: "{{DATA_ATUAL}}", desc: "Data de hoje" },
  { key: "{{ANO_LETIVO}}", desc: "Ano letivo atual" },
  { key: "{{NOME_ESCOLA}}", desc: "Nome da escola" },
  { key: "{{CIDADE_ESCOLA}}", desc: "Cidade da escola" },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function loadTemplates(key: string): DocTemplate[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistTemplates(key: string, list: DocTemplate[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function printDocument(title: string, content: string, fileName: string) {
  const w = window.open("", "_blank");
  if (!w) { toast.error("Popup bloqueado. Permita popups para imprimir."); return; }
  const escaped = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  w.document.open();
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><title>${title}</title>
<style>body{font-family:Arial,Helvetica,sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{font-size:20px;margin:0 0 8px;border-bottom:2px solid #333;padding-bottom:8px}.meta{color:#666;font-size:12px;margin-bottom:24px}.content{white-space:pre-wrap;word-wrap:break-word;font-size:14px;line-height:1.6}@media print{body{padding:20px}}</style>
</head><body><h1>${title}</h1><div class="meta">Arquivo: ${fileName || "(sem anexo)"} — Impresso em ${new Date().toLocaleDateString("pt-BR")}</div><div class="content">${escaped}</div><script>window.onload=function(){window.print();}<\/script></body></html>`);
  w.document.close();
  toast.success("Documento enviado para impressão");
}

// ─── Component ───────────────────────────────────────────────────────

export default function ContasPagar() {
  const { responsaveis, alunos, getAlunosComResponsaveis } = useAlunosResponsaveis();

  // Contas state
  const [contas, setContas] = useState<ContaPagar[]>(initialContas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConta, setSelectedConta] = useState<ContaPagar | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment config
  const [isPaymentsConfigOpen, setIsPaymentsConfigOpen] = useState(false);
  const [paymentsConfig, setPaymentsConfig] = useState({
    provider: "mercadopago" as PaymentProviderKey,
    environment: "sandbox" as "sandbox" | "production",
    apiKey: "", publicKey: "", webhookUrl: "",
    enabledMethods: { pix: true, boleto: true, card: true },
  });

  // ─── Recibos (templates) ───
  const recibosInputRef = useRef<HTMLInputElement>(null);
  const [isRecibosOpen, setIsRecibosOpen] = useState(false);
  const [isRecibosEditing, setIsRecibosEditing] = useState(false);
  const [selectedReciboId, setSelectedReciboId] = useState<string | null>(null);
  const [recibosForm, setRecibosForm] = useState({ title: "", fileName: "", content: "" });
  const [reciboTemplates, setReciboTemplates] = useState<DocTemplate[]>(() => loadTemplates("school:receiptTemplates"));

  const saveReciboTemplates = (list: DocTemplate[]) => { setReciboTemplates(list); persistTemplates("school:receiptTemplates", list); };

  // ─── Contratos (templates) ───
  const contratosInputRef = useRef<HTMLInputElement>(null);
  const [isContratosOpen, setIsContratosOpen] = useState(false);
  const [isContratosEditing, setIsContratosEditing] = useState(false);
  const [selectedContratoId, setSelectedContratoId] = useState<string | null>(null);
  const [contratosForm, setContratosForm] = useState({ title: "", fileName: "", content: "" });
  const [contratoTemplates, setContratoTemplates] = useState<DocTemplate[]>(() => {
    const saved = loadTemplates("school:contractTemplates");
    if (saved.length > 0) return saved;
    // Seed with default template
    const defaultTpl: DocTemplate = {
      id: "default-contract",
      title: "Contrato de Prestação de Serviços Educacionais",
      fileName: "",
      content: DEFAULT_CONTRACT_TEMPLATE,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persistTemplates("school:contractTemplates", [defaultTpl]);
    return [defaultTpl];
  });
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [selectedResponsavelIds, setSelectedResponsavelIds] = useState<string[]>([]);

  // Logo for contracts
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [contractLogoUrl, setContractLogoUrl] = useState<string | null>(() => {
    try { return localStorage.getItem("escola_logo") || null; } catch { return null; }
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("A logo deve ter no máximo 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setContractLogoUrl(url);
      localStorage.setItem("escola_logo", url);
      toast.success("Logo carregada com sucesso!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setContractLogoUrl(null);
    localStorage.removeItem("escola_logo");
    toast.success("Logo removida");
  };

  const saveContratoTemplates = (list: DocTemplate[]) => { setContratoTemplates(list); persistTemplates("school:contractTemplates", list); };

  // School config (for contract variables)
  const [schoolConfig, setSchoolConfig] = useState(() => {
    try {
      const raw = localStorage.getItem("school:contractConfig");
      return raw ? JSON.parse(raw) : { nomeEscola: "", cidadeEscola: "" };
    } catch { return { nomeEscola: "", cidadeEscola: "" }; }
  });

  const saveSchoolConfig = (config: typeof schoolConfig) => {
    setSchoolConfig(config);
    localStorage.setItem("school:contractConfig", JSON.stringify(config));
  };

  // Form data for contas
  const [formData, setFormData] = useState({ descricao: "", fornecedor: "", categoria: "", valor: "", dataVencimento: "", observacoes: "" });

  // ─── Contas logic ──────────────────────────────────────────────────

  const filteredContas = contas.filter((c) => {
    const matchesSearch = c.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || c.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filterStatus === "all" || c.status === filterStatus);
  });

  const totalPendente = contas.filter((c) => c.status === "pendente").reduce((a, c) => a + c.valor, 0);
  const totalVencido = contas.filter((c) => c.status === "vencido").reduce((a, c) => a + c.valor, 0);
  const totalPago = contas.filter((c) => c.status === "pago").reduce((a, c) => a + c.valor, 0);

  const resetForm = () => { setFormData({ descricao: "", fornecedor: "", categoria: "", valor: "", dataVencimento: "", observacoes: "" }); setIsEditing(false); setSelectedConta(null); };
  const handleOpenCreate = () => { resetForm(); setIsDialogOpen(true); };
  const handleOpenEdit = (conta: ContaPagar) => { setFormData({ descricao: conta.descricao, fornecedor: conta.fornecedor, categoria: conta.categoria, valor: conta.valor.toString(), dataVencimento: conta.dataVencimento, observacoes: conta.observacoes || "" }); setSelectedConta(conta); setIsEditing(true); setIsDialogOpen(true); };
  const handleOpenView = (conta: ContaPagar) => { setSelectedConta(conta); setIsViewDialogOpen(true); };
  const handleOpenDelete = (conta: ContaPagar) => { setSelectedConta(conta); setIsDeleteDialogOpen(true); };

  const handleSave = () => {
    if (!formData.descricao || !formData.fornecedor || !formData.valor) { toast.error("Preencha todos os campos obrigatórios"); return; }
    if (isEditing && selectedConta) {
      setContas(contas.map((c) => c.id === selectedConta.id ? { ...c, descricao: formData.descricao, fornecedor: formData.fornecedor, categoria: formData.categoria, valor: parseFloat(formData.valor), dataVencimento: formData.dataVencimento, observacoes: formData.observacoes } : c));
      toast.success("Conta atualizada com sucesso!");
    } else {
      setContas([...contas, { id: Date.now().toString(), descricao: formData.descricao, fornecedor: formData.fornecedor, categoria: formData.categoria, valor: parseFloat(formData.valor), dataVencimento: formData.dataVencimento, status: "pendente", observacoes: formData.observacoes }]);
      toast.success("Conta criada com sucesso!");
    }
    setIsDialogOpen(false); resetForm();
  };

  const handleDelete = () => { if (selectedConta) { setContas(contas.filter((c) => c.id !== selectedConta.id)); toast.success("Conta excluída com sucesso!"); setIsDeleteDialogOpen(false); setSelectedConta(null); } };
  const handlePrint = () => { window.print(); toast.success("Relatório enviado para impressão"); };

  const handleExport = () => {
    const csvContent = [["Descrição", "Fornecedor", "Categoria", "Valor", "Vencimento", "Status"].join(","), ...filteredContas.map((c) => [c.descricao, c.fornecedor, c.categoria, c.valor.toFixed(2), c.dataVencimento, c.status].join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "contas_pagar.csv"; a.click();
    toast.success("Arquivo exportado com sucesso!");
  };

  const handleUpload = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) toast.success(`Arquivo "${file.name}" anexado com sucesso!`); };

  // Payment config
  const handleOpenPaymentsConfig = () => { try { const raw = localStorage.getItem("school:paymentsConfig"); if (raw) setPaymentsConfig(JSON.parse(raw)); } catch {} setIsPaymentsConfigOpen(true); };
  const handleSavePaymentsConfig = () => { try { localStorage.setItem("school:paymentsConfig", JSON.stringify(paymentsConfig)); toast.success("Configurações de pagamento salvas!"); setIsPaymentsConfigOpen(false); } catch { toast.error("Não foi possível salvar as configurações"); } };

  // ─── Template CRUD (generic) ───────────────────────────────────────

  const handleTemplateSave = (
    form: { title: string; fileName: string; content: string },
    templates: DocTemplate[],
    save: (l: DocTemplate[]) => void,
    isEditingFlag: boolean,
    selectedId: string | null,
    resetFn: () => void,
  ) => {
    if (!form.title.trim()) { toast.error("Informe o título do modelo"); return; }
    if (isEditingFlag && selectedId) {
      save(templates.map((t) => t.id === selectedId ? { ...t, title: form.title, fileName: form.fileName, content: form.content, updatedAt: new Date().toISOString() } : t));
      toast.success("Modelo atualizado!");
    } else {
      const newT: DocTemplate = { id: Date.now().toString(), title: form.title, fileName: form.fileName, content: form.content, isDefault: templates.length === 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      save([...templates, newT]);
      toast.success("Modelo salvo!");
    }
    resetFn();
  };

  const handleTemplateDelete = (id: string, templates: DocTemplate[], save: (l: DocTemplate[]) => void, selectedId: string | null, resetFn: () => void) => {
    const updated = templates.filter((t) => t.id !== id);
    if (updated.length > 0 && !updated.some((t) => t.isDefault)) updated[0].isDefault = true;
    save(updated);
    if (selectedId === id) resetFn();
    toast.success("Modelo excluído");
  };

  const handleTemplateSetDefault = (id: string, templates: DocTemplate[], save: (l: DocTemplate[]) => void) => {
    save(templates.map((t) => ({ ...t, isDefault: t.id === id })));
    toast.success("Modelo definido como padrão!");
  };

  // Recibos handlers
  const resetRecibosForm = () => { setRecibosForm({ title: "", fileName: "", content: "" }); setIsRecibosEditing(false); setSelectedReciboId(null); };
  const handleReciboFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setRecibosForm((p) => ({ ...p, fileName: f.name, title: p.title || f.name })); toast.success(`Arquivo "${f.name}" carregado.`); };

  // Contratos handlers
  const resetContratosForm = () => { setContratosForm({ title: "", fileName: "", content: "" }); setIsContratosEditing(false); setSelectedContratoId(null); };
  const handleContratoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setContratosForm((p) => ({ ...p, fileName: f.name, title: p.title || f.name })); toast.success(`Arquivo "${f.name}" carregado.`); };

  // ─── Batch contract generation ─────────────────────────────────────

  const defaultContrato = contratoTemplates.find((t) => t.isDefault);

  const substituirVariaveis = (content: string, responsavelId: string): string => {
    const resp = responsaveis.find((r) => r.id === responsavelId);
    if (!resp) return content;
    const alunosDoResp = alunos.filter((a) => a.responsavelId === responsavelId);
    const aluno = alunosDoResp[0];
    let result = content;
    result = result.replace(/\{\{NOME_RESPONSAVEL\}\}/g, resp.nome);
    result = result.replace(/\{\{CPF_RESPONSAVEL\}\}/g, resp.cpf);
    result = result.replace(/\{\{ENDERECO_RESPONSAVEL\}\}/g, resp.endereco);
    result = result.replace(/\{\{TELEFONE_RESPONSAVEL\}\}/g, resp.telefone);
    result = result.replace(/\{\{EMAIL_RESPONSAVEL\}\}/g, resp.email);
    result = result.replace(/\{\{PARENTESCO\}\}/g, resp.parentesco);
    result = result.replace(/\{\{NOME_ALUNO\}\}/g, aluno?.nome || "—");
    result = result.replace(/\{\{MATRICULA\}\}/g, aluno?.matricula || "—");
    result = result.replace(/\{\{TURMA\}\}/g, aluno?.turma || "—");
    result = result.replace(/\{\{SERIE\}\}/g, aluno?.serie || "—");
    result = result.replace(/\{\{DATA_ATUAL\}\}/g, new Date().toLocaleDateString("pt-BR"));
    result = result.replace(/\{\{ANO_LETIVO\}\}/g, new Date().getFullYear().toString());
    result = result.replace(/\{\{NOME_ESCOLA\}\}/g, schoolConfig.nomeEscola || "{{NOME_ESCOLA}}");
    result = result.replace(/\{\{CIDADE_ESCOLA\}\}/g, schoolConfig.cidadeEscola || "{{CIDADE_ESCOLA}}");
    return result;
  };

  const handleOpenBatch = () => {
    if (!defaultContrato) { toast.error("Crie e defina um modelo de contrato como padrão primeiro."); return; }
    setSelectedResponsavelIds(responsaveis.filter((r) => r.status === "ativo").map((r) => r.id));
    setIsBatchDialogOpen(true);
  };

  const handleGenerateBatch = () => {
    if (!defaultContrato) return;
    if (selectedResponsavelIds.length === 0) { toast.error("Selecione ao menos um responsável"); return; }
    const w = window.open("", "_blank");
    if (!w) { toast.error("Popup bloqueado. Permita popups para imprimir."); return; }

    const logoHtml = contractLogoUrl
      ? `<div class="logo-header"><img src="${contractLogoUrl}" alt="Logo" />${schoolConfig.nomeEscola ? `<h1>${schoolConfig.nomeEscola}</h1>` : ""}</div>`
      : schoolConfig.nomeEscola ? `<div class="logo-header"><h1>${schoolConfig.nomeEscola}</h1></div>` : "";

    const pages = selectedResponsavelIds.map((rId) => {
      const content = substituirVariaveis(defaultContrato.content, rId);
      const resp = responsaveis.find((r) => r.id === rId);
      const escaped = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<div class="page">${logoHtml}<h2>${defaultContrato.title}</h2><p class="meta">Responsável: ${resp?.nome || "—"} — Gerado em ${new Date().toLocaleDateString("pt-BR")}</p><div class="content">${escaped}</div></div>`;
    }).join("");

    w.document.open();
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Contratos em Lote</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0}
.page{padding:40px;max-width:800px;margin:0 auto;page-break-after:always}
.page:last-child{page-break-after:auto}
.logo-header{text-align:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #333}
.logo-header img{max-height:80px;max-width:200px;object-fit:contain;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto}
.logo-header h1{font-size:18px;margin:0;color:#333}
h2{font-size:16px;margin:0 0 8px;text-align:center;text-transform:uppercase;letter-spacing:1px}
.meta{color:#666;font-size:11px;margin-bottom:20px;text-align:center}
.content{white-space:pre-wrap;word-wrap:break-word;font-size:13px;line-height:1.7;text-align:justify}
@media print{.page{padding:25px 30px}}
</style></head><body>${pages}<script>window.onload=function(){window.print();}<\/script></body></html>`);
    w.document.close();
    toast.success(`${selectedResponsavelIds.length} contratos gerados para impressão!`);
    setIsBatchDialogOpen(false);
  };

  const toggleResponsavel = (id: string) => {
    setSelectedResponsavelIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAllResponsaveis = () => {
    const activeIds = responsaveis.filter((r) => r.status === "ativo").map((r) => r.id);
    setSelectedResponsavelIds((prev) => prev.length === activeIds.length ? [] : activeIds);
  };

  // ─── Status badge ──────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago": return <Badge className="bg-success text-success-foreground">Pago</Badge>;
      case "pendente": return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case "vencido": return <Badge variant="destructive">Vencido</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // ─── Template list component ───────────────────────────────────────

  const renderTemplateList = (
    templates: DocTemplate[],
    save: (l: DocTemplate[]) => void,
    onEdit: (t: DocTemplate) => void,
    selectedId: string | null,
    resetFn: () => void,
  ) => (
    templates.length > 0 ? (
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Modelos Salvos</Label>
        <div className="rounded-lg border divide-y max-h-[200px] overflow-y-auto">
          {templates.map((t) => (
            <div key={t.id} className={`flex items-center justify-between px-3 py-2 text-sm ${t.id === selectedId ? "bg-primary/5" : ""}`}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate font-medium">{t.title}</span>
                {t.isDefault && <Badge variant="secondary" className="text-xs shrink-0">Padrão</Badge>}
                {t.fileName && <span className="text-xs text-muted-foreground truncate">({t.fileName})</span>}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {!t.isDefault && <Button variant="ghost" size="sm" onClick={() => handleTemplateSetDefault(t.id, templates, save)} title="Definir como padrão"><CheckCircle className="h-3.5 w-3.5" /></Button>}
                <Button variant="ghost" size="sm" onClick={() => onEdit(t)} title="Editar"><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => printDocument(t.title, t.content, t.fileName)} title="Imprimir"><Printer className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleTemplateDelete(t.id, templates, save, selectedId, resetFn)} title="Excluir"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderTemplateForm = (
    form: { title: string; fileName: string; content: string },
    setForm: React.Dispatch<React.SetStateAction<{ title: string; fileName: string; content: string }>>,
    isEditingFlag: boolean,
    resetFn: () => void,
    onUpload: () => void,
    onSave: () => void,
    placeholder: string,
    showVariables?: boolean,
  ) => (
    <div className="rounded-lg border p-4 space-y-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{isEditingFlag ? "Editando Modelo" : "Novo Modelo"}</Label>
        {isEditingFlag && <Button variant="ghost" size="sm" onClick={resetFn}>Cancelar Edição</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título *</Label>
          <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Ex: Recibo de Mensalidade" />
        </div>
        <div className="space-y-2">
          <Label>Arquivo (PDF/DOC/DOCX)</Label>
          <div className="flex gap-2">
            <Input value={form.fileName} readOnly placeholder="Nenhum arquivo selecionado" />
            <Button type="button" variant="outline" onClick={onUpload}><Upload className="h-4 w-4 mr-2" />Enviar</Button>
          </div>
        </div>
      </div>
      {showVariables && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Variáveis disponíveis (clique para inserir)</Label>
          <div className="flex flex-wrap gap-1">
            {contractVariables.map((v) => (
              <Badge key={v.key} variant="outline" className="cursor-pointer hover:bg-primary/10 text-xs" title={v.desc}
                onClick={() => setForm((p) => ({ ...p, content: p.content + v.key }))}>
                {v.key}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label>Conteúdo (edição no painel)</Label>
        <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder={placeholder} className="min-h-[200px]" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => printDocument(form.title || "Documento", form.content || "", form.fileName)} disabled={!form.content && !form.title}>
          <Printer className="h-4 w-4 mr-2" />Imprimir
        </Button>
        <Button onClick={onSave}><Save className="h-4 w-4 mr-2" />{isEditingFlag ? "Atualizar Modelo" : "Salvar Modelo"}</Button>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" />
      <input type="file" ref={recibosInputRef} onChange={handleReciboFileChange} className="hidden" accept=".pdf,.doc,.docx" />
      <input type="file" ref={contratosInputRef} onChange={handleContratoFileChange} className="hidden" accept=".pdf,.doc,.docx" />
      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/jpeg,image/png,image/webp" />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">Gerencie as contas e despesas da escola</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleOpenPaymentsConfig}><Settings className="h-4 w-4 mr-2" />APIs de Pagamento</Button>
          <Button variant="outline" onClick={() => { resetRecibosForm(); setIsRecibosOpen(true); }}><Receipt className="h-4 w-4 mr-2" />Recibos</Button>
          <Button variant="outline" onClick={() => { resetContratosForm(); setIsContratosOpen(true); }}><FileCheck className="h-4 w-4 mr-2" />Contratos</Button>
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button variant="outline" onClick={handleUpload}><Upload className="h-4 w-4 mr-2" />Importar</Button>
          <Button onClick={handleOpenCreate}><Plus className="h-4 w-4 mr-2" />Nova Conta</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle><Clock className="h-5 w-5 text-warning" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-warning">R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Vencido</CardTitle><AlertCircle className="h-5 w-5 text-destructive" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">R$ {totalVencido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pago (Mês)</CardTitle><CheckCircle className="h-5 w-5 text-success" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-success">R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por descrição ou fornecedor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.descricao}</TableCell>
                  <TableCell>{conta.fornecedor}</TableCell>
                  <TableCell><Badge variant="outline">{conta.categoria}</Badge></TableCell>
                  <TableCell className="font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{getStatusBadge(conta.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(conta)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(conta)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUpload}><Upload className="mr-2 h-4 w-4" />Anexar Arquivo</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(conta)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ─── Dialog: APIs de Pagamento ─── */}
      <Dialog open={isPaymentsConfigOpen} onOpenChange={setIsPaymentsConfigOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Configurar APIs de Pagamento</DialogTitle>
            <DialogDescription>Configure o provedor e credenciais usadas nos pagamentos (Pix, Boleto e Cartão).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provedor</Label>
                <Select value={paymentsConfig.provider} onValueChange={(v) => setPaymentsConfig((p) => ({ ...p, provider: v as PaymentProviderKey }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                    <SelectItem value="pagarme">Pagar.me</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="asaas">Asaas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ambiente</Label>
                <Select value={paymentsConfig.environment} onValueChange={(v) => setPaymentsConfig((p) => ({ ...p, environment: v as "sandbox" | "production" }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox / Teste</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>API Key / Token</Label><Input value={paymentsConfig.apiKey} onChange={(e) => setPaymentsConfig((p) => ({ ...p, apiKey: e.target.value }))} placeholder="Ex: xxxxx" /></div>
              <div className="space-y-2"><Label>Public Key (opcional)</Label><Input value={paymentsConfig.publicKey} onChange={(e) => setPaymentsConfig((p) => ({ ...p, publicKey: e.target.value }))} placeholder="Ex: pk_xxxxx" /></div>
            </div>
            <div className="space-y-2"><Label>Webhook URL (opcional)</Label><Input value={paymentsConfig.webhookUrl} onChange={(e) => setPaymentsConfig((p) => ({ ...p, webhookUrl: e.target.value }))} placeholder="https://.../webhook" /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["pix", "boleto", "card"] as const).map((method) => (
                <button key={method} type="button" onClick={() => setPaymentsConfig((p) => ({ ...p, enabledMethods: { ...p.enabledMethods, [method]: !p.enabledMethods[method] } }))}
                  className={`flex items-center justify-between p-3 rounded-lg border ${paymentsConfig.enabledMethods[method] ? "border-primary bg-primary/5" : "border-border"}`}>
                  <span className="text-sm font-medium capitalize">{method === "card" ? "Cartão" : method === "boleto" ? "Boleto" : "Pix"}</span>
                  <Badge variant={paymentsConfig.enabledMethods[method] ? "default" : "secondary"}>{paymentsConfig.enabledMethods[method] ? "Ativo" : "Inativo"}</Badge>
                </button>
              ))}
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">Dica: por enquanto estas configurações ficam salvas no navegador (localStorage).</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentsConfigOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePaymentsConfig}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Recibos ─── */}
      <Dialog open={isRecibosOpen} onOpenChange={setIsRecibosOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Modelos de Recibos</DialogTitle>
            <DialogDescription>Crie, edite e gerencie seus modelos de recibos. Defina um como padrão.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {renderTemplateList(reciboTemplates, saveReciboTemplates, (t) => { setRecibosForm({ title: t.title, fileName: t.fileName, content: t.content }); setIsRecibosEditing(true); setSelectedReciboId(t.id); }, selectedReciboId, resetRecibosForm)}
            {renderTemplateForm(recibosForm, setRecibosForm, isRecibosEditing, resetRecibosForm, () => recibosInputRef.current?.click(),
              () => handleTemplateSave(recibosForm, reciboTemplates, saveReciboTemplates, isRecibosEditing, selectedReciboId, resetRecibosForm),
              "Cole/edite aqui o texto do recibo.")}
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">Os modelos ficam salvos no navegador (localStorage). O primeiro modelo salvo é automaticamente definido como padrão.</div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsRecibosOpen(false)}>Fechar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Contratos ─── */}
      <Dialog open={isContratosOpen} onOpenChange={setIsContratosOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileCheck className="h-5 w-5" /> Modelos de Contratos</DialogTitle>
            <DialogDescription>Crie modelos de contrato com variáveis dinâmicas e gere em lote para todos os responsáveis.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* School config for contract variables */}
            <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
              <Label className="text-sm font-semibold">Dados da Escola (usados nas variáveis)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nome da Escola</Label>
                  <Input value={schoolConfig.nomeEscola} onChange={(e) => saveSchoolConfig({ ...schoolConfig, nomeEscola: e.target.value })} placeholder="Ex: Colégio XYZ" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cidade</Label>
                  <Input value={schoolConfig.cidadeEscola} onChange={(e) => saveSchoolConfig({ ...schoolConfig, cidadeEscola: e.target.value })} placeholder="Ex: São Paulo/SP" />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
              <Label className="text-sm font-semibold">Logo da Escola (aparece no cabeçalho dos contratos)</Label>
              <div className="flex items-center gap-4">
                {contractLogoUrl ? (
                  <div className="flex items-center gap-3">
                    <img src={contractLogoUrl} alt="Logo" className="h-14 w-auto max-w-[160px] object-contain rounded border p-1" />
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}><Image className="h-3.5 w-3.5 mr-1" />Alterar</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={handleRemoveLogo}><Trash2 className="h-3.5 w-3.5 mr-1" />Remover</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
                    <Image className="h-4 w-4 mr-2" />Carregar Logo (JPG/PNG, até 2MB)
                  </Button>
                )}
              </div>
            </div>

            {/* Batch button */}
            <div className="flex items-center justify-between rounded-lg border p-3 bg-primary/5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Geração em Lote</p>
                  <p className="text-xs text-muted-foreground">{responsaveis.filter((r) => r.status === "ativo").length} responsáveis ativos cadastrados</p>
                </div>
              </div>
              <Button size="sm" onClick={handleOpenBatch} disabled={contratoTemplates.length === 0}>
                <Printer className="h-4 w-4 mr-2" />Gerar Contratos
              </Button>
            </div>

            {renderTemplateList(contratoTemplates, saveContratoTemplates, (t) => { setContratosForm({ title: t.title, fileName: t.fileName, content: t.content }); setIsContratosEditing(true); setSelectedContratoId(t.id); }, selectedContratoId, resetContratosForm)}
            {renderTemplateForm(contratosForm, setContratosForm, isContratosEditing, resetContratosForm, () => contratosInputRef.current?.click(),
              () => handleTemplateSave(contratosForm, contratoTemplates, saveContratoTemplates, isContratosEditing, selectedContratoId, resetContratosForm),
              "Use variáveis como {{NOME_RESPONSAVEL}}, {{NOME_ALUNO}}, {{CPF_RESPONSAVEL}} no texto do contrato.",
              true)}
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              O modelo padrão já inclui um contrato completo de prestação de serviços educacionais. Edite conforme necessário. Use as variáveis dinâmicas para personalizar os contratos ao gerar em lote.
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsContratosOpen(false)}>Fechar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Geração em Lote ─── */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Gerar Contratos em Lote</DialogTitle>
            <DialogDescription>
              Modelo padrão: <strong>{defaultContrato?.title || "—"}</strong>. Selecione os responsáveis para gerar os contratos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Logo preview */}
            {contractLogoUrl && (
              <div className="flex items-center gap-2 rounded-lg border p-2 bg-muted/20">
                <img src={contractLogoUrl} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain" />
                <span className="text-xs text-muted-foreground">Logo será incluída no cabeçalho de cada contrato</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Responsáveis ({selectedResponsavelIds.length} selecionados)</Label>
              <Button variant="ghost" size="sm" onClick={toggleAllResponsaveis}>
                {selectedResponsavelIds.length === responsaveis.filter((r) => r.status === "ativo").length ? "Desmarcar Todos" : "Selecionar Todos"}
              </Button>
            </div>
            <div className="rounded-lg border divide-y max-h-[300px] overflow-y-auto">
              {responsaveis.filter((r) => r.status === "ativo").map((r) => {
                const alunosDoResp = alunos.filter((a) => a.responsavelId === r.id);
                return (
                  <label key={r.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50">
                    <Checkbox checked={selectedResponsavelIds.includes(r.id)} onCheckedChange={() => toggleResponsavel(r.id)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.parentesco} — {alunosDoResp.map((a) => a.nome).join(", ") || "Sem alunos"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{r.cpf}</Badge>
                  </label>
                );
              })}
            </div>
            {responsaveis.filter((r) => r.status === "inativo").length > 0 && (
              <p className="text-xs text-muted-foreground">{responsaveis.filter((r) => r.status === "inativo").length} responsável(is) inativo(s) oculto(s).</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleGenerateBatch} disabled={selectedResponsavelIds.length === 0}>
              <Printer className="h-4 w-4 mr-2" />Gerar {selectedResponsavelIds.length} Contrato(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Nova/Editar Conta ─── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Conta" : "Nova Conta a Pagar"}</DialogTitle>
            <DialogDescription>{isEditing ? "Atualize os dados da conta" : "Cadastre uma nova conta a pagar"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label htmlFor="descricao">Descrição *</Label><Input id="descricao" placeholder="Ex: Energia Elétrica - Janeiro" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="fornecedor">Fornecedor *</Label><Input id="fornecedor" placeholder="Nome do fornecedor" value={formData.fornecedor} onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })} /></div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categorias.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="valor">Valor *</Label><Input id="valor" type="number" step="0.01" placeholder="0,00" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="vencimento">Data Vencimento</Label><Input id="vencimento" type="date" value={formData.dataVencimento} onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="observacoes">Observações</Label><Textarea id="observacoes" placeholder="Informações adicionais..." value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Salvar Alterações" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Detalhes da Conta</DialogTitle></DialogHeader>
          {selectedConta && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Descrição</Label><p className="font-medium">{selectedConta.descricao}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><div className="mt-1">{getStatusBadge(selectedConta.status)}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Fornecedor</Label><p className="font-medium">{selectedConta.fornecedor}</p></div>
                <div><Label className="text-muted-foreground">Categoria</Label><p className="font-medium">{selectedConta.categoria}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Valor</Label><p className="font-medium text-lg">R$ {selectedConta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
                <div><Label className="text-muted-foreground">Vencimento</Label><p className="font-medium">{new Date(selectedConta.dataVencimento).toLocaleDateString("pt-BR")}</p></div>
              </div>
              {selectedConta.observacoes && <div><Label className="text-muted-foreground">Observações</Label><p className="font-medium">{selectedConta.observacoes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedConta) handleOpenEdit(selectedConta); }}>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir a conta "{selectedConta?.descricao}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
