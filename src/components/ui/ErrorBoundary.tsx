'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-[#0d1117]/80 backdrop-blur-2xl border border-red-500/20 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl mx-auto flex items-center justify-center text-red-500 shadow-inner">
                                <AlertTriangle size={40} />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Neural Shield Active</h2>
                                <p className="text-gray-400 font-bold text-lg leading-relaxed">
                                    A cognitive error was detected in the trace buffer. The system has safely isolated the component.
                                </p>
                                {this.state.error && (
                                    <pre className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-[10px] text-red-400/60 font-mono text-left overflow-auto max-h-32 no-scrollbar">
                                        {this.state.error.message}
                                    </pre>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wider gap-2 shadow-glow"
                                >
                                    <RefreshCcw size={18} />
                                    Re-initialize Component
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="h-14 rounded-2xl text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs gap-2"
                                >
                                    <Home size={16} />
                                    Return to Nexus
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
