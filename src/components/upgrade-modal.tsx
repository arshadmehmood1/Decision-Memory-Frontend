'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Sparkles, Lock, Users } from 'lucide-react';
import { PLANS, PlanType } from '@/lib/plans';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type UpgradeReason = 'decision_limit' | 'team_invite' | 'ai_insights' | 'general';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason?: UpgradeReason;
    currentUsage?: number;
    limit?: number;
}

const MODAL_CONTENT: Record<UpgradeReason, { emoji: string; title: string; subtitle: string }> = {
    decision_limit: {
        emoji: '🎉',
        title: 'Amazing Work!',
        subtitle: "You've hit your decision limit. You're building serious decision intelligence.",
    },
    team_invite: {
        emoji: '👥',
        title: 'Team Collaboration',
        subtitle: 'Inviting team members requires the Team plan.',
    },
    ai_insights: {
        emoji: '🧠',
        title: 'Unlock AI Insights',
        subtitle: 'Get advanced pattern detection and blindspot analysis powered by AI.',
    },
    general: {
        emoji: '⚡',
        title: 'Upgrade Your Plan',
        subtitle: 'Unlock the full power of Decision Memory.',
    },
};

export function UpgradeModal({ isOpen, onClose, reason = 'general', currentUsage, limit }: UpgradeModalProps) {
    const { workspaces, currentWorkspaceId } = useStore();
    const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
    const currentPlan = (currentWorkspace?.planTier || 'FREE') as PlanType;
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');

    const content = MODAL_CONTENT[reason];

    const handleUpgrade = async (plan: PlanType) => {
        setIsLoading(plan);
        // Mock payment process for now
        setTimeout(() => {
            toast.success(`Successfully upgraded to ${plan} ${billingPeriod} plan!`, {
                description: "Review your new capabilities in Settings."
            });
            setIsLoading(null);
            onClose();
            // In a real app, we'd reload or update store here
            // window.location.reload(); 
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg bg-[#0F0F12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-6 text-center">
                        <div className="text-5xl mb-4">{content.emoji}</div>
                        <h2 className="text-2xl font-black text-white mb-2">{content.title}</h2>
                        <p className="text-white/60">{content.subtitle}</p>

                        {/* Usage indicator for decision limit */}
                        {reason === 'decision_limit' && currentUsage !== undefined && limit !== undefined && (
                            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-amber-400 font-bold">Decisions Used</span>
                                    <span className="text-sm text-white font-bold">{currentUsage}/{limit}</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Billing Toggle */}
                    <div className="px-8 flex justify-center mb-6">
                        <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/10">
                            {(['MONTHLY', 'ANNUAL'] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setBillingPeriod(period)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                        billingPeriod === period
                                            ? "bg-white text-black shadow-lg"
                                            : "text-white/40 hover:text-white/80"
                                    )}
                                >
                                    {period === 'ANNUAL' ? 'Yearly (-20%)' : 'Monthly'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plan Card */}
                    <div className="px-8 pb-4">
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Pro Plan</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-white">
                                            {billingPeriod === 'ANNUAL' ? '$24' : '$29'}
                                        </span>
                                        <span className="text-white/40">/month</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                    <Zap className="text-black" size={24} />
                                </div>
                            </div>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-green-400" />
                                    <span>Unlimited decisions</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-green-400" />
                                    <span>Full AI insights & blindspot analysis</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-green-400" />
                                    <span>Automated outcome reminders</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-green-400" />
                                    <span>Export your data anytime</span>
                                </li>
                            </ul>
                            <Button
                                onClick={() => handleUpgrade('PRO')}
                                disabled={isLoading === 'PRO'}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:shadow-glow transition-all"
                            >
                                {isLoading === 'PRO' ? 'Processing...' : 'Upgrade to Pro — $29/month'}
                            </Button>
                        </div>
                    </div>

                    {/* Team option link */}
                    {reason !== 'team_invite' && (
                        <div className="px-8 pb-4">
                            <button
                                onClick={() => handleUpgrade('TEAM')}
                                disabled={isLoading === 'TEAM'}
                                className="w-full text-center text-sm text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Users size={14} />
                                Or upgrade to Team for collaboration →
                            </button>
                        </div>
                    )}

                    {/* Team card for team invite reason */}
                    {reason === 'team_invite' && (
                        <div className="px-8 pb-4">
                            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Team Plan</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-white">
                                                {billingPeriod === 'ANNUAL' ? '$79' : '$99'}
                                            </span>
                                            <span className="text-white/40">/month</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                        <Users className="text-white" size={24} />
                                    </div>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                        <Check size={16} className="text-purple-400" />
                                        <span>Everything in Pro</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                        <Check size={16} className="text-purple-400" />
                                        <span>Up to 5 team members</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                        <Check size={16} className="text-purple-400" />
                                        <span>Shared decision history</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                        <Check size={16} className="text-purple-400" />
                                        <span>Role-based permissions</span>
                                    </li>
                                </ul>
                                <Button
                                    onClick={() => handleUpgrade('TEAM')}
                                    disabled={isLoading === 'TEAM'}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold hover:shadow-glow transition-all"
                                >
                                    {isLoading === 'TEAM' ? 'Processing...' : 'Upgrade to Team — $99/month'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Dismiss option */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={onClose}
                            className="w-full text-center text-sm text-white/30 hover:text-white/60 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
