'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, PieChart, TrendingUp, BrainCircuit, ShieldAlert } from 'lucide-react';
import { MonthlyReportData } from '@/lib/report-utils';
import { cn } from '@/lib/utils';

interface MonthlyReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: MonthlyReportData;
}

export function MonthlyReportModal({ isOpen, onClose, data }: MonthlyReportModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                                    <BarChart3 className="text-primary" />
                                    {data.monthName} {data.year} Report
                                </h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Decision Intelligence Summary</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Score Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Logs', value: data.totalDecisions, icon: BrainCircuit, color: 'text-blue-400' },
                                    { label: 'Avg Risk', value: `${data.averageRiskScore}%`, icon: ShieldAlert, color: 'text-amber-400' },
                                    { label: 'Top Focus', value: data.topCategory, icon: PieChart, color: 'text-purple-400' },
                                    { label: 'Momentum', value: '+12%', icon: TrendingUp, color: 'text-green-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 bg-white/2 rounded-2xl border border-white/5 flex flex-col gap-2">
                                        <stat.icon size={16} className={stat.color} />
                                        <div className="text-xl font-black text-white">{stat.value}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Category Breakdown */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest pl-1">Category Intensity</h3>
                                <div className="space-y-3">
                                    {Object.entries(data.categoryBreakdown).map(([cat, count]) => {
                                        const percentage = Math.round((count / data.totalDecisions) * 100);
                                        return (
                                            <div key={cat} className="space-y-1">
                                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest px-1">
                                                    <span className="text-gray-400">{cat}</span>
                                                    <span className="text-primary">{count} trace{count > 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className="h-full bg-primary shadow-glow shadow-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Neural Insight */}
                            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex gap-5 items-start">
                                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-glow shadow-primary/10">
                                    <BrainCircuit size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">Neural Narrative</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed italic">
                                        "In {data.monthName}, your focus was heavily leveraged towards <span className="text-white font-bold">{data.topCategory}</span>.
                                        The average risk score of <span className="text-white font-bold">{data.averageRiskScore}%</span> suggests a {data.averageRiskScore > 50 ? 'bold' : 'conservative'}
                                        strategic stance. Recommendation: Increase documentation for rejected alternatives to reduce hindsight bias."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/2 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-glow shadow-primary/20 hover:scale-105 transition-all"
                            >
                                Close Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
