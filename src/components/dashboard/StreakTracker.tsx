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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 p-4 sm:p-5 group hover:bg-white/10 transition-all shadow-soft"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-gray-500 font-black uppercase tracking-widest text-[9px]">
                        <Flame size={12} className={currentStreak > 0 ? "text-orange-400 fill-orange-400" : ""} />
                        <span>Daily Streak</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {currentStreak} <span className="text-sm text-gray-400 font-bold uppercase tracking-widest ml-1">Days</span>
                    </div>
                </div>
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 text-gray-400 group-hover:text-amber-400 transition-colors">
                    <div className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Target</div>
                    <div className="text-xs font-black">{nextMilestone}</div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-1">
                {activity.map((isActive, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div
                            className={cn(
                                "w-full aspect-square max-w-[40px] rounded-lg flex items-center justify-center transition-all border",
                                isActive
                                    ? "bg-amber-400 text-black border-amber-300 shadow-glow"
                                    : "bg-black/20 text-gray-700 border-white/5"
                            )}
                        >
                            {isActive ? <Check size={14} strokeWidth={4} /> : <div className="w-1 h-1 rounded-full bg-white/5" />}
                        </div>
                        <span className={cn("text-[9px] font-black uppercase tracking-tighter", isActive ? "text-amber-400" : "text-gray-500")}>
                            {days[i]}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
