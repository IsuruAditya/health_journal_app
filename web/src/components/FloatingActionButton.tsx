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
      onClick={() => navigate('/records/new')}
      className={cn(
        "md:hidden",
        "fixed bottom-20 right-4",
        "h-14 w-14 rounded-full",
        "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))]/95",
        "text-[hsl(var(--primary-foreground))]",
        "shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "z-40",
        "focus:outline-none focus:ring-4 focus:ring-[hsl(var(--primary))]/30"
      )}
      aria-label="Add new health record"
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
};

export default FloatingActionButton;
