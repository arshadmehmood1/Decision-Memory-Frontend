
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, Target, BarChart3, Rocket, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    {
        title: "Welcome to your Second Brain",
        description: "Decision Memory helps you track, analyze, and optimize your strategic choices using AI-driven insights.",
        icon: <BrainCircuit size={48} className="text-white" />,
        color: "bg-blue-600"
    },
    {
        title: "Log Your First Trace",
        description: "Document the context, assumptions, and alternatives for any important decision. Transparency leads to better outcomes.",
        icon: <Target size={48} className="text-white" />,
        color: "bg-purple-600"
    },
    {
        title: "AI-Driven Audits",
        description: "Our rule-based engine automatically scans your decisions for blindspots and assumption risks.",
        icon: <BarChart3 size={48} className="text-white" />,
        color: "bg-amber-600"
    },
    {
        title: "Iterate and Improve",
        description: "Review outcomes months later to build a database of 'what works'. Stop making the same mistakes twice.",
        icon: <Rocket size={48} className="text-white" />,
        color: "bg-emerald-600"
    }
];

export function OnboardingGuide() {
    const { currentUser, updateUser } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger if user exists and hasn't onboarded
        if (currentUser && currentUser.hasOnboarded === false) {
            setIsVisible(true);
        }
    }, [currentUser]);

    const handleNext = () => {
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

    if (!isVisible) return null;

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
                                steps[currentStep].color
                            )}>
                                {steps[currentStep].icon}
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                                    {steps[currentStep].title}
                                </h2>
                                <p className="text-[#8b949e] text-lg leading-relaxed px-4">
                                    {steps[currentStep].description}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 flex gap-4">
                        <Button
                            onClick={handleNext}
                            className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-glow uppercase tracking-wider group"
                        >
                            {currentStep === steps.length - 1 ? "Initialize Experience" : "Next Protocol"}
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
