import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrial, formatRemaining } from "@/hooks/useTrial";

interface TrialGuardProps {
  children: ReactNode;
}

/**
 * Permits access if:
 *  - User is admin (always)
 *  - User is authenticated as escola/aluno/responsavel (handled by ProtectedRoute upstream)
 *  - OR there is an active trial session by IP/fingerprint
 * Blocks (redirects to /teste-expirado) when trial is expired AND user is not authenticated as paying user.
 */
export function TrialGuard({ children }: TrialGuardProps) {
  const { user } = useAuth();
  const { status, msRemaining, refresh } = useTrial(true);
  const location = useLocation();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Authenticated admin always passes
  if (user?.role === "admin") return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "expired") {
    return <Navigate to="/teste-expirado" replace />;
  }

  if (status === "none") {
    return <Navigate to="/teste" replace />;
  }

  return (
    <>
      {status === "active" && (
        <div className="sticky top-0 z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-md">
          <div className="px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-foreground">
            {msRemaining < 6 * 3600 * 1000 ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <Clock className="h-4 w-4 text-primary" />
            )}
            <span className="font-semibold">Modo teste:</span>
            <span>{formatRemaining(msRemaining)}</span>
            <a href="/#planos" className="ml-2 underline font-semibold">
              Contratar plano
            </a>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
