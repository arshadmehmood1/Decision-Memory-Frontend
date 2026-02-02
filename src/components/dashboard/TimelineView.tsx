import React, { useMemo } from 'react';
import { useStore, Decision } from '@/lib/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Check, Target, Link as LinkIcon, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TimelineViewProps {
    className?: string;
}

export function TimelineView({ className }: TimelineViewProps) {
    const { decisions, currentWorkspaceId } = useStore();

    // Filter and sort decisions by date
    const sortedDecisions = useMemo(() => {
        return decisions
            .filter(d => d.workspaceId === currentWorkspaceId)
            .sort((a, b) => new Date(b.madeOn).getTime() - new Date(a.madeOn).getTime());
    }, [decisions, currentWorkspaceId]);

    const getStatusIcon = (status: Decision['status']) => {
        switch (status) {
            case 'SUCCEEDED': return <Check size={14} className="text-green-400" />;
            case 'FAILED': return <AlertTriangle size={14} className="text-red-400" />;
            case 'REVERSED': return <AlertCircle size={14} className="text-orange-400" />;
            case 'DRAFT': return <Target size={14} className="text-gray-400" />;
            default: return <Target size={14} className="text-blue-400" />;
        }
    };

    const getStatusColor = (status: Decision['status']) => {
        switch (status) {
            case 'SUCCEEDED': return 'border-green-500/20 bg-green-500/5 hover:border-green-500/40';
            case 'FAILED': return 'border-red-500/20 bg-red-500/5 hover:border-red-500/40';
            case 'REVERSED': return 'border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40';
            case 'DRAFT': return 'border-gray-500/20 bg-gray-500/5 hover:border-gray-500/40';
            default: return 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40';
        }
    };

    if (sortedDecisions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 rounded-[2rem] border border-dashed border-white/10 bg-white/5 mx-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Target className="text-gray-600" size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">No Timeline Yet</h3>
                    <p className="text-sm text-gray-500">Record your first decision to start the timeline.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative pl-8 pr-4 py-8 space-y-8", className)}>
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0" />

            {/* Group decisions by month */}
            {Object.entries(
                sortedDecisions.reduce((groups, decision) => {
                    const month = format(new Date(decision.madeOn), 'MMMM yyyy');
                    if (!groups[month]) groups[month] = [];
                    groups[month].push(decision);
                    return groups;
                }, {} as Record<string, typeof sortedDecisions>)
            ).map(([month, monthDecisions], groupIdx) => (
                <div key={month} className="relative">
                    {/* Month Header */}
                    <div className="flex items-center gap-4 mb-6 mt-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 -ml-[5.5px]" />
                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest bg-[#0d1117] px-2">
                            {month}
                        </h3>
                    </div>

                    <div className="space-y-8 pl-4 border-l border-white/5 ml-[0.5px]">
                        {monthDecisions.map((decision, idx) => {
                            const prevDecision = monthDecisions[idx + 1];
                            const daysSince = prevDecision
                                ? differenceInDays(new Date(decision.madeOn), new Date(prevDecision.madeOn))
                                : 0;

                            return (
                                <motion.div
                                    key={decision.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative"
                                >
                                    {/* Dot */}
                                    <div className={cn(
                                        "absolute left-[-21px] top-6 w-3 h-3 rounded-full border-2 bg-[#0d1117] z-10",
                                        decision.status === 'SUCCEEDED' ? "border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.4)]" :
                                            decision.status === 'FAILED' ? "border-red-400" :
                                                decision.status === 'ACTIVE' ? "border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.4)]" :
                                                    "border-gray-600"
                                    )} />

                                    {daysSince > 7 && (
                                        <div className="absolute left-[-45px] -top-6 text-[10px] font-black text-gray-600 rotate-90 origin-right whitespace-nowrap">
                                            {daysSince} days later
                                        </div>
                                    )}

                                    <Link href={`/decision/${decision.id}`}>
                                        <div className={cn(
                                            "group relative overflow-hidden rounded-2xl border p-5 transition-all",
                                            getStatusColor(decision.status)
                                        )}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                            {format(new Date(decision.madeOn), 'MMM d, yyyy')}
                                                        </span>
                                                        {decision.links && decision.links.length > 0 && (
                                                            <Badge variant="outline" className="border-white/10 text-xs gap-1 h-5 bg-white/5 text-gray-400">
                                                                <LinkIcon size={10} /> {decision.links.length}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                                                        {decision.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2 max-w-xl">
                                                        {decision.decision}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(decision.status)}
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-wider",
                                                            decision.status === 'SUCCEEDED' ? "text-green-400" :
                                                                decision.status === 'FAILED' ? "text-red-400" :
                                                                    decision.status === 'ACTIVE' ? "text-blue-400" :
                                                                        "text-gray-500"
                                                        )}>
                                                            {decision.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
