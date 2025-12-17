import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import Button from '@/components/ui/Button';
import { Heart, User, LogOut, LayoutDashboard, FileText } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import MobileNav from '@/components/MobileNav';
import InstallPWA from '@/components/InstallPWA';
import FloatingActionButton from '@/components/FloatingActionButton';


const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    authApi.logout();
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-lg shadow-sm border-b border-border sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 bg-primary rounded-lg group-hover:scale-105 transition-all duration-200 shadow-sm">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-foreground">Salubro</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/dashboard/records"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard/records') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Records</span>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <InstallPWA />
              <ThemeToggle />
              
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-muted rounded-lg">
                <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-xs text-foreground font-medium truncate max-w-[120px]">{user?.email}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Banner */}
      <MedicalDisclaimer variant="banner" />
      
      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <Outlet />
        
        {/* Footer Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MedicalDisclaimer variant="footer" />
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      

    </div>
  );
};

export default AppLayout;