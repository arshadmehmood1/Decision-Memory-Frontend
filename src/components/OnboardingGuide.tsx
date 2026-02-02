'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, Target, BarChart3, Rocket, ChevronRight, X, Briefcase, Loader2, Eye as EyeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { DEMO_DECISION } from '@/lib/demo-data';
import { useRouter } from 'next/navigation';

const steps = [
    {
        title: "Welcome to your Second Brain",
        description: "Decision Memory helps you track, analyze, and optimize your strategic choices using AI-driven insights.",
        icon: <BrainCircuit size={48} className="text-white" />,
        color: "bg-blue-600",
        id: 'welcome'
    },
    {
        title: "Set Your Prime Workspace",
        description: "Every great strategy needs a dedicated environment. Name your first sanctuary of logic.",
        icon: <Briefcase size={48} className="text-white" />,
        color: "bg-indigo-600",
        id: 'workspace'
    },
    {
        title: "Log Your First Trace",
        description: "Document the context, assumptions, and alternatives for any important decision. Transparency leads to better outcomes.",
        icon: <Target size={48} className="text-white" />,
        color: "bg-purple-600",
        id: 'trace'
    },
    {
        title: "AI-Driven Audits",
        description: "Our rule-based engine automatically scans your decisions for blindspots and assumption risks.",
        icon: <BarChart3 size={48} className="text-white" />,
        color: "bg-amber-600",
        id: 'audits'
    },
    {
        title: "Iterate and Improve",
        description: "Review outcomes months later to build a database of 'what works'. Stop making the same mistakes twice.",
        icon: <Rocket size={48} className="text-white" />,
        color: "bg-emerald-600",
        id: 'complete'
    }
];

export function OnboardingGuide() {
    const router = useRouter();
    const { currentUser, updateUser, currentWorkspaceId, updateWorkspace, addDecision, decisions } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [workspaceName, setWorkspaceName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingDemo, setLoadingDemo] = useState(false);

    useEffect(() => {
        // Trigger if user exists and hasn't onboarded
        if (currentUser && currentUser.hasOnboarded === false) {
            setIsVisible(true);
        }
    }, [currentUser]);

    const handleNext = async () => {
        const step = steps[currentStep];

        if (step.id === 'workspace') {
            if (!workspaceName.trim()) {
                toast.error("Initialization Failed", { description: "Please name your workspace to continue." });
                return;
            }

            if (currentWorkspaceId) {
                setIsSubmitting(true);
                try {
                    await updateWorkspace(currentWorkspaceId, workspaceName.trim());
                    toast.success("Workspace Established", { description: `"${workspaceName}" is now online.` });
                } catch (err) {
                    toast.error("Naming Sync Failed", { description: "We couldn't rename the workspace." });
                    setIsSubmitting(false);
                    return;
                }
                setIsSubmitting(false);
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        setIsVisible(false);
        try {
            await updateUser({ hasOnboarded: true });
        } catch (err) {
            console.error("Failed to update onboarding status", err);
        }
    };

    const handleViewDemoDecision = async () => {
        setLoadingDemo(true);
        try {
            // Check if demo already exists
            const existingDemo = decisions.find(d => d.title === DEMO_DECISION.title);
            let demoId: string;

            if (existingDemo) {
                demoId = existingDemo.id;
            } else {
                // Create the demo decision
                await addDecision(DEMO_DECISION as Parameters<typeof addDecision>[0]);
                // Get the newly created demo decision from the updated decisions
                const updatedDecisions = useStore.getState().decisions;
                const newDemo = updatedDecisions.find(d => d.title === DEMO_DECISION.title);
                demoId = newDemo?.id || 'demo';
                toast.success('Demo Decision Loaded', {
                    description: 'A complete example has been added to your dashboard.'
                });
            }

            // Complete onboarding and navigate
            await handleComplete();
            router.push(`/decision/${demoId}`);
        } catch (err) {
            console.error("Failed to load demo", err);
            toast.error('Failed to load demo decision');
        } finally {
            setLoadingDemo(false);
        }
    };

    if (!isVisible) return null;

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative max-w-lg w-full bg-[#0d1117] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 flex h-1.5 gap-1 p-0.5">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-full transition-all duration-500",
                                i <= currentStep ? "bg-primary shadow-glow" : "bg-white/5"
                            )}
                        />
                    ))}
                </div>

                <button
                    onClick={handleComplete}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-500 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-12 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className={cn(
                                "w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl",
                                currentStepData.color
                            )}>
                                {currentStepData.icon}
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                                    {currentStepData.title}
                                </h2>
                                <p className="text-[#8b949e] text-lg leading-relaxed px-4">
                                    {currentStepData.description}
                                </p>
                            </div>

                            {currentStepData.id === 'workspace' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-4 max-w-xs mx-auto"
                                >
                                    <Input
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        placeholder="e.g. Strategic Operations"
                                        className="h-14 bg-white/5 border-white/10 rounded-xl text-center text-lg font-bold text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary shadow-inner"
                                        autoFocus
                                    />
                                    <p className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Identifier</p>
                                </motion.div>
                            )}

                            {/* Demo Decision Option on Trace step */}
                            {currentStepData.id === 'trace' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-4"
                                >
                                    <button
                                        onClick={handleViewDemoDecision}
                                        disabled={loadingDemo}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all text-sm font-bold"
                                    >
                                        {loadingDemo ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <EyeIcon size={16} />
                                        )}
                                        View Example Decision
                                    </button>
                                    <p className="mt-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        See a complete example before creating your own
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 flex gap-4">
                        <Button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="flex-1 h-16 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-glow uppercase tracking-wider group relative overflow-hidden"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    {currentStep === steps.length - 1 ? "Initialize Experience" : "Next Protocol"}
                                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
