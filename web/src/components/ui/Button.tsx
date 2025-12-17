import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] relative overflow-hidden whitespace-nowrap';
  
  const variants = {
    primary: 'bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] hover:from-[hsl(var(--primary))]/90 hover:to-[hsl(var(--primary))]/80 shadow-sm hover:shadow-md hover:scale-[1.02] focus-visible:ring-[hsl(var(--primary))] font-medium border border-[hsl(var(--primary))]/20',
    secondary: 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] border border-[hsl(var(--border))] shadow-sm hover:shadow focus-visible:ring-[hsl(var(--primary))]',
    outline: 'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent))] hover:border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus-visible:ring-[hsl(var(--primary))]',
    ghost: 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus-visible:ring-[hsl(var(--primary))]',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm gap-2 min-w-[80px]',
    md: 'h-10 px-4 text-sm gap-2 min-w-[100px]',
    lg: 'h-11 px-6 text-base gap-2.5 min-w-[120px]',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && children}
    </button>
  );
};

export default Button;