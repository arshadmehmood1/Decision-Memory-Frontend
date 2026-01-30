import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, helperText, id: providedId, ...props }, ref) => {
        const generatedId = React.useId();
        const id = providedId || generatedId;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        id={id}
                        type={type}
                        className={cn(
                            'flex h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-2 text-base font-bold text-white transition-all',
                            'placeholder:text-gray-500 placeholder:font-bold',
                            'focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary',
                            'hover:border-white/20',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/2',
                            error && 'border-red-500 focus:ring-red-400',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error ? (
                    <p className="text-[10px] font-bold text-red-500 pl-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="text-[10px] font-medium text-gray-400 pl-1">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
