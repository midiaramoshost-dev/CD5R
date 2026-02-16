import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  FileText,
  GraduationCap,
  LogOut,
  User,
  IdCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useAlunosResponsaveis } from "@/contexts/AlunosResponsaveisContext";
import { PlatformLogo } from "@/components/PlatformLogo";

const menuItems = [
  {
    title: "Início",
    icon: LayoutDashboard,
    url: "/aluno/dashboard",
  },
  {
    title: "Minhas Notas",
    icon: ClipboardCheck,
    url: "/aluno/notas",
  },
  {
    title: "Frequência",
    icon: Calendar,
    url: "/aluno/frequencia",
  },
  {
    title: "Tarefas",
    icon: FileText,
    url: "/aluno/tarefas",
  },
  {
    title: "Materiais",
    icon: BookOpen,
    url: "/aluno/materiais",
  },
  {
    title: "Comunicados",
    icon: MessageSquare,
    url: "/aluno/comunicados",
  },
  {
    title: "Crachá e Carteirinha",
    icon: IdCard,
    url: "/aluno/carteirinha",
  },
  {
    title: "Meu Perfil",
    icon: User,
    url: "/aluno/perfil",
  },
];

export function AlunoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const { alunos } = useAlunosResponsaveis();
  const isCollapsed = state === "collapsed";

  const isActive = (url: string) => location.pathname === url;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // VibeCoding: mudança mínima pra já aparecer a foto no boletim/portal do aluno.
  // Enquanto não tem vínculo real com auth, tentamos achar pelo nome.
  const alunoAtual = alunos.find((a) => a.nome === user?.name);
  const fotoUrl = alunoAtual?.fotoUrl || localStorage.getItem("aluno:foto") || "/placeholder.svg";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/aluno/dashboard" className="flex items-center gap-3">
          <PlatformLogo
            size="md"
            showText={!isCollapsed}
            subtitle="Portal do Aluno"
            icon={<GraduationCap className="h-5 w-5 text-white" />}
            iconClassName="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Perfil do Aluno */}
        {!isCollapsed && (
          <div className="px-3 pb-4 mb-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={fotoUrl} alt={user?.name || "Aluno"} />
                <AvatarFallback className="bg-emerald-500 text-white">
                  {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AL"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name || "Aluno"}</span>
                <span className="text-xs text-sidebar-foreground/60">5º Ano A • Manhã</span>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70 hover:text-destructive cursor-pointer"
              tooltip="Sair"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
