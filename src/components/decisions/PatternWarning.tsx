import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, History, ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PatternWarningProps {
    match: {
        decisionId: string;
        title: string;
        reason: string;
    } | null;
}

export function PatternWarning({ match }: PatternWarningProps) {
    if (!match) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 shadow-glow shadow-amber-500/5 group"
            >
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                        <History size={24} className="animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={14} strokeWidth={3} />
                                Déjà Vu Detected
                            </h4>
                            <Link
                                href={`/decisions/${match.decisionId}`}
                                target="_blank"
                                className="text-[10px] font-black text-amber-500/60 hover:text-amber-400 flex items-center gap-1 transition-colors uppercase tracking-widest"
                            >
                                View Past Failure <ExternalLink size={10} />
                            </Link>
                        </div>
                        <p className="text-sm text-gray-300 font-medium leading-relaxed">
                            This decision resembles <span className="text-white font-bold italic">"{match.title}"</span> which was previously marked as <span className="text-red-400 font-black">FAILED</span>.
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-[10px] font-black text-amber-500/40 uppercase tracking-[0.2em]">
                            <ArrowRight size={12} />
                            {match.reason}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
