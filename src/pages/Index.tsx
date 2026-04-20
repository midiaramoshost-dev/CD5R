import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  BookOpen, BarChart3, Shield, ArrowRight, School, MessageSquare, CreditCard,
  Moon, Sun, Star, ChevronRight, Check, X, Users, GraduationCap, FileText,
  MapPin, Zap, Clock, Award, TrendingUp, Smartphone, Lock, Globe,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { usePlanos } from "@/contexts/PlanosContext";
import { SchoolOnboardingDialog } from "@/components/onboarding/SchoolOnboardingDialog";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";
import { cidadesData } from "@/pages/cidades/cidades-data";
import { funcionalidadesData } from "@/pages/funcionalidades/funcionalidades-data";
import { HeroDashboardMockup } from "@/components/landing/HeroDashboardMockup";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const faqData = [
  { question: "Qual o melhor sistema de gestão escolar em Sorocaba?", answer: "O i ESCOLAS é a plataforma #1 de gestão escolar em Sorocaba e região metropolitana. Com mais de 500 escolas atendidas, oferece diário digital, portal do aluno, comunicação com pais, gestão financeira, boletins automáticos e muito mais. Teste gratuitamente!" },
  { question: "O i ESCOLAS atende escolas de Sorocaba, Votorantim, Itu e região?", answer: "Sim! Atendemos escolas em Sorocaba, Votorantim, Itu, Salto, Indaiatuba, Araçoiaba da Serra, Piedade, São Roque, Mairinque, Alumínio, Ibiúna, Tatuí, Boituva, Cerquilho, Capela do Alto e toda a região metropolitana de Sorocaba." },
  { question: "Como funciona o período de teste gratuito?", answer: "Oferecemos um plano Free permanente com até 50 alunos, ideal para escolas pequenas de Sorocaba e região. Não é necessário cartão de crédito. Planos pagos possuem trial de 14 dias." },
  { question: "Posso migrar meus dados de outro sistema?", answer: "Sim! Nossa equipe oferece assistência gratuita para migração de dados de escolas em Sorocaba e região. Importamos alunos, professores, turmas, notas e históricos de planilhas Excel ou de outros sistemas." },
  { question: "O sistema funciona em dispositivos móveis?", answer: "Sim! O i ESCOLAS é uma Progressive Web App (PWA) totalmente responsiva, funciona em smartphones, tablets e computadores. Instale como app no celular sem precisar da App Store." },
  { question: "Meus dados estão seguros?", answer: "Utilizamos criptografia de ponta a ponta, servidores no Brasil (em conformidade com a LGPD), backups diários automáticos e autenticação segura. Seus dados estão 100% protegidos." },
  { question: "Quanto custa o i ESCOLAS para escolas de Sorocaba?", answer: "Oferecemos planos a partir de R$ 0 (grátis para até 50 alunos) até R$ 999/mês para redes de escolas com funcionalidades premium e suporte dedicado. Desconto de 20% no plano anual." },
];

const features = [
  { icon: BookOpen, title: "Diário de Classe Digital", description: "Registro de aulas, conteúdos e frequência 100% online. Elimine cadernos físicos e acesse tudo em tempo real.", link: "/funcionalidades/diario-classe" },
  { icon: CreditCard, title: "Gestão Financeira", description: "Mensalidades, cobranças automáticas via boleto e PIX, controle de inadimplência e relatórios financeiros.", link: "/funcionalidades/gestao-financeira" },
  { icon: MessageSquare, title: "Comunicação Escola-Família", description: "Comunicados segmentados, notificações push, confirmação de leitura e canal direto com a coordenação.", link: "/funcionalidades/comunicacao-escola-familia" },
  { icon: BarChart3, title: "Dashboard Inteligente", description: "Indicadores de desempenho em tempo real, alertas automáticos e relatórios analíticos para tomada de decisão.", link: "/funcionalidades/boletins-notas" },
  { icon: GraduationCap, title: "Portal do Aluno", description: "Notas, frequência, materiais didáticos, tarefas, comunicados e carteirinha digital com QR Code.", link: "/funcionalidades/portal-aluno" },
  { icon: Users, title: "Portal do Responsável", description: "Pais acompanham notas, frequência, financeiro, cardápio nutricional e recebem notificações em tempo real.", link: "/funcionalidades/portal-responsavel" },
];

const metrics = [
  { value: "500+", label: "Escolas em Sorocaba e região", icon: School },
  { value: "150k+", label: "Alunos gerenciados", icon: GraduationCap },
  { value: "70%", label: "Menos burocracia", icon: TrendingUp },
  { value: "99.9%", label: "Uptime garantido", icon: Shield },
];

const whyChooseUs = [
  { icon: MapPin, title: "Suporte Local em Sorocaba", description: "Equipe de suporte na região de Sorocaba para treinamento presencial e atendimento personalizado." },
  { icon: Zap, title: "Implementação em 24h", description: "Configure sua escola em menos de um dia. Migração de dados gratuita e treinamento incluso." },
  { icon: Smartphone, title: "100% Mobile e PWA", description: "Funciona em qualquer dispositivo. Instale como app no celular sem App Store." },
  { icon: Lock, title: "LGPD e Dados Seguros", description: "Servidores no Brasil, criptografia, backups diários. 100% em conformidade com a LGPD." },
  { icon: Clock, title: "Suporte Rápido", description: "Tempo médio de resposta de 15 minutos. Suporte via WhatsApp, e-mail e chat." },
  { icon: Award, title: "Sem Fidelidade", description: "Cancele quando quiser. Sem multas, sem burocracia. Comece pelo plano gratuito." },
];

const testimonials = [
  { quote: "Reduzimos 70% do tempo gasto com processos administrativos. A equipe finalmente pode focar no que importa: a educação dos nossos alunos.", author: "Maria Silva", role: "Diretora", school: "Colégio São Paulo — Sorocaba", avatar: "MS" },
  { quote: "A comunicação com os pais melhorou drasticamente. Antes era um caos de bilhetes e ligações, hoje é tudo organizado e rastreável.", author: "Carlos Santos", role: "Coordenador Pedagógico", school: "Escola Nova Era — Votorantim", avatar: "CS" },
  { quote: "Lanço notas e frequência de qualquer lugar pelo celular. O portal do professor é intuitivo, rápido e confiável.", author: "Ana Oliveira", role: "Professora", school: "Instituto Educacional ABC — Itu", avatar: "AO" },
  { quote: "O módulo financeiro transformou nossa gestão. Inadimplência caiu 40% com as cobranças automáticas por PIX e boleto.", author: "Roberto Mendes", role: "Diretor Financeiro", school: "Colégio Integrado — Indaiatuba", avatar: "RM" },
];

const seoJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "i ESCOLAS",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "999", priceCurrency: "BRL", offerCount: "4" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "523", bestRating: "5", worstRating: "1" },
    description: "Plataforma completa de gestão escolar para Sorocaba, Votorantim, Itu, Salto, Indaiatuba e toda a região metropolitana. Educação infantil, fundamental e médio.",
    featureList: "Diário de Classe Digital, Portal do Aluno, Comunicação Integrada, Gestão Financeira, Boletins Automáticos, CRM de Matrícula, Controle de Frequência",
    author: { "@type": "Organization", name: "i ESCOLAS", url: "https://iescolas.com.br" },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "i ESCOLAS - Gestão Escolar em Sorocaba",
    description: "Sistema completo de gestão escolar para escolas de Sorocaba e região metropolitana. Diário digital, portal do aluno, comunicação com pais, gestão financeira e muito mais.",
    url: "https://iescolas.com.br",
    telephone: "+55-15-99999-9999",
    priceRange: "R$ 0 - R$ 999/mês",
    address: { "@type": "PostalAddress", addressLocality: "Sorocaba", addressRegion: "SP", postalCode: "18000-000", addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: "-23.5015", longitude: "-47.4526" },
    areaServed: [
      { "@type": "City", name: "Sorocaba" }, { "@type": "City", name: "Votorantim" },
      { "@type": "City", name: "Itu" }, { "@type": "City", name: "Salto" },
      { "@type": "City", name: "Indaiatuba" }, { "@type": "City", name: "Araçoiaba da Serra" },
      { "@type": "City", name: "Piedade" }, { "@type": "City", name: "São Roque" },
      { "@type": "City", name: "Mairinque" }, { "@type": "City", name: "Alumínio" },
      { "@type": "City", name: "Ibiúna" }, { "@type": "City", name: "Tatuí" },
      { "@type": "City", name: "Boituva" }, { "@type": "City", name: "Cerquilho" },
      { "@type": "City", name: "Capela do Alto" },
    ],
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { planos } = usePlanos();
  const { openWhatsApp } = usePlatformSettings();
  const [isAnnual, setIsAnnual] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);

  const plans = useMemo(() => {
    const ctaMap: Record<string, string> = { free: "Começar Grátis", start: "Iniciar Trial", pro: "Escolher Pro", premium: "Falar com Vendas" };
    return planos.map((plano) => ({
      id: plano.id, name: plano.nome,
      monthlyPrice: plano.preco,
      annualPrice: plano.preco > 0 ? Math.round((plano.preco * 12 * 0.8) / 12) : 0,
      period: plano.preco === 0 ? "para sempre" : isAnnual ? "/mês (anual)" : "/mês",
      description: plano.descricao,
      features: [
        { text: plano.recursos.alunos, included: true },
        { text: plano.recursos.professores, included: true },
        { text: plano.recursos.suporte, included: true },
        { text: "Relatórios Avançados", included: plano.recursos.relatorios },
        { text: "Módulo Financeiro", included: plano.recursos.financeiro },
        { text: "API de Integração", included: plano.recursos.api },
      ],
      highlighted: plano.popular || false,
      cta: ctaMap[plano.id] || "Escolher Plano",
    }));
  }, [planos, isAnnual]);

  const getPrice = (plan: (typeof plans)[0]) =>
    plan.monthlyPrice === 0 ? "0" : isAnnual ? plan.annualPrice.toString() : plan.monthlyPrice.toString();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="i ESCOLAS — Sistema de Gestão Escolar #1 em Sorocaba e Região"
        description="O melhor sistema de gestão escolar para Sorocaba, Votorantim, Itu, Salto, Indaiatuba e região. Diário digital, portal do aluno, gestão financeira, comunicação com pais. +500 escolas confiam. Teste grátis!"
        canonical="https://iescolas.com.br"
        jsonLd={seoJsonLd}
      />

      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 glass">
        <nav className="container flex h-16 items-center justify-between">
          <PlatformLogo size="md" />
          <div className="hidden md:flex items-center gap-10">
            {[
              { href: "#recursos", label: "Recursos" },
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#planos", label: "Planos" },
              { href: "#depoimentos", label: "Clientes" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground text-[13px]">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 font-medium text-[13px] rounded-full px-5 shadow-sm">
                Começar Agora <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-0 spotlight" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,hsl(var(--muted)/0.8),transparent_70%)] -z-10" />

        <div className="container relative">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-[12px] font-medium mb-8 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
              </span>
              <span className="text-muted-foreground">+500 escolas em Sorocaba e região já confiam</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-[2.75rem] font-semibold tracking-[-0.03em] sm:text-5xl md:text-[4.25rem] leading-[1.02] mb-6 text-gradient-premium">
              A escola ensina.
              <br />
              <span className="text-muted-foreground/70 italic font-light">Nós cuidamos do resto.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              A plataforma de gestão escolar mais completa para educação infantil, fundamental e médio em <span className="text-foreground/80 font-medium">Sorocaba e região</span>. Automatize, organize e foque no que importa.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-foreground px-10 text-sm font-medium text-background hover:bg-foreground/90 rounded-full h-12 shadow-lg shadow-foreground/10">
                  Começar Gratuitamente <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-border/50 px-10 text-sm font-medium hover:bg-muted rounded-full h-12 backdrop-blur-sm" onClick={() => openWhatsApp("Olá! Sou de Sorocaba/região e gostaria de agendar uma demonstração do i ESCOLAS.")}>
                Agendar Demonstração
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[11px] text-muted-foreground/70">
              <span className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Grátis até 50 alunos</span>
              <span className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Setup em 5 minutos</span>
            </motion.div>
          </motion.div>

          {/* Hero visual mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative mt-16 md:mt-20 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl shadow-foreground/5 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-muted/30">
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                <div className="ml-4 flex-1 h-5 rounded bg-muted/50 max-w-md" />
              </div>
              <div className="grid grid-cols-12 gap-4 p-6 min-h-[320px]">
                <div className="col-span-3 space-y-2">
                  <div className="h-8 rounded-lg bg-foreground/5" />
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-7 rounded-md bg-muted/50" />
                  ))}
                </div>
                <div className="col-span-9 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rounded-xl border border-border/40 p-3 bg-muted/20">
                        <div className="h-2 w-12 rounded bg-muted-foreground/20 mb-2" />
                        <div className="h-5 w-16 rounded bg-foreground/10" />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border/40 p-4 bg-muted/10 h-40 relative overflow-hidden">
                    <div className="h-2 w-24 rounded bg-muted-foreground/20 mb-4" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2 h-24">
                      {[40, 65, 50, 80, 70, 90, 60, 75, 55, 85, 70, 95].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t bg-foreground/20" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-foreground/10 blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ─── Logos / Social Proof Marquee ─── */}
      <section className="border-y border-border/20 bg-muted/20 overflow-hidden">
        <div className="container py-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Instituições parceiras em Sorocaba e região
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex gap-12 animate-marquee w-max">
              {[...Array(2)].flatMap((_, idx) =>
                ["Colégio São Paulo", "Escola Nova Era", "Instituto ABC", "Colégio Integrado", "Educa+ Sorocaba", "Saber & Cia", "Escola Vivência", "Colégio Horizonte"].map((name, i) => (
                  <div key={`${idx}-${i}`} className="flex items-center gap-2 text-muted-foreground/50 font-semibold text-base whitespace-nowrap">
                    <School className="h-4 w-4" />
                    {name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metrics ─── */}
      <section className="border-b border-border/30">
        <div className="container py-16">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center group">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-muted mb-4 group-hover:scale-110 transition-transform">
                  <m.icon className="h-5 w-5 text-foreground/60" />
                </div>
                <p className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient-premium">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="como-funciona" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        <div className="container relative">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Como funciona</p>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl tracking-[-0.02em] mb-4 text-gradient-premium">
              Comece em 3 passos simples
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Da configuração inicial à operação completa em menos de 24 horas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Crie sua conta grátis", desc: "Cadastro em 2 minutos. Sem cartão de crédito. Acesso imediato ao painel completo.", icon: Zap },
              { step: "02", title: "Importe seus dados", desc: "Migração assistida de planilhas ou de outros sistemas. Nossa equipe ajuda gratuitamente.", icon: TrendingUp },
              { step: "03", title: "Sua escola transformada", desc: "Treinamento incluso. Suporte local em Sorocaba via WhatsApp em até 15 minutos.", icon: Award },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="rounded-2xl border border-border/40 bg-card p-7 h-full hover:border-foreground/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-11 w-11 rounded-xl bg-foreground text-background flex items-center justify-center">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-4xl font-semibold text-muted-foreground/15 tracking-tighter">{s.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">{s.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="recursos" className="py-24 md:py-32 border-y border-border/20 bg-muted/10">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Recursos</p>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl tracking-[-0.02em] mb-4 text-gradient-premium">
              Tudo que sua escola precisa
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição. Da matrícula à formatura.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                <Link to={feature.link}>
                  <Card className="h-full border-border/30 bg-card hover:border-foreground/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/0 to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-2 relative">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/70 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-[15px] font-semibold flex items-center gap-2 tracking-tight">
                        {feature.title}
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <CardDescription className="text-[13px] leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/funcionalidades/matricula-crm">
              <Button variant="outline" className="rounded-full text-[13px] px-6 gap-2 hover:bg-foreground hover:text-background transition-colors">
                Ver todas as funcionalidades <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Diferenciais</p>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl tracking-[-0.02em] mb-4 text-gradient-premium">
              Por que escolher o i ESCOLAS?
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Mais que um sistema, uma parceira local para a transformação digital da sua escola.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <div className="flex gap-4 p-6 rounded-2xl border border-border/30 bg-card hover:border-foreground/15 hover:shadow-md transition-all h-full">
                  <div className="shrink-0 h-11 w-11 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold mb-1.5 tracking-tight">{item.title}</h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Plans ─── */}
      <section id="planos" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Preços</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Planos flexíveis para escolas de Sorocaba e região
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed">
              Comece grátis, evolua conforme sua necessidade. Sem fidelidade.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-border/40 bg-card px-5 py-2.5 shadow-sm">
              <span className={`text-[13px] font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Mensal</span>
              <button onClick={() => setIsAnnual(!isAnnual)} className={`relative h-6 w-11 rounded-full transition-colors ${isAnnual ? "bg-foreground" : "bg-muted-foreground/25"}`}>
                <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${isAnnual ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-[13px] font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Anual</span>
              {isAnnual && <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-border/40 font-semibold">-20%</Badge>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }} className="h-full">
                <Card className={`relative h-full flex flex-col transition-all duration-300 ${plan.highlighted ? "border-foreground/10 bg-card shadow-lg ring-1 ring-foreground/5 scale-[1.02]" : "border-border/30 bg-card hover:shadow-sm"}`}>
                  {plan.highlighted && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-foreground px-3 py-0.5 text-[10px] text-background font-semibold tracking-wide">Popular</Badge>
                  )}
                  <CardHeader className="text-center pt-8 pb-4">
                    <CardTitle className="text-sm font-semibold tracking-wide">{plan.name}</CardTitle>
                    <div className="mt-3">
                      <span className="text-xs text-muted-foreground align-top">R$</span>
                      <span className="text-4xl font-semibold tracking-tight">{getPrice(plan)}</span>
                      <span className="text-muted-foreground text-xs ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 text-[12px]">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 px-6">
                    <div className="h-px bg-border/30 mb-5" />
                    <ul className="space-y-3">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-[13px]">
                          {f.included ? <Check className="h-4 w-4 shrink-0 text-foreground/50 mt-0.5" /> : <X className="h-4 w-4 text-muted-foreground/25 shrink-0 mt-0.5" />}
                          <span className={f.included ? "text-foreground/80" : "text-muted-foreground/40"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-2">
                    <Button
                      className={`w-full rounded-full h-10 text-[13px] font-medium ${plan.highlighted ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => { setSelectedPlan({ id: plan.id, name: plan.name, price: isAnnual ? plan.annualPrice : plan.monthlyPrice }); setOnboardingOpen(true); }}
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

      {/* ─── Testimonials ─── */}
      <section id="depoimentos" className="py-24 md:py-32 border-y border-border/20 bg-muted/10">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Depoimentos</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              O que dizem escolas de Sorocaba e região
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Mais de 500 instituições confiam no i ESCOLAS para sua gestão escolar.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                <Card className="border-border/30 hover:shadow-sm transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className="h-3.5 w-3.5 fill-warning text-warning" />
                      ))}
                    </div>
                    <blockquote className="text-[13px] leading-relaxed mb-5 text-foreground/80">"{t.quote}"</blockquote>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/60">{t.avatar}</div>
                      <div>
                        <p className="font-medium text-[13px]">{t.author}</p>
                        <p className="text-[11px] text-muted-foreground">{t.role} · {t.school}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Cities SEO Section ─── */}
      <section id="cidades" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <Globe className="h-3.5 w-3.5 inline mr-1" /> Cobertura Regional
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Gestão escolar em Sorocaba e região metropolitana
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Atendemos escolas de educação infantil, fundamental e médio em toda a região de Sorocaba com suporte local e treinamento presencial.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cidadesData.map((cidade) => (
              <Link key={cidade.slug} to={`/gestao-escolar/${cidade.slug}`}>
                <div className="flex items-center gap-2 p-3 rounded-lg border border-border/30 bg-card hover:bg-muted/30 hover:border-foreground/10 transition-all text-[13px] font-medium group">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <span className="truncate">{cidade.nome}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32 border-y border-border/20 bg-muted/10">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">FAQ</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Perguntas frequentes sobre gestão escolar em Sorocaba
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqData.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border/30 px-5 data-[state=open]:bg-muted/20">
                <AccordionTrigger className="text-left text-[13px] font-medium hover:no-underline py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-[13px] leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Button variant="outline" size="sm" className="gap-2 rounded-full text-[13px] px-5 h-10" onClick={() => openWhatsApp("Olá! Tenho uma dúvida sobre o i ESCOLAS para minha escola em Sorocaba.")}>
              <MessageSquare className="h-4 w-4" /> Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-foreground to-foreground/85 px-8 py-20 md:px-16 md:py-24 text-center max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.07]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,hsl(var(--background)/0.15),transparent_70%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-background/10 border border-background/20 backdrop-blur-sm text-background px-3.5 py-1.5 rounded-full text-[11px] font-medium mb-6">
                <Star className="h-3 w-3 fill-warning text-warning" />
                Avaliação 4.9/5 · 523 escolas
              </div>
              <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl tracking-[-0.02em] mb-4 text-background">
                Pronto para modernizar sua escola?
              </h2>
              <p className="mb-10 text-sm md:text-base text-background/70 leading-relaxed max-w-md mx-auto">
                Comece gratuitamente. Sem cartão de crédito. Configure em 5 minutos e transforme sua gestão escolar hoje.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login">
                  <Button size="lg" className="gap-2 bg-background px-10 text-sm font-medium text-foreground hover:bg-background/90 rounded-full h-12 shadow-xl">
                    Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="gap-2 border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background px-10 text-sm font-medium rounded-full h-12" onClick={() => openWhatsApp("Olá! Quero falar com um especialista do i ESCOLAS.")}>
                  <MessageSquare className="h-4 w-4" /> Falar com Especialista
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/20 py-14 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <PlatformLogo size="sm" />
              <p className="text-[13px] text-muted-foreground mt-3 max-w-xs leading-relaxed">
                Plataforma completa de gestão escolar para Sorocaba e região metropolitana. Tecnologia a serviço da educação.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">Funcionalidades</h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                {funcionalidadesData.slice(0, 6).map((f) => (
                  <li key={f.slug}><Link to={`/funcionalidades/${f.slug}`} className="hover:text-foreground transition-colors">{f.nome}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">Cidades Atendidas</h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                {cidadesData.slice(0, 7).map((c) => (
                  <li key={c.slug}><Link to={`/gestao-escolar/${c.slug}`} className="hover:text-foreground transition-colors">{c.nome}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">Empresa</h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                <li><Link to="/parceiros" className="hover:text-foreground transition-colors">Parceiros</Link></li>
                <li><Link to="/indicacao" className="hover:text-foreground transition-colors">Programa de Indicação</Link></li>
                <li><a href="https://www.instagram.com/iescolas.sp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="mailto:contato@iescolas.com.br" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS — Sistema de Gestão Escolar em Sorocaba e Região. Todos os direitos reservados. | Feito por Midia Ramos
            </p>
            <div className="flex gap-6 text-[12px] text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      {selectedPlan && (
        <SchoolOnboardingDialog open={onboardingOpen} onOpenChange={setOnboardingOpen} planId={selectedPlan.id} planName={selectedPlan.name} planPrice={selectedPlan.price} />
      )}
    </div>
  );
};

export default Index;
