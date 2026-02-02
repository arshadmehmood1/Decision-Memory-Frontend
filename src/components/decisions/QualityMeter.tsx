'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface QualityMeterProps {
    fields: {
        title: string;
        decision: string;
        context: string;
        alternatives: any[];
        assumptions: any[];
        successCriteria: any[];
    };
}

export function QualityMeter({ fields }: QualityMeterProps) {
    const calculateScore = () => {
        let score = 0;
        const checks = [];

        if (fields.title?.length > 5 && fields.decision?.length > 10) {
            score += 20;
            checks.push({ label: 'Core Choice', passed: true });
        } else {
            checks.push({ label: 'Core Choice', passed: false });
        }

        if (fields.context?.length > 20) {
            score += 20;
            checks.push({ label: 'Context', passed: true });
        } else {
            checks.push({ label: 'Context', passed: false });
        }

        if (fields.alternatives?.length > 0 && fields.alternatives[0].name) {
            score += 20;
            checks.push({ label: 'Alternatives', passed: true });
        } else {
            checks.push({ label: 'Alternatives', passed: false });
        }

        if (fields.assumptions?.length > 0 && fields.assumptions[0].value) {
            score += 20;
            checks.push({ label: 'Assumptions', passed: true });
        } else {
            checks.push({ label: 'Assumptions', passed: false });
        }

        if (fields.successCriteria?.length > 0 && fields.successCriteria[0].value) {
            score += 20;
            checks.push({ label: 'Success Metrics', passed: true });
        } else {
            checks.push({ label: 'Success Metrics', passed: false });
        }

        return { score, checks };
    };

    const { score, checks } = calculateScore();

    const getGrade = (s: number) => {
        if (s >= 100) return { label: 'A+', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
        if (s >= 80) return { label: 'A', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
        if (s >= 60) return { label: 'B', color: 'text-blue-400', bg: 'bg-blue-500/10' };
        if (s >= 40) return { label: 'C', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
        return { label: 'D', color: 'text-red-400', bg: 'bg-red-500/10' };
    };

    const grade = getGrade(score);

    return (
        <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Trace Strength</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        Completion Quality
                    </p>
                </div>
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black border-2",
                    grade.bg,
                    grade.color,
                    grade.color.replace('text', 'border')
                )}>
                    {grade.label}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn("h-full rounded-full bg-gradient-to-r",
                        score < 60 ? "from-red-500 to-orange-500" :
                            score < 80 ? "from-blue-500 to-purple-500" :
                                "from-emerald-500 to-cyan-500"
                    )}
                />
            </div>

            {/* Checks */}
            <div className="space-y-3">
                {checks.map((check, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                        <span className={cn(
                            "font-bold uppercase tracking-widest transition-colors",
                            check.passed ? "text-gray-300" : "text-gray-600"
                        )}>
                            {check.label}
                        </span>
                        {check.passed ? (
                            <CheckCircle size={14} className="text-emerald-500" />
                        ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-white/10" />
                        )}
                    </div>
                ))}
            </div>

            {score < 100 && (
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-300 font-medium flex gap-3 leading-relaxed">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    Complete all sections to unlock maximum AI analysis precision.
                </div>
            )}
        </div>
    );
}
