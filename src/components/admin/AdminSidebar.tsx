
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Experience', path: '/admin/experience' },
    { name: 'Skills', path: '/admin/skills' },
    { name: 'Files', path: '/admin/files' },
  ];
  
  return (
    <div className="bg-card border-r border-border min-h-screen w-64 p-4 flex flex-col">
      <div className="mb-8">
        <Link to="/" className="font-mono text-xl font-bold">
          <span className="text-primary">John</span>
          <span className="text-white">.Connor()</span>
        </Link>
        <div className="text-sm text-muted-foreground mt-1">Admin Panel</div>
      </div>
      
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-2 rounded-md transition-colors",
              isActive(item.path) 
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-border mt-6">
        <div className="mb-4 px-4">
          <Link to="/" className="text-primary text-sm hover:underline">
            View Website
          </Link>
        </div>
        <Button 
          variant="ghost" 
          onClick={logout} 
          className="w-full justify-start"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
