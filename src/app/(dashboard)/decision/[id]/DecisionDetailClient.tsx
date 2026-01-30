'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import {
    Calendar,
    User,
    ArrowLeft,
    Edit3,
    CheckCircle2,
    XCircle,
    RotateCcw,
    AlertCircle,
    Clock,
    Zap,
    Brain,
    Shield,
    Target,
    ArrowRight,
    TrendingUp,
    MessageSquare,
    ChevronRight,
    Sparkles,
    EyeOff,
    Flag,
    MessageCircle,
    Send,
    BrainCircuit,
    Download,
    ShieldCheck
} from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Decision } from '@/lib/store';
import { toast } from 'sonner';

const statusVariants: Record<string, any> = {
    ACTIVE: 'warning',
    SUCCEEDED: 'success',
    FAILED: 'danger',
    REVERSED: 'danger',
    DRAFT: 'secondary',
};

export default function DecisionDetailClient() {
    const params = useParams();
    const router = useRouter();
    const { decisions, updateDecisionStatus, currentUser, addComment, analyzeBlindspots, checkAssumption, fetchComments } = useStore();
    const [showOutcomeFlow, setShowOutcomeFlow] = useState(false);
    const [activeTab, setActiveTab] = useState<'trace' | 'reviews'>('trace');
    const [newComment, setNewComment] = useState('');
    const [isAnonymousReview, setIsAnonymousReview] = useState(false);

    React.useEffect(() => {
        if (params.id) {
            fetchComments(params.id as string);
        }
    }, [params.id, fetchComments]);

    const [blindspots, setBlindspots] = useState<{ id: string; type: string; title: string; desc: string; severity: string }[]>([
        { id: '1', type: 'BIAS', title: 'Start Audit', desc: 'Click Refresh Audit to analyze this decision for cognitive biases.', severity: 'LOW' }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [assumptionChecks, setAssumptionChecks] = useState<Record<string, { score: number; issues: string[] }>>({});

    const decision = useMemo(() => {
        return decisions.find(d => d.id === params.id);
    }, [decisions, params.id]);

    if (!decision) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-gray-700 mb-8 border border-white/10 shadow-premium">
                    <AlertCircle size={48} />
                </div>
                <h2 className="text-3xl font-black text-white">Trace Exhausted</h2>
                <p className="text-gray-400 mb-10 max-w-sm font-bold uppercase tracking-widest text-[10px]">The decision log you're attempting to access does not exist in the current neural workspace.</p>
                <Link href="/dashboard">
                    <Button variant="outline" className="rounded-2xl h-14 px-10 text-lg font-black border-white/10 bg-white/5 text-white hover:bg-white/10">
                        Return to Hub
                    </Button>
                </Link>
            </div>
        );
    }

    const handleUpdateStatus = (status: Decision['status']) => {
        updateDecisionStatus(decision.id, status);
        setShowOutcomeFlow(false);
        toast.success(`Outcome Recorded: ${status}`, {
            description: "The neural trace has been updated to reflect the final reality.",
            icon: status === 'SUCCEEDED' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />,
        });
    };

    const handleRefreshAudit = async () => {
        setIsAnalyzing(true);
        toast.message("Neural Engine Active", { description: "Scanning decision trace for cognitive anomalies..." });
        try {
            const results = await analyzeBlindspots(decision!);
            if (results.length === 0) {
                setBlindspots([{ id: '1', type: 'CLEAN', title: 'No Biases Detected', desc: 'The neural engine did not detect common cognitive traps.', severity: 'LOW' }]);
            } else {
                const parsed = results.map((r, i) => {
                    const [title, desc] = r.split(': ');
                    return { id: `gen-${i}`, type: 'RISK', title: title || 'Potential Issue', desc: desc || r, severity: r.includes('Confirmation') ? 'HIGH' : 'MEDIUM' };
                });
                setBlindspots(parsed);
                toast.success("Audit Complete", { description: `${results.length} potential blindspots detected.` });
            }
        } catch (e) {
            toast.error("Analysis Failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleVerifyAssumption = async (id: string, text: string) => {
        const result = await checkAssumption(text);
        setAssumptionChecks(prev => ({ ...prev, [id]: result }));
        toast.info("Assumption Verified", { description: `Quality Score: ${result.score}/100` });
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        addComment(decision.id, newComment, isAnonymousReview);
        setNewComment('');
        setIsAnonymousReview(false);
        toast.success("Review Logged", { description: isAnonymousReview ? "Your anonymous feedback has been encrypted." : "Your review is now visible to the workspace." });
    };

    return (
        <div className="max-w-6xl mx-auto pb-32 space-y-12">
            <div className="flex items-center justify-between px-4">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors group">
                    <ArrowLeft size={14} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Workspace
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-glow"></span>
                        Status: <span className="text-white">{decision.status}</span>
                    </div>
                </div>
            </div>

            <Card variant="glass" className="p-0 border-none overflow-hidden h-auto md:h-80 shadow-glow relative group bg-white/5">
                <div className="absolute inset-0 bg-hero-gradient opacity-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full -mr-64 -mt-64 blur-[120px] transition-colors duration-1000" />
                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 h-full">
                    <div className="space-y-6 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={statusVariants[decision.status] || 'default'} className="h-8 px-4 text-[10px] font-black uppercase tracking-widest">{decision.status}</Badge>
                            <Badge variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 text-blue-400">{decision.category}</Badge>
                            <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <Calendar size={14} className="text-blue-500/50" />
                                {formatDate(decision.madeOn)}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter max-w-4xl">{decision.title}</h1>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Link href={`/decision/${decision.id}/edit`}>
                            <Button variant="outline" className="flex-1 md:flex-none h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 shadow-soft font-black text-xs uppercase tracking-widest transition-all active:scale-90 text-white">
                                <Edit3 size={18} className="mr-2" />Edit Trace
                            </Button>
                        </Link>
                        <Button onClick={() => setShowOutcomeFlow(true)} className="flex-1 md:flex-none h-14 px-10 rounded-2xl shadow-glow font-black text-sm uppercase tracking-widest transition-all active:scale-90 group">
                            Record Reality<ChevronRight size={20} className="ml-2 mt-0.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="flex items-center gap-8 border-b border-white/5 px-4 h-12">
                <button onClick={() => setActiveTab('trace')} className={cn("h-full px-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2", activeTab === 'trace' ? "border-primary text-white" : "border-transparent text-gray-500 hover:text-gray-300")}>
                    <BrainCircuit size={16} /> Neural Trace
                </button>
                <button onClick={() => setActiveTab('reviews')} className={cn("h-full px-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2", activeTab === 'reviews' ? "border-primary text-white" : "border-transparent text-gray-500 hover:text-gray-300")}>
                    <MessageCircle size={16} /> Team Reviews
                    <Badge className="bg-white/10 text-white ml-2 h-5 px-1.5 min-w-[1.25rem]">{decision.comments?.length || 0}</Badge>
                </button>
            </div>

            {activeTab === 'trace' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-8 space-y-16">
                        <div className="relative pl-12 border-l-4 border-dashed border-white/5 py-4">
                            <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-primary shadow-glow border-4 border-black z-10" />
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2"><Target size={14} className="text-primary" />01. The Prime Resolution</h3>
                                    <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-premium relative group">
                                        <p className="text-3xl font-black text-white leading-relaxed tracking-tighter">"{decision.decision}"</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2"><Brain size={14} className="text-primary" />02. Strategic Context</h3>
                                    <p className="text-xl text-gray-400 font-bold leading-relaxed pl-6 border-l-2 border-white/5 italic">{decision.context}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-10 sticky top-24">
                        <Card className="rounded-[2.5rem] border border-white/10 shadow-premium bg-white/5 p-2 overflow-hidden">
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-4 text-gray-500 group-hover:text-primary transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-white/10"><User size={16} /></div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Authority</span>
                                        </div>
                                        <span className="font-black text-white text-base tracking-tight">{decision.madeBy}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-[#0d1117] border border-[#30363d] overflow-hidden">
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 border border-[#30363d]">
                                    <AvatarFallback className="bg-[#21262d] text-xs font-bold text-[#c9d1d9]">
                                        {isAnonymousReview ? <EyeOff size={16} /> : (currentUser?.name?.substring(0, 2).toUpperCase() || "ME")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-4">
                                    <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add your perspective..." className="min-h-[120px] resize-none bg-[#0d1117] border-[#30363d]" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 bg-[#21262d] px-3 py-1.5 rounded-lg border border-[#30363d]">
                                            <Switch id="anonymous-mode" checked={isAnonymousReview} onCheckedChange={setIsAnonymousReview} />
                                            <Label htmlFor="anonymous-mode" className="text-xs font-bold text-[#c9d1d9] cursor-pointer">Anonymous</Label>
                                        </div>
                                        <Button onClick={handleAddComment} disabled={!newComment.trim()} className="h-10 px-6 font-bold text-xs uppercase tracking-widest gap-2 bg-[#238636] hover:bg-[#2ea043] text-white">
                                            <Send size={14} /> Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <AnimatePresence>
                {showOutcomeFlow && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-xl">
                            <Card className="rounded-[3rem] shadow-2xl border border-white/10 p-4 bg-black overflow-hidden relative">
                                <CardHeader className="text-center pb-8 pt-12 relative z-10">
                                    <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 shadow-glow"><CheckCircle2 size={40} strokeWidth={3} /></div>
                                    <CardTitle className="text-4xl font-black text-white tracking-tighter uppercase">Record Reality</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-8 relative z-10">
                                    <div className="grid grid-cols-1 gap-6">
                                        <button onClick={() => handleUpdateStatus('SUCCEEDED')} className="group flex items-center gap-8 p-8 rounded-[2.5rem] border-2 border-white/5 hover:border-success/50 hover:bg-success/5 transition-all text-left bg-white/5">
                                            <div className="w-20 h-20 rounded-[1.5rem] bg-success/10 flex items-center justify-center text-success shrink-0"><Target size={40} /></div>
                                            <div className="flex-1"><h5 className="font-black text-white text-xl">Mission Succeeded</h5></div>
                                        </button>
                                        <button onClick={() => handleUpdateStatus('FAILED')} className="group flex items-center gap-8 p-8 rounded-[2.5rem] border-2 border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left bg-white/5">
                                            <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 shrink-0"><XCircle size={40} /></div>
                                            <div className="flex-1"><h5 className="font-black text-white text-xl">Trace Deviation</h5></div>
                                        </button>
                                        <button onClick={() => handleUpdateStatus('REVERSED')} className="group flex items-center gap-8 p-8 rounded-[2.5rem] border-2 border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left bg-white/5">
                                            <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shrink-0"><RotateCcw size={40} /></div>
                                            <div className="flex-1"><h5 className="font-black text-white text-xl">Strategic Pivot</h5></div>
                                        </button>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center p-10 bg-white/5 border-t border-white/5">
                                    <Button variant="ghost" onClick={() => setShowOutcomeFlow(false)} className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs text-gray-500 hover:text-white">Back to Trace</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
