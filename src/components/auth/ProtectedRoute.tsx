import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, getRoleRedirectPath } = useAuth();
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

  if (!isAuthenticated || !user) {
    // Redirect to login, saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Regra do portal: Painel ADM Master é exclusivo do papel "admin".
  // Se uma rota /admin estiver sendo acessada por outro papel (externo/escola/etc),
  // forçamos redirect para o painel apropriado do papel.
  const isAdminArea = location.pathname.startsWith('/admin');
  if (isAdminArea && user.role !== 'admin') {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User is authenticated but doesn't have permission
    // Redirect to their appropriate dashboard
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  return <>{children}</>;
}
