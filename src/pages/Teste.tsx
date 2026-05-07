import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTrial, formatRemaining } from "@/hooks/useTrial";

export default function Teste() {
  const navigate = useNavigate();
  const { status, msRemaining, startTrial, refresh } = useTrial(true);

  useEffect(() => {
    if (status === "expired") navigate("/teste-expirado", { replace: true });
  }, [status, navigate]);

  const handleStart = async () => {
    await startTrial();
    await refresh();
    navigate("/escola/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-xl w-full border-border/50 shadow-xl">
        <CardContent className="p-10 space-y-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Teste Grátis por 72 horas</h1>
            <p className="text-foreground/75">
              Explore todas as funcionalidades do iESCOLAS sem compromisso. Sem cartão de crédito.
            </p>
          </div>

          {status === "active" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-foreground font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                {formatRemaining(msRemaining)}
              </div>
              <Button size="lg" className="w-full" onClick={() => navigate("/escola/dashboard")}>
                Continuar testando
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={handleStart}>
                Começar meu teste de 72h
              </Button>
              <p className="text-xs text-foreground/60">
                O acesso é vinculado ao seu IP e dispositivo. Após 72h o acesso é bloqueado e será necessário escolher um plano.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
