import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { calculateStreak } from '@/lib/streak-utils';

export function StreakTracker() {
    const { decisions } = useStore();
    const { currentStreak, longestStreak, activity } = React.useMemo(() => calculateStreak(decisions), [decisions]);

    // Calculate next milestone
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    const nextMilestone = milestones.find(m => m > currentStreak) || currentStreak + 30;

    // Get last 7 days labels (e.g., M, T, W, T, F, S, S)
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString('en-US', { weekday: 'narrow' }));
    }

    if (decisions.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-4 sm:p-5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-[10px]">
                        <Flame size={14} className={currentStreak > 0 ? "fill-orange-400 animate-pulse" : ""} />
                        <span>Daily Streak</span>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        {currentStreak} <span className="text-lg text-white/40 font-bold">days</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Next Milestone</div>
                    <div className="text-lg font-bold text-white/60">{nextMilestone} days 🏆</div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-1 sm:gap-2">
                {activity.map((isActive, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div
                            className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all border",
                                isActive
                                    ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                    : "bg-white/5 text-gray-600 border-white/5"
                            )}
                        >
                            {isActive ? <Check size={14} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                        </div>
                        <span className={cn("text-[9px] font-bold uppercase", isActive ? "text-orange-400" : "text-gray-600")}>
                            {days[i]}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
