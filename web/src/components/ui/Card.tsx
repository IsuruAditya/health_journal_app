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
        'rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 text-card-foreground p-6 shadow-sm transition-all duration-300 ease-out',
        hover && 'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01] cursor-pointer',
        glass && 'bg-card/60 backdrop-blur-2xl border-border/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;