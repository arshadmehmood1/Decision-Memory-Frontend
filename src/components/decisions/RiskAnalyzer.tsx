import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Thermometer, Brain, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface RiskAnalyzerProps {
    text: string;           // Combined text from decision and context
    alternativesCount: number;
    assumptionsCount: number;
    onScoreChange?: (score: number) => void;
}

const DANGER_WORDS = [
    'maybe', 'perhaps', 'guess', 'hope', 'probably', 'likely', 'assume', 'think',
    'might', 'could', 'try', 'hopefully', 'believe', 'feeling', 'pretty sure'
];

export function RiskAnalyzer({ text, alternativesCount, assumptionsCount, onScoreChange }: RiskAnalyzerProps) {
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string[]>([]);

    useEffect(() => {
        let newScore = 0;
        const lowerText = text.toLowerCase();
        const foundMatches: string[] = [];

        // 1. Text Analysis (Cognitive Uncertainty)
        DANGER_WORDS.forEach(word => {
            if (lowerText.includes(word)) {
                newScore += 10;
                if (!foundMatches.includes(word)) foundMatches.push(word);
            }
        });

        // 2. Structural Analysis (Bias Blind Spots)
        const feedbackItems: string[] = [];

        if (text.length < 50) {
            newScore += 20;
            feedbackItems.push("Description is too brief. Elaborate to uncover hidden risks.");
        }

        if (alternativesCount < 2) {
            newScore += 30;
            feedbackItems.push("Tunnel Vision detected. Consider at least 2 alternatives.");
        }

        if (assumptionsCount === 0) {
            newScore += 25;
            feedbackItems.push("Zero assumptions logged. This implies certainty, which is risky.");
        }

        // Cap at 100
        newScore = Math.min(100, newScore);

        setScore(newScore);
        setMatches(foundMatches);
        setFeedback(feedbackItems);

        if (onScoreChange) onScoreChange(newScore);

    }, [text, alternativesCount, assumptionsCount]);

    const getRiskLevel = (s: number) => {
        if (s < 20) return { label: 'LOW RISK', color: 'text-green-500', bg: 'bg-green-500' };
        if (s < 50) return { label: 'MODERATE', color: 'text-yellow-500', bg: 'bg-yellow-500' };
        if (s < 80) return { label: 'HIGH RISK', color: 'text-orange-500', bg: 'bg-orange-500' };
        return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500' };
    };

    const risk = getRiskLevel(score);

    return (
        <div className="rounded-[2.5rem] bg-black/20 border border-white/5 p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000", risk.bg)} />

            <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10", risk.bg + '/10')}>
                            <Brain size={24} className={risk.color} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Pre-Mortem Analysis</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">AI Bias Detection</p>
                        </div>
                    </div>
                    <Badge className={cn("text-xs font-black px-4 py-1.5 border-none shadow-glow", risk.bg, "text-white")}>
                        {risk.label}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                        <span>Risk Score</span>
                        <span className={risk.color}>{score}%</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, type: "spring" }}
                            className={cn("h-full rounded-full transition-colors duration-500 shadow-glow", risk.bg)}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {(matches.length > 0 || feedback.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-4 border-t border-white/5"
                        >
                            {matches.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hedge Words Detected</p>
                                    <div className="flex flex-wrap gap-2">
                                        {matches.map(word => (
                                            <span key={word} className="px-3 py-1 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg text-xs font-medium">
                                                "{word}"
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {feedback.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Structural Weakness</p>
                                    {feedback.map((msg, i) => (
                                        <div key={i} className="flex gap-3 text-sm text-gray-300">
                                            <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                                            {msg}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {score < 20 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300">
                        <ShieldCheck size={20} />
                        <p className="text-xs font-bold">Robust decision structure detected.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
