'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { calculateAnalytics } from '@/lib/analytics-utils';
import {
    TrendingUp,
    TrendingDown,
    Zap,
    Target,
    BarChart3,
    PieChart as PieChartIcon,
    ArrowUpRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { cn } from '@/lib/utils';

export function SummaryDashboard() {
    const { decisions } = useStore();
    const stats = React.useMemo(() => calculateAnalytics(decisions), [decisions]);

    if (decisions.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Success Gauge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-1 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={120} />
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Zap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Performance</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-6xl font-black tracking-tighter text-white">
                            {stats.successRate}%
                        </h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aggregate Success Rate</p>
                    </div>

                    <div className="pt-6">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.successRate}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 shadow-glow shadow-indigo-500/20"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Velocity & Scale Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col md:flex-row gap-8"
            >
                <div className="flex-1 space-y-6">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Monthly Velocity</p>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-white">{stats.velocity}</span>
                                <span className="text-xs font-bold text-emerald-400 pb-2 flex items-center gap-1">
                                    <TrendingUp size={14} /> +12%
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Trace Count</p>
                            <span className="text-4xl font-black text-white">{stats.totalDecisions}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-[2] h-[180px] w-full mt-4 md:mt-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.categoryBreakdown.slice(0, 5)}>
                            <XAxis
                                dataKey="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                content={({ active, payload }: any) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-[#0d1117] border border-white/10 p-3 rounded-xl shadow-2xl">
                                                <p className="text-[10px] font-black text-gray-500 uppercase mb-1">{payload[0].payload.category}</p>
                                                <p className="text-sm font-black text-white">{payload[0].value}% Success Rate</p>
                                                <p className="text-[10px] font-bold text-indigo-400">{payload[0].payload.total} Decisions</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                                {stats.categoryBreakdown.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.rate > 70 ? '#10b981' : entry.rate > 40 ? '#6366f1' : '#f43f5e'}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}
