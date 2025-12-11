import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import Button from '@/components/ui/Button';
import { Heart, User, LogOut, Plus } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Health Journal</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/records"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Records
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                className="shadow-sm"
                onClick={() => navigate('/records/new')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Record</span>
              </Button>
              
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;