import { Lock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PLANS, FeatureType, PlanType } from '@/lib/plans';
import { useState } from 'react';
import { PricingModal } from './pricing-modal';

interface FeatureLockProps {
    feature: FeatureType;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showLockIcon?: boolean;
}

export function FeatureLock({ feature, children, fallback, showLockIcon = true }: FeatureLockProps) {
    const { workspaces, currentWorkspaceId } = useStore();
    const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
    const currentPlan = (currentWorkspace?.planTier || 'FREE') as PlanType;
    const [showPricing, setShowPricing] = useState(false);

    const limit = PLANS[currentPlan][feature];
    const isLocked = limit === false // Boolean feature disabled
        || (typeof limit === 'number' && limit !== -1 && false); // TODO: Check actual usage count if needed (requires passing usage)

    // Simpler check for now: boolean flags or strict checks
    // For boolean features (AI_INSIGHTS):
    let locked = false;

    if (feature === 'AI_INSIGHTS') {
        locked = !PLANS[currentPlan].AI_INSIGHTS;
    }

    if (!locked) return <>{children}</>;

    if (fallback) return <div onClick={() => setShowPricing(true)}>{fallback}<PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} /></div>;

    return (
        <div className="relative group cursor-pointer" onClick={() => setShowPricing(true)}>
            <div className="opacity-50 pointer-events-none grayscale">
                {children}
            </div>
            {showLockIcon && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/80 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                        <Lock className="text-amber-400" size={16} />
                    </div>
                </div>
            )}
            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </div>
    );
}
