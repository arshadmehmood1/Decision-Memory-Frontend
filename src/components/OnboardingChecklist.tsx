'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Target, ChevronRight, X, ListChecks, Sparkles, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    isComplete: boolean;
    action: () => void;
    icon: React.ReactNode;
}

export function OnboardingChecklist() {
    const router = useRouter();
    const { decisions, currentUser } = useStore();
    const [isDismissed, setIsDismissed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Check if user has dismissed checklist (persisted in localStorage)
    useEffect(() => {
        const dismissed = localStorage.getItem('onboarding_checklist_dismissed');
        if (dismissed === 'true') {
            setIsDismissed(true);
        }
    }, []);

    const items: ChecklistItem[] = useMemo(() => {
        const hasDecision = decisions.length > 0;
        const hasAssumptions = decisions.some(d => {
            // Handle both array and JSON string formats
            if (!d.assumptions) return false;
            if (Array.isArray(d.assumptions)) return d.assumptions.length > 0;
            try {
                const parsed = JSON.parse(d.assumptions as string);
                return Array.isArray(parsed) && parsed.length > 0;
            } catch {
                return false;
            }
        });
        const hasThreeDecisions = decisions.length >= 3;
        const hasUpdatedOutcome = decisions.some(d =>
            d.status === 'SUCCEEDED' || d.status === 'FAILED' || d.status === 'REVERSED'
        );

        return [
            {
                id: 'first_decision',
                title: 'Log your first decision',
                description: 'Start building your decision memory',
                isComplete: hasDecision,
                action: () => router.push('/decision/new'),
                icon: <Target size={16} />,
            },
            {
                id: 'add_assumptions',
                title: 'Add assumptions to a decision',
                description: 'Track what you believe to be true',
                isComplete: hasAssumptions,
                action: () => hasDecision ? router.push(`/decision/${decisions[0]?.id}`) : router.push('/decision/new'),
                icon: <ListChecks size={16} />,
            },
            {
                id: 'three_decisions',
                title: 'Log 3 decisions this week',
                description: 'Build your decision habit',
                isComplete: hasThreeDecisions,
                action: () => router.push('/decision/new'),
                icon: <Sparkles size={16} />,
            },
            {
                id: 'update_outcome',
                title: 'Update outcome on 1 decision',
                description: 'Learn from your results',
                isComplete: hasUpdatedOutcome,
                action: () => hasDecision ? router.push(`/decision/${decisions[0]?.id}`) : router.push('/decision/new'),
                icon: <TrendingUp size={16} />,
            },
        ];
    }, [decisions, router]);

    const completedCount = items.filter(i => i.isComplete).length;
    const progress = (completedCount / items.length) * 100;
    const allComplete = completedCount === items.length;

    // Auto-dismiss after all complete
    useEffect(() => {
        if (allComplete && !isDismissed) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, 5000); // Auto-dismiss after 5 seconds when complete
            return () => clearTimeout(timer);
        }
    }, [allComplete, isDismissed]);

    const handleDismiss = () => {
        localStorage.setItem('onboarding_checklist_dismissed', 'true');
        setIsDismissed(true);
        setShowConfirm(false);
    };

    // Don't show if dismissed or no user
    if (isDismissed || !currentUser) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm shadow-soft"
        >
            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">Onboarding Checklist</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Complete these to achieve institutional memory</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="p-2 text-gray-600 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{completedCount}/{items.length} Tasks Fixed</span>
                        <span className="text-[10px] font-black text-gray-500 tracking-widest">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-primary shadow-glow rounded-full"
                        />
                    </div>
                </div>

                {/* Checklist items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item, index) => (
                        <motion.button
                            key={item.id}
                            onClick={item.action}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl transition-all group text-left border relative overflow-hidden",
                                item.isComplete
                                    ? "bg-green-500/5 border-green-500/10 opacity-60"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all",
                                item.isComplete
                                    ? "bg-green-500 text-black"
                                    : "bg-white/5 text-gray-500 group-hover:bg-primary/20 group-hover:text-primary"
                            )}>
                                {item.isComplete ? <Check size={14} strokeWidth={3} /> : item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-xs font-black uppercase tracking-tight",
                                    item.isComplete ? "text-green-500/80" : "text-white group-hover:text-primary transition-colors"
                                )}>
                                    {item.title}
                                </p>
                                <p className="text-[10px] font-bold text-gray-500 truncate mt-0.5">{item.description}</p>
                            </div>
                            {!item.isComplete && (
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-primary transition-colors shrink-0" />
                            )}
                            {item.isComplete && <div className="absolute top-0 right-0 w-8 h-8 bg-green-500/10 rounded-bl-2xl flex items-start justify-end p-1.5"><Check size={8} className="text-green-500" /></div>}
                        </motion.button>
                    ))}
                </div>

                {/* All complete celebration */}
                {allComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
                    >
                        <p className="text-green-400 font-bold text-sm">🎉 Amazing! You've completed onboarding!</p>
                        <p className="text-xs text-white/50 mt-1">This checklist will auto-dismiss in a moment.</p>
                    </motion.div>
                )}
            </div>

            {/* Dismiss confirmation popup */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 rounded-2xl"
                    >
                        <div className="text-center space-y-4">
                            <p className="text-white font-medium">Dismiss this checklist?</p>
                            <p className="text-white/50 text-sm">You won't see it again.</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                                >
                                    Keep it
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
