import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  School,
  Bell,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
  Moon,
  Sun,
  Star
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Users,
      title: "Gestão de Usuários",
      description: "Controle completo de professores, alunos, responsáveis e equipe administrativa com permissões personalizadas."
    },
    {
      icon: BookOpen,
      title: "Diário de Classe Digital",
      description: "Registro de aulas, frequência e conteúdos ministrados de forma simples e intuitiva."
    },
    {
      icon: BarChart3,
      title: "Dashboard Inteligente",
      description: "Indicadores em tempo real sobre desempenho, frequência e alertas de risco acadêmico."
    },
    {
      icon: FileText,
      title: "Boletins Automáticos",
      description: "Geração automática de boletins, históricos escolares e relatórios pedagógicos."
    },
    {
      icon: MessageSquare,
      title: "Comunicação Integrada",
      description: "Mural de comunicados, mensagens diretas e notificações para toda a comunidade escolar."
    },
    {
      icon: Calendar,
      title: "Calendário Escolar",
      description: "Gestão de eventos, feriados, períodos avaliativos e agenda acadêmica completa."
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "Grátis",
      description: "Para escolas conhecerem a plataforma",
      features: [
        "Até 50 alunos",
        "1 usuário administrador",
        "Diário de classe básico",
        "Suporte por email"
      ],
      highlighted: false
    },
    {
      name: "Start",
      price: "R$ 299",
      period: "/mês",
      description: "Para escolas em crescimento",
      features: [
        "Até 200 alunos",
        "5 usuários administradores",
        "Diário de classe completo",
        "Portal do aluno e responsável",
        "Relatórios básicos",
        "Suporte prioritário"
      ],
      highlighted: false
    },
    {
      name: "Pro",
      price: "R$ 599",
      period: "/mês",
      description: "Para escolas que buscam excelência",
      features: [
        "Até 500 alunos",
        "Usuários ilimitados",
        "Todos os módulos",
        "Dashboard avançado",
        "Alertas inteligentes",
        "API de integração",
        "Suporte 24/7"
      ],
      highlighted: true
    },
    {
      name: "Premium",
      price: "R$ 999",
      period: "/mês",
      description: "Para redes de escolas",
      features: [
        "Alunos ilimitados",
        "Multi-unidades",
        "Personalização completa",
        "Módulo financeiro",
        "Relatórios comparativos",
        "Gerente de conta dedicado",
        "SLA garantido"
      ],
      highlighted: false
    }
  ];

  const testimonials = [
    {
      quote: "O i ESCOLAS transformou a gestão da nossa escola. Reduzimos em 70% o tempo gasto com processos administrativos.",
      author: "Maria Silva",
      role: "Diretora",
      school: "Colégio São Paulo"
    },
    {
      quote: "A comunicação com os pais melhorou drasticamente. Agora eles acompanham tudo em tempo real pelo portal.",
      author: "Carlos Santos",
      role: "Coordenador Pedagógico",
      school: "Escola Nova Era"
    },
    {
      quote: "O diário digital facilitou muito meu trabalho. Lanço notas e frequência de qualquer lugar.",
      author: "Ana Oliveira",
      role: "Professora",
      school: "Instituto Educacional ABC"
    }
  ];

  const stats = [
    { value: "500+", label: "Escolas ativas" },
    { value: "150.000+", label: "Alunos cadastrados" },
    { value: "12.000+", label: "Professores" },
    { value: "98%", label: "Satisfação" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">i ESCOLAS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#depoimentos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Depoimentos
            </a>
            <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/login" className="hidden sm:block">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="mr-1 h-3 w-3" /> Plataforma #1 em Gestão Escolar
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              A escola ensina.
              <span className="block text-primary">O i ESCOLAS cuida do resto.</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Plataforma completa de gestão escolar para educação infantil, fundamental e médio. 
              Simplifique processos, melhore a comunicação e foque no que realmente importa: a educação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Começar Gratuitamente <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <School className="h-4 w-4" /> Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Recursos</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Tudo que sua escola precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição de ensino.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">E muito mais recursos avançados:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Bell, label: "Alertas Inteligentes" },
                { icon: Shield, label: "Segurança Avançada" },
                { icon: Smartphone, label: "100% Responsivo" },
                { icon: CreditCard, label: "Módulo Financeiro" }
              ].map((item, index) => (
                <Badge key={index} variant="secondary" className="gap-1.5 py-2 px-4">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Planos</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Escolha o plano ideal para sua escola
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Planos flexíveis que crescem com a sua instituição. Comece grátis e evolua conforme sua necessidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.price === "Grátis" ? "Começar Grátis" : "Contratar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              O que dizem sobre nós
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja como o i ESCOLAS está transformando a gestão de escolas em todo o Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.school}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Pronto para transformar sua escola?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Junte-se a mais de 500 escolas que já confiam no i ESCOLAS. 
              Comece gratuitamente e veja a diferença.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                  Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Falar com Consultor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary">i ESCOLAS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A escola ensina. O i ESCOLAS cuida do resto.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#recursos" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-primary transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Atualizações</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Carreiras</a></li>
                <li><a href="#contato" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
