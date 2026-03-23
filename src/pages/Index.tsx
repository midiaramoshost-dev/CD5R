import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  CheckCircle2,
  ArrowRight,
  School,
  FileText,
  MessageSquare,
  CreditCard,
  Moon,
  Sun,
  Star,
  HelpCircle,
  Send,
  MapPin,
  Mail,
  Globe,
  Zap,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  Heart,
  Check,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { usePlanos } from "@/contexts/PlanosContext";
import { SchoolOnboardingDialog } from "@/components/onboarding/SchoolOnboardingDialog";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { PlatformLogo } from "@/components/PlatformLogo";
import { ContactForm } from "@/components/landing/ContactForm";
import { ReferralSection } from "@/components/landing/ReferralSection";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const faqData = [
  {
    question: "Qual o melhor sistema de gestão escolar em Sorocaba?",
    answer: "O i ESCOLAS é a plataforma #1 de gestão escolar em Sorocaba e região. Com diário digital, portal do aluno, comunicação com pais, gestão financeira e muito mais.",
  },
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Oferecemos um plano Free permanente com até 50 alunos. Não é necessário cartão de crédito. Você pode migrar para um plano pago quando precisar.",
  },
  {
    question: "Posso migrar meus dados de outro sistema?",
    answer: "Sim! Nossa equipe oferece assistência gratuita para migração de dados. Importamos alunos, professores, turmas, notas e históricos de planilhas ou outros sistemas.",
  },
  {
    question: "O sistema funciona em dispositivos móveis?",
    answer: "Sim! O i ESCOLAS é totalmente responsivo e funciona em smartphones, tablets e computadores.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Utilizamos criptografia, servidores no Brasil (LGPD), backups diários e autenticação em dois fatores.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, não há fidelidade ou multa. Você pode fazer downgrade para o plano Free ou cancelar quando quiser.",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Diário de Classe Digital",
    description: "Registro de aulas, frequência e conteúdos de forma simples e intuitiva.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description: "Indicadores em tempo real sobre desempenho e alertas de risco acadêmico.",
  },
  {
    icon: FileText,
    title: "Boletins Automáticos",
    description: "Geração automática de boletins, históricos e relatórios pedagógicos.",
  },
  {
    icon: MessageSquare,
    title: "Comunicação Integrada",
    description: "Comunicados e notificações para toda a comunidade escolar.",
  },
  {
    icon: CreditCard,
    title: "Gestão Financeira",
    description: "Controle de mensalidades, cobranças automáticas e relatórios.",
  },
  {
    icon: Users,
    title: "Portais Aluno & Responsável",
    description: "Acesso a notas, frequência, materiais e acompanhamento em tempo real.",
  },
];

const stats = [
  { value: "500+", label: "Escolas Ativas", icon: School },
  { value: "150k+", label: "Alunos", icon: Users },
  { value: "12k+", label: "Professores", icon: GraduationCap },
  { value: "98%", label: "Satisfação", icon: Heart },
];

const testimonials = [
  {
    quote: "Reduzimos 70% do tempo gasto com processos administrativos.",
    author: "Maria Silva",
    role: "Diretora",
    school: "Colégio São Paulo",
    avatar: "MS",
  },
  {
    quote: "A comunicação com os pais melhorou drasticamente.",
    author: "Carlos Santos",
    role: "Coordenador Pedagógico",
    school: "Escola Nova Era",
    avatar: "CS",
  },
  {
    quote: "Lanço notas e frequência de qualquer lugar. Mudou minha rotina.",
    author: "Ana Oliveira",
    role: "Professora",
    school: "Instituto Educacional ABC",
    avatar: "AO",
  },
];

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { planos } = usePlanos();
  const { openWhatsApp } = usePlatformSettings();
  const [isAnnual, setIsAnnual] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };
    const script = document.createElement("script");
    script.id = "faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => {
      document.getElementById("faq-schema")?.remove();
    };
  }, []);

  const plans = useMemo(() => {
    const ctaMap: Record<string, string> = {
      free: "Começar Grátis",
      start: "Iniciar Trial",
      pro: "Escolher Pro",
      premium: "Falar com Vendas",
    };
    return planos.map((plano) => {
      const featuresList = [
        { text: plano.recursos.alunos, included: true },
        { text: plano.recursos.professores, included: true },
        { text: plano.recursos.suporte, included: true },
        { text: "Relatórios Avançados", included: plano.recursos.relatorios },
        { text: "Módulo Financeiro", included: plano.recursos.financeiro },
        { text: "API de Integração", included: plano.recursos.api },
      ];
      return {
        id: plano.id,
        name: plano.nome,
        monthlyPrice: plano.preco,
        annualPrice: plano.preco > 0 ? Math.round((plano.preco * 12 * 0.8) / 12) : 0,
        period: plano.preco === 0 ? "para sempre" : isAnnual ? "/mês (anual)" : "/mês",
        description: plano.descricao,
        features: featuresList,
        highlighted: plano.popular || false,
        cta: ctaMap[plano.id] || "Escolher Plano",
      };
    });
  }, [planos, isAnnual]);

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return "0";
    return isAnnual ? plan.annualPrice.toString() : plan.monthlyPrice.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="i ESCOLAS — Plataforma de Gestão Escolar #1 em Sorocaba"
        description="Sistema completo de gestão escolar para educação infantil, fundamental e médio. Diário digital, portal do aluno, gestão financeira e mais."
        canonical="https://iescolas.com.br"
      />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="container flex h-16 items-center justify-between">
          <PlatformLogo size="lg" />
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#recursos", label: "Recursos" },
              { href: "#planos", label: "Planos" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "FAQ" },
              { href: "#contato", label: "Contato" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="gap-2">
                Começar Agora <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
        <div className="container relative text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-6 py-2 px-4">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Plataforma #1 em Gestão Escolar — Sorocaba e Região
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6"
            >
              A escola ensina.{" "}
              <span className="text-gradient-brand">Nós cuidamos do resto.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto mb-10"
            >
              Automatize processos, melhore a comunicação com pais e alunos, e foque no que importa: a educação.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
                  Começar Gratuitamente <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 text-base px-8"
                onClick={() => openWhatsApp("Olá! Gostaria de agendar uma demonstração.")}
              >
                Agendar Demonstração
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
              {[
                { icon: Shield, text: "Dados 100% seguros" },
                { icon: Clock, text: "Setup em 5 minutos" },
                { icon: Award, text: "+500 escolas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="recursos" className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Recursos</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Tudo que sua escola precisa</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Referral ── */}
      <ReferralSection />

      {/* ── Plans ── */}
      <section id="planos" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Planos</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Investimento que se paga</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Planos flexíveis que crescem com sua escola. Comece grátis, evolua quando quiser.
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Mensal</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isAnnual ? "translate-x-7" : ""}`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Anual</span>
              {isAnnual && (
                <Badge className="bg-primary/10 text-primary border-primary/20">Economize 20%</Badge>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`relative h-full flex flex-col ${
                    plan.highlighted
                      ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                      : "border-border/50"
                  }`}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3">
                      <Star className="h-3 w-3 mr-1" /> Mais Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-bold">{getPrice(plan)}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2.5 text-sm">
                          {f.included ? (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          )}
                          <span className={f.included ? "" : "text-muted-foreground/50"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => {
                        const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
                        setSelectedPlan({ id: plan.id, name: plan.name, price });
                        setOnboardingOpen(true);
                      }}
                    >
                      {plan.cta} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="depoimentos" className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">O que nossos clientes dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Histórias reais de escolas que transformaram sua gestão
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed mb-5">"{t.quote}"</blockquote>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.author}</p>
                        <p className="text-xs text-muted-foreground">{t.role} • {t.school}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="mr-2 h-4 w-4" /> FAQ
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Perguntas Frequentes</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-card border rounded-xl px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-10">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => openWhatsApp("Olá! Gostaria de falar com um especialista.")}
              >
                <MessageSquare className="h-4 w-4" /> Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contato" className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Badge variant="outline" className="mb-4">
                <Send className="mr-2 h-4 w-4" /> Contato
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">Fale com nossa equipe</h2>
              <p className="text-muted-foreground mb-8">
                Tire suas dúvidas, agende uma demonstração ou solicite um orçamento personalizado.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-0.5">E-mail</h3>
                    <p className="text-sm text-muted-foreground">contato@iescolas.com.br</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-0.5">Localização</h3>
                    <p className="text-sm text-muted-foreground">Sorocaba — SP, Região Metropolitana</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-6 md:p-8 shadow-lg border-border/50">
              <ContactForm />
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">Pronto para transformar sua escola?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Junte-se a mais de 500 escolas que já modernizaram sua gestão. Comece gratuitamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                Criar Conta Grátis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => openWhatsApp("Olá! Gostaria de agendar uma demonstração.")}
            >
              Agendar Demo <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            ✓ Sem cartão de crédito &nbsp; ✓ Setup em 5 minutos &nbsp; ✓ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-card/50 py-14">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <PlatformLogo size="lg" />
              <p className="text-sm text-muted-foreground mt-4 max-w-sm">
                Plataforma completa de gestão escolar para educação infantil, fundamental e médio em Sorocaba e região.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                <MapPin className="inline h-3.5 w-3.5 mr-1" />
                Sorocaba, Votorantim, Itu, Salto, Indaiatuba, Tatuí e mais 9 cidades.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Funcionalidades</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/funcionalidades/diario-classe" className="hover:text-foreground transition-colors">Diário de Classe</Link></li>
                <li><Link to="/funcionalidades/gestao-financeira" className="hover:text-foreground transition-colors">Gestão Financeira</Link></li>
                <li><Link to="/funcionalidades/portal-aluno" className="hover:text-foreground transition-colors">Portal do Aluno</Link></li>
                <li><Link to="/funcionalidades/portal-responsavel" className="hover:text-foreground transition-colors">Portal do Responsável</Link></li>
                <li><Link to="/funcionalidades/boletins-notas" className="hover:text-foreground transition-colors">Boletins e Notas</Link></li>
                <li><Link to="/funcionalidades/matricula-crm" className="hover:text-foreground transition-colors">CRM de Matrícula</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Cidades Atendidas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/gestao-escolar/sorocaba" className="hover:text-foreground transition-colors">Sorocaba</Link></li>
                <li><Link to="/gestao-escolar/votorantim" className="hover:text-foreground transition-colors">Votorantim</Link></li>
                <li><Link to="/gestao-escolar/itu" className="hover:text-foreground transition-colors">Itu</Link></li>
                <li><Link to="/gestao-escolar/indaiatuba" className="hover:text-foreground transition-colors">Indaiatuba</Link></li>
                <li><Link to="/gestao-escolar/salto" className="hover:text-foreground transition-colors">Salto</Link></li>
                <li><Link to="/gestao-escolar/tatui" className="hover:text-foreground transition-colors">Tatuí</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados. | Feito por Midia Ramos
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      {selectedPlan && (
        <SchoolOnboardingDialog
          open={onboardingOpen}
          onOpenChange={setOnboardingOpen}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
        />
      )}
    </div>
  );
};

export default Index;
