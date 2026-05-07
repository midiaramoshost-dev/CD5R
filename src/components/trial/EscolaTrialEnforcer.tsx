import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatRemaining } from "@/hooks/useTrial";

interface Props {
  children: ReactNode;
}

/**
 * Enforces 72h trial for authenticated "escola" users using escolas.trial_expires_at.
 * - status === 'trial' AND now < trial_expires_at  => allow with banner
 * - status === 'trial' AND now >= trial_expires_at => redirect to /teste-expirado
 * - status === 'ativo' (paid)                       => allow without banner
 */
export function EscolaTrialEnforcer({ children }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [escola, setEscola] = useState<{ status: string; trial_expires_at: string | null } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    if (user?.role !== "escola") {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("escolas")
        .select("status, trial_expires_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (alive) {
        setEscola(data as any);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  if (user?.role !== "escola") return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No record found — let through (won't break legacy)
  if (!escola) return <>{children}</>;

  const isTrial = escola.status === "trial";
  if (!isTrial) return <>{children}</>;

  const expiresAt = escola.trial_expires_at ? new Date(escola.trial_expires_at) : null;
  const ms = expiresAt ? expiresAt.getTime() - Date.now() : 0;
  void tick;

  if (!expiresAt || ms <= 0) {
    return <Navigate to="/teste-expirado" replace />;
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-md">
        <div className="px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-foreground">
          {ms < 6 * 3600 * 1000 ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <Clock className="h-4 w-4 text-primary" />
          )}
          <span className="font-semibold">Período de teste:</span>
          <span>{formatRemaining(ms)}</span>
          <a href="/#planos" className="ml-2 underline font-semibold">
            Contratar plano
          </a>
        </div>
      </div>
      {children}
    </>
  );
}
