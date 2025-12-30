import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  LogOut,
  ChevronLeft,
  Menu,
  ExternalLink
} from 'lucide-react';
import { useCMSAuth } from '@/contexts/CMSAuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { Users, UserCog } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Posts', icon: FileText, path: '/admin/posts' },
  { label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
  { label: 'Writers', icon: Users, path: '/admin/writers' },
  { label: 'Users', icon: UserCog, path: '/admin/users' },
];

export function CMSSidebar() {
  const location = useLocation();
  const { logout, user } = useCMSAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-primary font-bold text-xl">Paraflow</span>
            <span className="text-muted-foreground text-sm">CMS</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* View Blog Link */}
        <div className="mt-4 px-2">
          <Link
            to="/blog"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">View Blog</span>}
          </Link>
        </div>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-border p-4">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed ? "w-full justify-center" : "w-full justify-start gap-3"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </aside>
  );
}
