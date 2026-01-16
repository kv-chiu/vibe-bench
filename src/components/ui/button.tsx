import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props },
    ref
  ) => {
    const variants = {
      primary:
        'bg-gradient-to-r from-secondary to-primary text-white shadow-glow-orange hover:shadow-glow-orange-intense hover:scale-[1.02]',
      secondary:
        'bg-surface border border-border text-white hover:border-primary/50 hover:bg-white/5',
      outline:
        'bg-transparent border-2 border-white/20 text-white hover:border-white hover:bg-white/10',
      ghost: 'bg-transparent text-muted hover:text-white hover:bg-white/5',
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs tracking-wider',
      md: 'h-11 px-6 text-sm tracking-wider',
      lg: 'h-14 px-8 text-base tracking-widest font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-heading inline-flex items-center justify-center rounded-full uppercase transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
