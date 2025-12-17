import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User } from 'lucide-react';

const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Records', path: '/dashboard/records' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all active:scale-95 ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-[10px] font-medium mt-1 ${active ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
