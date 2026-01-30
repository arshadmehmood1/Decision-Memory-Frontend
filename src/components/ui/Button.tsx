import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-white hover:bg-primary-hover shadow-glow shadow-primary/20 active:scale-95',
            secondary: 'bg-white/10 text-white hover:bg-white/20 active:scale-95 border border-white/10',
            danger: 'bg-danger text-white hover:bg-red-600 shadow-glow shadow-red-500/20 active:scale-95',
            outline: 'border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-white/20 shadow-premium active:scale-95',
            ghost: 'hover:bg-white/5 text-gray-400 hover:text-white active:scale-95',
            link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs',
            md: 'h-11 px-6 py-2',
            lg: 'h-14 px-10 text-lg',
            icon: 'h-11 w-11',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    'inline-flex items-center justify-center rounded-2xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
