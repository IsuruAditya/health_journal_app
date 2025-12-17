import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide FAB on new record page
  if (location.pathname.includes('/new') || location.pathname.includes('/edit')) {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/dashboard/records/new')}
      className={cn(
        "md:hidden",
        "fixed bottom-20 right-5",
        "h-14 w-14 rounded-full",
        "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
        "text-white",
        "shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "z-40",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/30"
      )}
      aria-label="Add new health record"
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
};

export default FloatingActionButton;
