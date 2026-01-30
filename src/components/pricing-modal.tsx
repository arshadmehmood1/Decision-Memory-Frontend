import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Users, Shield } from 'lucide-react';
import { PLANS, PlanType } from '@/lib/plans';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api-client';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const { workspaces, currentWorkspaceId } = useStore();
    const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
    const currentPlan = (currentWorkspace?.planTier || 'FREE') as PlanType;
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleUpgrade = async (plan: PlanType) => {
        setIsLoading(plan);
        try {
            const res = await apiRequest<{ url: string }>('/billing/checkout', {
                method: 'POST',
                body: JSON.stringify({ plan })
            });

            // In dev, the backend might return a mock success URL or direct upgrade
            if (res.url.includes('?upgraded=true')) {
                window.location.reload(); // Refresh to get new plan state
            } else {
                window.location.href = res.url;
            }
        } catch (err) {
            toast.error('Failed to start checkout');
            setIsLoading(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-5xl bg-[#0F0F12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>

                    {/* Left: Value Prop */}
                    <div className="md:w-1/3 p-8 md:p-12 bg-white/5 border-r border-white/5 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-glow">
                                <Zap className="text-black" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Upgrade your<br />Decision Memory</h2>
                            <p className="text-white/60 leading-relaxed">
                                Unlock the full power of neural analysis, unlimited history, and team collaboration.
                            </p>
                        </div>
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center gap-4 text-white/80">
                                <Shield className="text-amber-400" size={20} />
                                <span>Enterprise-grade security</span>
                            </div>
                            <div className="flex items-center gap-4 text-white/80">
                                <Users className="text-amber-400" size={20} />
                                <span>Team collaboration tools</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Plans */}
                    <div className="md:w-2/3 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0F0F12]">
                        {/* PRO Plan */}
                        <div className={`relative p-6 rounded-2xl border ${currentPlan === 'PRO' ? 'border-amber-400/50 bg-amber-400/5' : 'border-white/10 bg-white/5'}`}>
                            {currentPlan === 'PRO' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-black text-xs font-bold rounded-full">
                                    CURRENT PLAN
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white">Pro</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-black text-white">$29</span>
                                    <span className="text-white/40">/mo</span>
                                </div>
                                <p className="text-sm text-white/40 mt-2">For power users</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-amber-400" />
                                    <span>Unlimited Decisions</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-amber-400" />
                                    <span>Blindspot Analysis</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-amber-400" />
                                    <span>Up to {PLANS.PRO.MEMBERS} Members</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handleUpgrade('PRO')}
                                disabled={currentPlan === 'PRO' || isLoading === 'PRO'}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${currentPlan === 'PRO'
                                        ? 'bg-white/10 text-white/40 cursor-default'
                                        : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                            >
                                {isLoading === 'PRO' ? 'Processing...' : currentPlan === 'PRO' ? 'Active' : 'Upgrade to Pro'}
                            </button>
                        </div>

                        {/* TEAM Plan */}
                        <div className={`relative p-6 rounded-2xl border ${currentPlan === 'TEAM' ? 'border-amber-400/50 bg-amber-400/5' : 'border-white/10 bg-white/5'}`}>
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white">Team</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-black text-white">$99</span>
                                    <span className="text-white/40">/mo</span>
                                </div>
                                <p className="text-sm text-white/40 mt-2">For growing orgs</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-amber-400" />
                                    <span>Everything in Pro</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-amber-400" />
                                    <span>Unlimited Members</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/80">
                                    <Check size={16} className="text-amber-400" />
                                    <span>Dedicated Support</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handleUpgrade('TEAM')}
                                disabled={currentPlan === 'TEAM' || isLoading === 'TEAM'}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${currentPlan === 'TEAM'
                                        ? 'bg-white/10 text-white/40 cursor-default'
                                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:shadow-glow'
                                    }`}
                            >
                                {isLoading === 'TEAM' ? 'Processing...' : currentPlan === 'TEAM' ? 'Active' : 'Upgrade to Team'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
