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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent backdrop-blur-sm"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                            🎯
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Get Started Checklist</h3>
                            <p className="text-xs text-white/50">Complete these to unlock your full potential</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="p-1.5 text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-amber-400 font-bold">{completedCount}/{items.length} Complete</span>
                        <span className="text-white/40">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <motion.button
                            key={item.id}
                            onClick={item.action}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left",
                                item.isComplete
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                item.isComplete
                                    ? "bg-green-500 text-white"
                                    : "bg-white/10 text-white/40 group-hover:text-white"
                            )}>
                                {item.isComplete ? <Check size={14} /> : item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium truncate",
                                    item.isComplete ? "text-green-400 line-through" : "text-white"
                                )}>
                                    {item.title}
                                </p>
                                <p className="text-xs text-white/40 truncate">{item.description}</p>
                            </div>
                            {!item.isComplete && (
                                <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                            )}
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
