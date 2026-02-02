'use client';

import { useState, useMemo } from 'react';
import { DecisionCard } from '@/components/decisions/DecisionCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Plus,
    Filter,
    ArrowUpDown,
    Search,
    X,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicExperience } from '@/components/dashboard/DynamicExperience';
import { SummaryDashboard } from '@/components/dashboard/SummaryDashboard';
import { RegretNudge } from '@/components/dashboard/RegretNudge';
import { DEMO_DECISION } from '@/lib/demo-data';
import { toast } from 'sonner';
import { TimelineView } from '@/components/dashboard/TimelineView';
import { LayoutList, StretchHorizontal, BarChart3 } from 'lucide-react';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import { MonthlyReportModal } from '@/components/dashboard/MonthlyReportModal';
import { calculateStreak } from '@/lib/streak-utils';
import { generateMonthlyReport } from '@/lib/report-utils';

const CATEGORIES = ['ALL', 'TECH', 'HIRING', 'MARKETING', 'SALES', 'STRATEGIC'];

export default function DashboardClient() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedOwner, setSelectedOwner] = useState('ALL');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [isTimelineView, setIsTimelineView] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const { decisions, currentUser, addDecision, featureFlags } = useStore();

    const streak = useMemo(() => calculateStreak(decisions), [decisions]);

    const monthlyReport = useMemo(() => {
        const now = new Date();
        return generateMonthlyReport(decisions, now.getMonth(), now.getFullYear());
    }, [decisions]);

    // Stats calculation moved to Insights

    const filteredDecisions = useMemo(() => {
        return decisions.filter((decision) => {
            const matchesSearch = decision.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || decision.category === selectedCategory;
            const matchesStatus = selectedStatus === 'ALL' || decision.status === selectedStatus;

            const isMe = decision.madeBy === currentUser?.name || decision.madeBy === 'Unknown'; // Defaulting Unknown to Me for solo demo feel
            const matchesOwner = selectedOwner === 'ALL' ||
                (selectedOwner === 'ME' && isMe) ||
                (selectedOwner === 'OTHERS' && !isMe);

            return matchesSearch && matchesCategory && matchesStatus && matchesOwner;
        });
    }, [search, selectedCategory, selectedStatus, selectedOwner, decisions, currentUser]);

    const stats = useMemo(() => {
        const total = decisions.length;
        const active = decisions.filter(d => d.status === 'ACTIVE').length;
        const succeeded = decisions.filter(d => d.status === 'SUCCEEDED').length;
        const rate = total > 0 ? Math.round((succeeded / total) * 100) : 0;

        return [
            { label: 'Total Logs', value: total, icon: Clock, color: 'text-blue-400' },
            { label: 'Active Choices', value: active, icon: Sparkles, color: 'text-purple-400' },
            { label: 'Success Rate', value: `${rate}%`, icon: TrendingUp, color: 'text-green-400' },
        ];
    }, [decisions]);

    const handleLoadDemo = async () => {
        try {
            await addDecision(DEMO_DECISION as any);
            toast.success('Demo decision loaded!', {
                description: 'Explore the details to see a perfect decision record.'
            });
        } catch (error) {
            toast.error('Failed to load demo data');
        }
    };

    return (
        <div className="space-y-12 pb-24 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="py-2 sm:py-4">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase italic">Home</h2>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[9px] mt-1">Operational Workspace / Trace Mode</p>
                </div>
                <div className="flex items-center gap-6">
                    {featureFlags.decision_streaks && <StreakBadge streak={streak} />}
                    <Link href="/decision/new" className="w-full sm:w-auto">
                        <Button className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl px-8 shadow-premium shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-lg gap-3">
                            <Plus size={18} strokeWidth={3} />
                            New Decision
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="p-4 sm:p-5 border border-white/5 bg-white/5 flex items-center justify-between group rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all">
                            <div className="space-y-0.5">
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">{stat.value}</div>
                            </div>
                            <div className={cn("p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5", stat.color)}>
                                <stat.icon size={18} className="sm:size-5" />
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Monthly Report Action */}
                {featureFlags.monthly_report && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            onClick={() => setIsReportOpen(true)}
                            className="w-full h-full p-4 sm:p-5 border border-primary/20 bg-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-between group hover:bg-primary/10 transition-all text-left"
                        >
                            <div className="space-y-0.5">
                                <div className="text-[9px] font-black text-primary uppercase tracking-widest">Decision Analytics</div>
                                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">Monthly Report</div>
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary text-white shadow-glow">
                                <BarChart3 size={18} className="sm:size-5" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </div>

            {featureFlags.regret_nudge && <RegretNudge />}

            {/* Admin Approved Dynamic Experience */}
            {featureFlags.dynamic_experience && <DynamicExperience />}

            {/* Premium Analytics Dashboard */}
            {featureFlags.success_dashboard && <SummaryDashboard />}

            {/* Onboarding Checklist */}
            <AnimatePresence>
                {showOnboarding && decisions.length < 5 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                    >
                        <Card className="bg-blue-600 border-none p-6 md:p-10 relative overflow-hidden group shadow-glow">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                                <div className="space-y-4 lg:space-y-6 max-w-xl">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-inner">
                                            <Sparkles size={24} className="sm:size-7" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Level Up Your Brain</h3>
                                    </div>
                                    <p className="text-blue-50 font-bold text-base sm:text-lg leading-relaxed">To unlock advanced AI Trend Analysis, log at least 5 strategic decisions.</p>
                                    <div className="flex items-center gap-4 sm:gap-6 pt-1">
                                        <div className="flex-1 h-2 sm:h-3 bg-black/20 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-white transition-all duration-1000 shadow-glow"
                                                style={{ width: `${(decisions.length / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] sm:text-xs font-black text-white uppercase tracking-widest">{decisions.length}/5 COMPLETE</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/decision/new" className="w-full sm:w-auto">
                                        <Button className="w-full bg-white text-primary border-none hover:bg-blue-50 rounded-xl sm:rounded-2xl h-12 sm:h-16 px-6 sm:px-8 text-sm sm:text-lg font-black shadow-xl">Record Choice</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowOnboarding(false)}
                                        className="sm:rounded-2xl rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 h-12 w-12 sm:h-16 sm:w-16"
                                    >
                                        <X size={20} className="sm:size-7" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search and Filters Section */}
            <div className="space-y-8">
                <div className="flex flex-col xl:flex-row items-center gap-4">
                    <div className="relative w-full xl:max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search decisions..."
                            className="w-full pl-12 pr-12 h-12 sm:h-16 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 shadow-soft focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-base sm:text-lg text-white placeholder:text-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-4 xl:pb-0 w-full no-scrollbar px-1 sm:px-0">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 sm:px-8 h-10 sm:h-16 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap",
                                    selectedCategory === cat
                                        ? "bg-primary text-white border-primary shadow-glow"
                                        : "bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className={cn("gap-2 rounded-xl h-10 px-4 font-black uppercase tracking-widest text-[10px]", isFilterVisible ? "bg-white/10 text-white shadow-sm" : "text-gray-400")}
                        >
                            <Filter size={14} strokeWidth={3} />
                            Advanced Filters
                        </Button>
                        <div className="w-px h-4 bg-white/10" />
                        <Button variant="ghost" size="sm" className="gap-2 rounded-xl h-10 px-4 font-black uppercase tracking-widest text-[10px] text-gray-400">
                            <ArrowUpDown size={14} strokeWidth={3} />
                            Sorted by Newest First
                        </Button>
                        <div className="w-px h-4 bg-white/10" />
                        {featureFlags.timeline_view && (
                            <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                                <button
                                    onClick={() => setIsTimelineView(false)}
                                    className={cn("p-1.5 rounded-md transition-all", !isTimelineView ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300")}
                                >
                                    <LayoutList size={16} />
                                </button>
                                <button
                                    onClick={() => setIsTimelineView(true)}
                                    className={cn("p-1.5 rounded-md transition-all", isTimelineView ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300")}
                                >
                                    <StretchHorizontal size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 md:block hidden">
                        Showing <span className="text-white font-black">{filteredDecisions.length}</span> results found
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                    {isFilterVisible && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} />
                                        Date Range
                                    </label>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="w-full rounded-xl bg-white text-[10px] font-black uppercase tracking-widest h-12 shadow-sm">LATEST 30 DAYS</Button>
                                        <Button variant="outline" size="sm" className="w-full rounded-xl bg-white text-[10px] font-black uppercase tracking-widest h-12 shadow-sm border-primary text-primary">ALL TIME</Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 size={12} />
                                        Outcome Status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['ALL', 'ACTIVE', 'SUCCEEDED', 'FAILED', 'REVERSED'].map(status => (
                                            <Badge
                                                key={status}
                                                variant="outline"
                                                onClick={() => setSelectedStatus(status)}
                                                className={cn(
                                                    "cursor-pointer transition-all text-[9px] font-black px-4 py-2 rounded-xl h-10 uppercase tracking-widest",
                                                    selectedStatus === status
                                                        ? "bg-primary text-white border-primary shadow-glow"
                                                        : "bg-white/50 hover:bg-white hover:border-primary"
                                                )}
                                            >
                                                {status}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Search size={12} />
                                        Owner
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedOwner}
                                            onChange={(e) => setSelectedOwner(e.target.value)}
                                            className="w-full h-12 rounded-xl border border-gray-200 bg-white text-[10px] font-black uppercase tracking-widest px-4 outline-none appearance-none cursor-pointer focus:border-primary transition-colors"
                                        >
                                            <option value="ALL">All Members</option>
                                            <option value="ME">Created by Me</option>
                                            <option value="OTHERS">Team Members</option>
                                        </select>
                                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Filter Tags (Persistent logic) */}
                {(search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedOwner !== 'ALL') && (
                    <div className="flex items-center gap-3 animate-in slide-in-from-top-1 duration-300">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Filters:</span>
                        <div className="flex flex-wrap gap-2">
                            {search && (
                                <Badge className="gap-2 bg-blue-50 text-primary border-blue-100 h-8 font-bold">
                                    Search: "{search}"
                                    <X size={12} onClick={() => setSearch('')} className="cursor-pointer" />
                                </Badge>
                            )}
                            {selectedCategory !== 'ALL' && (
                                <Badge className="gap-2 bg-blue-50 text-primary border-blue-100 h-8 font-bold">
                                    Category: {selectedCategory}
                                    <X size={12} onClick={() => setSelectedCategory('ALL')} className="cursor-pointer" />
                                </Badge>
                            )}
                            {selectedStatus !== 'ALL' && (
                                <Badge className="gap-2 bg-blue-50 text-primary border-blue-100 h-8 font-bold">
                                    Status: {selectedStatus}
                                    <X size={12} onClick={() => setSelectedStatus('ALL')} className="cursor-pointer" />
                                </Badge>
                            )}
                            {selectedOwner !== 'ALL' && (
                                <Badge className="gap-2 bg-blue-50 text-primary border-blue-100 h-8 font-bold">
                                    Owner: {selectedOwner === 'ME' ? 'Me' : 'Team'}
                                    <X size={12} onClick={() => setSelectedOwner('ALL')} className="cursor-pointer" />
                                </Badge>
                            )}
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCategory('ALL');
                                    setSelectedStatus('ALL');
                                    setSelectedOwner('ALL');
                                }}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Decisions List Section */}
            {isTimelineView ? (
                <TimelineView />
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {filteredDecisions.length > 0 ? (
                            filteredDecisions.map((decision, idx) => (
                                <motion.div
                                    key={decision.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <DecisionCard decision={decision} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                                <div className="w-24 h-24 bg-black rounded-[2rem] shadow-premium flex items-center justify-center text-gray-700 mb-8 border border-white/10 scale-110 group-hover:rotate-12 transition-transform">
                                    <Search size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Zero Choices Found</h3>
                                <p className="text-gray-400 max-w-xs text-center font-bold mb-8">Try adjusting your filters or <br />start a fresh decision log.</p>

                                <div className="flex gap-4">
                                    {(search || selectedCategory !== 'ALL') ? (
                                        <Button
                                            variant="outline"
                                            className="rounded-2xl h-14 px-8 text-lg hover:bg-white"
                                            onClick={() => { setSearch(''); setSelectedCategory('ALL'); }}
                                        >
                                            Reset Filters
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={handleLoadDemo}
                                            className="rounded-2xl h-14 px-8 text-sm font-black uppercase tracking-widest hover:bg-white/10 border-white/20"
                                        >
                                            Load Demo Example
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {filteredDecisions.length > 8 && (
                        <div className="flex justify-center pt-10">
                            <Button variant="outline" className="rounded-2xl h-14 px-10 text-lg bg-white shadow-soft transition-all hover:shadow-premium group">
                                Explore Archive History
                                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
            {/* Modal Components */}
            <MonthlyReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                data={monthlyReport}
            />
        </div>
    );
}
