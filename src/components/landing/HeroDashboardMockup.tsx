import { Search, Bell, Home, Users, GraduationCap, BookOpen, Wallet, MessageSquare, BarChart3, Settings, ArrowUp, MoreHorizontal } from "lucide-react";

/**
 * Mockup visual do Dashboard real da plataforma para uso no Hero da landing.
 * Renderizado em HTML/CSS (não imagem) para nitidez perfeita em qualquer DPR.
 */
export function HeroDashboardMockup() {
  const bars = [38, 52, 45, 68, 60, 75, 58, 82, 70, 88, 76, 95];

  const stats = [
    { label: "Alunos", value: "1.247", change: "+12", icon: GraduationCap },
    { label: "Professores", value: "48", change: "+2", icon: Users },
    { label: "Frequência", value: "94%", change: "+3%", icon: BarChart3 },
    { label: "Receita", value: "R$ 124k", change: "+18%", icon: Wallet },
  ];

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: GraduationCap, label: "Alunos" },
    { icon: Users, label: "Professores" },
    { icon: BookOpen, label: "Turmas" },
    { icon: Wallet, label: "Financeiro" },
    { icon: MessageSquare, label: "Comunicados" },
    { icon: BarChart3, label: "Relatórios" },
    { icon: Settings, label: "Configurações" },
  ];

  const activities = [
    { name: "Maria Silva", action: "Nova matrícula • 9º ano", time: "2 min", initials: "MS" },
    { name: "Carlos Santos", action: "Pagamento confirmado", time: "12 min", initials: "CS" },
    { name: "Ana Oliveira", action: "Lançou notas — Matemática", time: "28 min", initials: "AO" },
    { name: "Roberto Mendes", action: "Comunicado enviado", time: "1h", initials: "RM" },
  ];

  return (
    <div className="relative rounded-2xl border border-border/40 bg-card backdrop-blur-xl shadow-2xl shadow-foreground/10 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-muted/40">
        <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-4 flex-1 flex justify-center">
          <div className="h-5 px-3 flex items-center gap-1.5 rounded-md bg-background/80 border border-border/40 text-[10px] text-muted-foreground max-w-xs w-full justify-center">
            <span className="opacity-50">🔒</span> app.iescolas.com.br/dashboard
          </div>
        </div>
      </div>

      {/* App body */}
      <div className="grid grid-cols-12 min-h-[420px] text-foreground">
        {/* Sidebar */}
        <aside className="col-span-3 lg:col-span-2 border-r border-border/30 bg-muted/20 p-3 hidden sm:block">
          <div className="flex items-center gap-2 px-2 py-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center text-[11px] font-bold">i</div>
            <span className="text-[12px] font-semibold tracking-tight">iEscolas</span>
          </div>
          <nav className="space-y-0.5">
            {sidebarItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium ${
                  item.active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 sm:col-span-9 lg:col-span-10 p-4 lg:p-5 space-y-4">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 max-w-md h-8 rounded-md border border-border/40 bg-muted/30 px-2.5">
              <Search className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground/60">Buscar alunos, turmas...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-md border border-border/40 bg-muted/30 flex items-center justify-center">
                <Bell className="h-3 w-3 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </div>
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-foreground/80 to-foreground flex items-center justify-center text-[9px] font-semibold text-background">
                MR
              </div>
            </div>
          </div>

          {/* Header */}
          <div>
            <p className="text-[10px] text-muted-foreground">Painel da escola</p>
            <h3 className="text-sm font-semibold tracking-tight">Colégio Modelo — Sorocaba</h3>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-background p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <s.icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[9px] font-medium text-success flex items-center gap-0.5">
                    <ArrowUp className="h-2 w-2" /> {s.change}
                  </span>
                </div>
                <p className="text-base font-semibold tracking-tight leading-none">{s.value}</p>
                <p className="text-[9px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Two col content */}
          <div className="grid grid-cols-12 gap-3">
            {/* Chart */}
            <div className="col-span-12 lg:col-span-8 rounded-xl border border-border/40 bg-background p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-tight">Frequência mensal</p>
                  <p className="text-[9px] text-muted-foreground">Últimos 12 meses</p>
                </div>
                <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex items-end gap-1.5 h-28">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                    <div
                      className="w-full rounded-sm bg-gradient-to-t from-foreground/70 to-foreground/40"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[8px] text-muted-foreground/60">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="col-span-12 lg:col-span-4 rounded-xl border border-border/40 bg-background p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold tracking-tight">Atividade recente</p>
                <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="space-y-2.5">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-muted flex items-center justify-center text-[8px] font-semibold text-muted-foreground">
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium truncate leading-tight">{a.name}</p>
                      <p className="text-[9px] text-muted-foreground truncate leading-tight">{a.action}</p>
                    </div>
                    <span className="text-[8px] text-muted-foreground/60 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom glow */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-foreground/10 blur-3xl -z-10" />
    </div>
  );
}
