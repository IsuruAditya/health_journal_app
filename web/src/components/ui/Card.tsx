import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ className, children, hover = false, glass = false, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/50 text-card-foreground p-6 shadow-sm transition-all duration-300',
        hover && 'hover:shadow-lg hover:border-blue-200/60 dark:hover:border-blue-800/60 hover:-translate-y-1 cursor-pointer',
        glass && 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/40 dark:border-slate-700/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;