import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, MessageSquare, EyeOff } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DecisionCardProps {
    decision: {
        id: string;
        title: string;
        category: string;
        status: string;
        madeOn: string | Date;
        madeBy: string;
        privacy?: 'This Workspace' | 'Public Community' | 'Anonymous Public';
        tags?: string[];
        decision?: string;
        comments?: any[];
    };
}

export function DecisionCard({ decision }: DecisionCardProps) {
    const isAnonymous = decision.privacy === 'Anonymous Public';
    const isCritical = (decision as any).aiRiskScore >= 80 || (decision as any).riskLevel === 'CRITICAL';

    const statusVariants: Record<string, any> = {
        ACTIVE: 'warning',
        SUCCEEDED: 'success',
        FAILED: 'danger',
        REVERSED: 'danger',
        DRAFT: 'secondary',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
        >
            {/* Neural Glow Overlay for Critical Risks */}
            {isCritical && (
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-[2rem] blur-xl z-0"
                />
            )}

            <Link href={`/decision/${decision.id}`}>
                <div className={cn(
                    "group relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                    isCritical
                        ? "bg-black/60 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.1)] backdrop-blur-2xl"
                        : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06] backdrop-blur-md"
                )}>
                    {/* Interior Neural Flux Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center flex-wrap gap-3">
                            <Badge variant="info" className="h-7 px-3 text-[10px] font-black tracking-widest uppercase bg-blue-500/10 border-blue-500/20 text-blue-400">
                                {decision.category}
                            </Badge>
                            <Badge variant={statusVariants[decision.status] || 'default'} className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-opacity-10 border-opacity-20 shadow-inner">
                                {decision.status}
                            </Badge>
                            {isCritical && (
                                <Badge className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-glow animate-pulse">
                                    Neural High
                                </Badge>
                            )}
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                {formatDate(decision.madeOn)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight tracking-tight">
                                {decision.title}
                            </h4>
                            {(decision as any).neuralInsight && (
                                <p className="text-xs font-bold text-red-400/80 italic line-clamp-1 max-w-2xl bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10">
                                    {(decision as any).neuralInsight}
                                </p>
                            )}
                            {decision.decision && (
                                <p className="text-sm text-gray-400 font-medium line-clamp-1 max-w-4xl opacity-80 group-hover:opacity-100 transition-opacity">
                                    {decision.decision}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 self-end md:self-center pl-6 md:pl-0 md:border-l md:border-white/10 md:h-16">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center text-xs text-white font-black shadow-2xl transition-transform group-hover:scale-110",
                                isCritical ? "bg-red-500/20 border border-red-500/30" : "bg-white/5 border border-white/10"
                            )} title={isAnonymous ? 'Anonymous' : decision.madeBy}>
                                {isAnonymous ? <EyeOff size={18} className="text-gray-500" /> : decision.madeBy.charAt(0)}
                            </div>
                            <div className="hidden lg:block">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logged By</span>
                                <span className="text-xs font-bold text-white whitespace-nowrap">{isAnonymous ? 'Anonymous' : decision.madeBy}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 group/msg">
                            <MessageSquare size={20} className="text-gray-500 group-hover/msg:text-primary transition-colors" />
                            <span className="text-[10px] font-black text-gray-600">{decision.comments?.length || 0}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <ChevronRight size={20} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
