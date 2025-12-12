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
        'rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all duration-200',
        hover && 'hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer',
        glass && 'bg-card/80 backdrop-blur-xl border-border/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;