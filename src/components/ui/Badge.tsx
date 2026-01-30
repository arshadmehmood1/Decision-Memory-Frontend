import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'secondary' | 'info';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'bg-primary text-white border-transparent shadow-sm',
        secondary: 'bg-gray-100 text-gray-900 border-transparent',
        success: 'bg-success/10 text-success border-success/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        danger: 'bg-danger/10 text-danger border-danger/20',
        outline: 'text-gray-400 border-white/10 bg-white/5 backdrop-blur-sm',
        info: 'bg-primary/10 text-primary border-primary/20',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
