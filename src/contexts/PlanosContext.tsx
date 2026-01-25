import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Sparkles, Zap, Star, Crown, LucideIcon } from "lucide-react";

export interface PlanoRecursos {
  alunos: string;
  professores: string;
  turmas: string;
  armazenamento: string;
  suporte: string;
  relatorios: boolean;
  boletins: boolean;
  frequencia: boolean;
  comunicados: boolean;
  financeiro: boolean;
  api: boolean;
  branding: boolean;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoAluno: number;
  cor: string;
  icon: LucideIcon;
  escolas: number;
  limiteAlunos: number | null;
  popular?: boolean;
  recursos: PlanoRecursos;
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Zap,
  Star,
  Crown,
};

const planosIniciais: Plano[] = [
  {
    id: "free",
    nome: "Free",
    descricao: "Perfeito para começar",
    preco: 0,
    precoAluno: 0,
    cor: "gray",
    icon: Sparkles,
    escolas: 25,
    limiteAlunos: 50,
    recursos: {
      alunos: "Até 50",
      professores: "Até 5",
      turmas: "Até 3",
      armazenamento: "500 MB",
      suporte: "E-mail",
      relatorios: false,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: false,
      api: false,
      branding: false,
    },
  },
  {
    id: "start",
    nome: "Start",
    descricao: "Para escolas em crescimento",
    preco: 199,
    precoAluno: 3,
    cor: "blue",
    icon: Zap,
    escolas: 35,
    limiteAlunos: 200,
    recursos: {
      alunos: "Até 200",
      professores: "Até 20",
      turmas: "Até 10",
      armazenamento: "5 GB",
      suporte: "E-mail + Chat",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: false,
      branding: false,
    },
  },
  {
    id: "pro",
    nome: "Pro",
    descricao: "Para quem busca excelência",
    preco: 399,
    precoAluno: 2,
    cor: "purple",
    icon: Star,
    escolas: 42,
    limiteAlunos: 500,
    popular: true,
    recursos: {
      alunos: "Até 500",
      professores: "Ilimitado",
      turmas: "Ilimitado",
      armazenamento: "25 GB",
      suporte: "Prioritário 24/7",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: true,
      branding: false,
    },
  },
  {
    id: "premium",
    nome: "Premium",
    descricao: "Para redes de escolas",
    preco: 699,
    precoAluno: 1.5,
    cor: "rose",
    icon: Crown,
    escolas: 25,
    limiteAlunos: null,
    recursos: {
      alunos: "Ilimitado",
      professores: "Ilimitado",
      turmas: "Ilimitado",
      armazenamento: "Ilimitado",
      suporte: "Gerente Dedicado",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: true,
      branding: true,
    },
  },
];

interface PlanosContextType {
  planos: Plano[];
  updatePlano: (updatedPlano: Plano) => void;
  getPlanoById: (id: string) => Plano | undefined;
}

const PlanosContext = createContext<PlanosContextType | undefined>(undefined);

const STORAGE_KEY = "iescolas_planos";

interface StoredPlano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoAluno: number;
  cor: string;
  iconName: string;
  escolas: number;
  limiteAlunos: number | null;
  popular?: boolean;
  recursos: PlanoRecursos;
}

const serializePlanos = (planos: Plano[]): StoredPlano[] => {
  return planos.map((plano) => ({
    ...plano,
    iconName: plano.icon.displayName || "Sparkles",
  }));
};

const deserializePlanos = (stored: StoredPlano[]): Plano[] => {
  return stored.map((plano) => ({
    ...plano,
    icon: iconMap[plano.iconName] || Sparkles,
  }));
};

export function PlanosProvider({ children }: { children: ReactNode }) {
  const [planos, setPlanos] = useState<Plano[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredPlano[];
        return deserializePlanos(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar planos do localStorage:", error);
    }
    return planosIniciais;
  });

  useEffect(() => {
    try {
      const serialized = serializePlanos(planos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error("Erro ao salvar planos no localStorage:", error);
    }
  }, [planos]);

  const updatePlano = (updatedPlano: Plano) => {
    setPlanos((prev) =>
      prev.map((p) => (p.id === updatedPlano.id ? updatedPlano : p))
    );
  };

  const getPlanoById = (id: string) => {
    return planos.find((p) => p.id === id);
  };

  return (
    <PlanosContext.Provider value={{ planos, updatePlano, getPlanoById }}>
      {children}
    </PlanosContext.Provider>
  );
}

export function usePlanos() {
  const context = useContext(PlanosContext);
  if (context === undefined) {
    throw new Error("usePlanos deve ser usado dentro de um PlanosProvider");
  }
  return context;
}
