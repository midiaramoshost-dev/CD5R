import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TesteExpirado() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-xl w-full border-border/50 shadow-xl">
        <CardContent className="p-10 space-y-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Seu teste de 72h expirou</h1>
            <p className="text-foreground/75">
              O período gratuito chegou ao fim. Para continuar usando o iESCOLAS, escolha um plano e libere
              o acesso completo da sua escola.
            </p>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={() => navigate("/#planos")}>
              Ver planos e contratar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/")}>
              Voltar para a página inicial
            </Button>
          </div>

          <p className="text-xs text-foreground/60">
            O bloqueio é vinculado ao seu IP e dispositivo. Limpar o navegador não estende o período de teste.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
