import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">i ESCOLAS</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-6">
            {["recursos", "planos", "depoimentos", "contato"].map((item, index) => (
              <motion.a 
                key={item}
                href={`#${item}`} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors capitalize"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/login" className="hidden sm:block">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Começar Agora</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container relative">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="mb-4">
                <Star className="mr-1 h-3 w-3" /> Plataforma #1 em Gestão Escolar
              </Badge>
            </motion.div>
            <motion.h1 
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A escola ensina.
              <motion.span 
                className="block text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                O i ESCOLAS cuida do resto.
              </motion.span>
            </motion.h1>
            <motion.p 
              className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Plataforma completa de gestão escolar para educação infantil, fundamental e médio. 
              Simplifique processos, melhore a comunicação e foque no que realmente importa: a educação.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Começar Gratuitamente <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <School className="h-4 w-4" /> Agendar Demonstração
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-primary"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 md:py-28">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">Recursos</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Tudo que sua escola precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição de ensino.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group h-full">
                    <CardHeader>
                      <motion.div 
                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="h-6 w-6" />
                      </motion.div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground mb-4">E muito mais recursos avançados:</p>
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: Bell, label: "Alertas Inteligentes" },
                { icon: Shield, label: "Segurança Avançada" },
                { icon: Smartphone, label: "100% Responsivo" },
                { icon: CreditCard, label: "Módulo Financeiro" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge variant="secondary" className="gap-1.5 py-2 px-4">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">Planos</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Escolha o plano ideal para sua escola
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Planos flexíveis que crescem com a sua instituição. Comece grátis e evolua conforme sua necessidade.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className={`relative h-full ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
                  >
                    {plan.highlighted && (
                      <motion.div 
                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                      >
                        <Badge className="bg-primary">Mais Popular</Badge>
                      </motion.div>
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
                          <motion.li 
                            key={featureIndex} 
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + featureIndex * 0.05 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          className="w-full mt-6" 
                          variant={plan.highlighted ? "default" : "outline"}
                        >
                          {plan.price === "Grátis" ? "Começar Grátis" : "Contratar"}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 md:py-28">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              O que dizem sobre nós
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja como o i ESCOLAS está transformando a gestão de escolas em todo o Brasil.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 15px 30px -15px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card h-full">
                    <CardContent className="pt-6">
                      <motion.div 
                        className="flex gap-1 mb-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            variants={scaleIn}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                          >
                            <Star className="h-4 w-4 fill-primary text-primary" />
                          </motion.div>
                        ))}
                      </motion.div>
                      <blockquote className="text-muted-foreground mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-sm font-medium text-primary">
                            {testimonial.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </motion.div>
                        <div>
                          <div className="font-medium">{testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role} • {testimonial.school}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        id="contato" 
        className="py-20 md:py-28 bg-primary text-primary-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Pronto para transformar sua escola?
            </motion.h2>
            <motion.p 
              className="text-lg opacity-90 mb-8"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Junte-se a mais de 500 escolas que já confiam no i ESCOLAS. 
              Comece gratuitamente e veja a diferença.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                    Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Falar com Consultor
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="border-t py-12 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="col-span-2 md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary">i ESCOLAS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A escola ensina. O i ESCOLAS cuida do resto.
              </p>
            </motion.div>
            
            {[
              {
                title: "Produto",
                links: [
                  { label: "Recursos", href: "#recursos" },
                  { label: "Planos", href: "#planos" },
                  { label: "Atualizações", href: "#" },
                  { label: "Roadmap", href: "#" }
                ]
              },
              {
                title: "Empresa",
                links: [
                  { label: "Sobre nós", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Carreiras", href: "#" },
                  { label: "Contato", href: "#contato" }
                ]
              },
              {
                title: "Suporte",
                links: [
                  { label: "Central de Ajuda", href: "#" },
                  { label: "Documentação", href: "#" },
                  { label: "Status", href: "#" },
                  { label: "Termos de Uso", href: "#" }
                ]
              }
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (sectionIndex + 1) }}
              >
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <motion.a 
                        href={link.href} 
                        className="hover:text-primary transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {["Privacidade", "Termos", "Cookies"].map((item) => (
                <motion.a 
                  key={item}
                  href="#" 
                  className="hover:text-primary transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
