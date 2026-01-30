import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        'flex min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-bold text-white ring-offset-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:ring-offset-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                        error && 'border-red-500 focus-visible:ring-red-400/20 focus-visible:border-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error ? (
                    <p className="text-[10px] font-bold text-red-500 pl-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="text-[10px] font-medium text-gray-400 pl-2 mt-1">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
