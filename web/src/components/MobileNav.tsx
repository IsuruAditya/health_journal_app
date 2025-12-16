import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, User } from 'lucide-react';

const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Records', path: '/records' },
    { icon: Plus, label: 'New', path: '/records/new', primary: true },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ icon: Icon, label, path, primary }) => {
          const active = isActive(path);
          
          if (primary) {
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-medium text-primary mt-1">{label}</span>
              </Link>
            );
          }

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
