import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCMSAuth } from '@/contexts/CMSAuthContext';
import { CMSSidebar } from './CMSSidebar';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CMSLayoutProps {
  children: ReactNode;
}

export function CMSLayout({ children }: CMSLayoutProps) {
  const { user, isLoading, logout } = useCMSAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin or editor role
  if (!user.role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            Your account has not been assigned an admin or editor role. Please contact an administrator for access.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Current account: {user.email}
          </p>
          <Button onClick={logout} variant="outline">
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <CMSSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}