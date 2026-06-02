import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, loadError, retryLoadUser, logout, session, getRoleRedirectPath } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Sessão existe mas falhou ao carregar perfil/role: mostra erro claro
  if (session && loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-2xl p-8 text-center space-y-5">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Não foi possível carregar seu painel</h2>
            <p className="text-sm text-muted-foreground">{loadError}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={retryLoadUser} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
            <Button variant="ghost" onClick={logout} className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Sair e fazer login novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdminArea = location.pathname.startsWith('/admin');
  if (isAdminArea && user.role !== 'admin') {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  return <>{children}</>;
}
