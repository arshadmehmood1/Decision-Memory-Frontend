'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import {
    Calendar,
    ArrowLeft,
    Edit3,
    User,
    Shield,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Send,
    EyeOff,
    Check,
    Shuffle,
    Eye,
    Activity,
    ShieldCheck,
    Clock,
    Target,
    Brain,
    Zap,
    Download,
    ChevronRight,
    BrainCircuit,
    MessageCircle,
    AlertCircle,
    TrendingUp,
    CheckCircle
} from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Decision, OutcomeReview } from '@/lib/store';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const { decisions, updateDecisionStatus, recordOutcome, currentUser, addComment, analyzeBlindspots, checkAssumption, fetchComments, featureFlags } = useStore();
    const contentRef = React.useRef<HTMLDivElement>(null);
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

    const handleExportPDF = async () => {
        if (!contentRef.current || !decision) return;

        setIsAnalyzing(true);
        toast.info("Generating professional report...", { description: "Applying high-fidelity layout engine to neural trace." });

        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0d1117',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            // Standard A4 is approx 595x842 points. We'll size to match our canvas aspect.
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'l' : 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Strategic-Trace-${decision.id.substring(0, 8)}.pdf`);

            toast.success("Export Complete", { description: "Professional report saved." });
        } catch (err) {
            console.error("PDF Export failed", err);
            toast.error("Export Failed", { description: "Failed to render visual trace to PDF." });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const [auditStep, setAuditStep] = useState(1);
    const [auditData, setAuditData] = useState<Partial<OutcomeReview>>({
        outcome: 'SUCCEEDED',
        assumptionValidations: []
    });

    const handleStartAudit = () => {
        setAuditData({
            outcome: 'SUCCEEDED',
            assumptionValidations: decision.assumptions.map(a => ({ id: a.id, validatedAs: 'UNKNOWN' }))
        });
        setAuditStep(1);
        setShowOutcomeFlow(true);
    };

    const handleAuditSubmit = async () => {
        try {
            await recordOutcome(decision.id, auditData as OutcomeReview);
            setShowOutcomeFlow(false);
            toast.success("Audit Recorded", { description: "The strategic trajectory has been updated." });
        } catch (err) {
            toast.error("Audit Failed", { description: "Internal neural error during persistence." });
        }
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
                        {featureFlags.pdf_reports && (
                            <Button
                                onClick={handleExportPDF}
                                disabled={isAnalyzing}
                                variant="outline"
                                className="flex-1 md:flex-none h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 shadow-soft font-black text-xs uppercase tracking-widest transition-all active:scale-90 text-indigo-400"
                            >
                                <Download size={18} className="mr-2" />Report
                            </Button>
                        )}
                        <Link href={`/decision/${decision.id}/edit`}>
                            <Button variant="outline" className="flex-1 md:flex-none h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 shadow-soft font-black text-xs uppercase tracking-widest transition-all active:scale-90 text-white">
                                <Edit3 size={18} className="mr-2" />Edit Trace
                            </Button>
                        </Link>
                        {decision.status === 'ACTIVE' && (
                            <Button onClick={handleStartAudit} className="flex-1 md:flex-none h-14 px-10 rounded-2xl shadow-glow font-black text-sm uppercase tracking-widest transition-all active:scale-90 group">
                                Record Reality<ChevronRight size={20} className="ml-2 mt-0.5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}
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
                <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-8 space-y-16">
                        {decision.review && (
                            <div className="space-y-8 p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4">
                                    <ShieldCheck className="text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" size={64} />
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-500/20 text-emerald-400 font-black tracking-widest text-[10px] uppercase">{decision.review.outcome}</Badge>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recorded on {formatDate(decision.review.createdAt)}</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white">Post-Mortem Analysis</h2>
                                    <p className="text-gray-400 font-bold leading-relaxed">{decision.review.whatHappened}</p>
                                    {decision.review.whatWeLearned && (
                                        <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Key Learning</h4>
                                            <p className="text-sm text-gray-300 font-bold italic">"{decision.review.whatWeLearned}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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

                                {decision.assumptions.length > 0 && (
                                    <div className="space-y-6 pt-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2"><Shield size={14} className="text-primary" />03. Assumption Matrix</h3>
                                        <div className="grid gap-4">
                                            {decision.assumptions.map((a) => (
                                                <div key={a.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                                                    <p className="text-sm font-bold text-gray-300">{a.value}</p>
                                                    {a.validatedAs && (
                                                        <Badge className={cn("text-[8px] font-black uppercase",
                                                            a.validatedAs === 'TRUE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                a.validatedAs === 'FALSE' ? 'bg-red-500/10 text-red-500' :
                                                                    'bg-amber-500/10 text-amber-500'
                                                        )}>
                                                            {a.validatedAs}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {decision.successCriteria.length > 0 && (
                                    <div className="space-y-6 pt-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2"><CheckCircle size={14} className="text-success" />04. Success Protocol</h3>
                                        <div className="grid gap-4">
                                            {decision.successCriteria.map((s, idx) => (
                                                <div key={idx} className="p-6 bg-success/5 border border-success/10 rounded-2xl flex items-center gap-4 group">
                                                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0"><Check size={16} strokeWidth={3} /></div>
                                                    <p className="text-sm font-bold text-gray-200">{s.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {decision.alternatives.length > 0 && (
                                    <div className="space-y-6 pt-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2"><Shuffle size={14} className="text-amber-500" />05. Rejected Futures</h3>
                                        <div className="grid gap-6">
                                            {decision.alternatives.map((alt, idx) => (
                                                <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 group hover:bg-white/[0.07] transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <Badge className="bg-amber-500/10 text-amber-500 font-black text-[9px] uppercase tracking-widest">ALTERNATIVE</Badge>
                                                        <h4 className="text-lg font-black text-white">{alt.name}</h4>
                                                    </div>
                                                    <div className="pl-4 border-l-2 border-amber-500/20">
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Reason for Rejection</p>
                                                        <p className="text-sm text-gray-400 font-bold italic">{alt.whyRejected}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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

                                    <div className="w-full h-px bg-white/5" />

                                    <div className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-4 text-gray-500 group-hover:text-blue-400 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-blue-400/10 group-hover:text-blue-400 transition-colors border border-white/10"><Eye size={16} /></div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Privacy</span>
                                        </div>
                                        <Badge variant="outline" className="border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest">{decision.privacy}</Badge>
                                    </div>

                                    {decision.aiRiskScore && (
                                        <div className="flex items-center justify-between group cursor-default">
                                            <div className="flex items-center gap-4 text-gray-500 group-hover:text-red-500 transition-colors">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors border border-white/10"><Activity size={16} /></div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Neural Risk</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-green-500 to-red-500" style={{ width: `${decision.aiRiskScore}%` }} />
                                                </div>
                                                <span className="font-black text-xs text-white">{decision.aiRiskScore}%</span>
                                            </div>
                                        </div>
                                    )}

                                    {decision.reviewDeadline && (
                                        <div className="flex items-center justify-between group cursor-default">
                                            <div className="flex items-center gap-4 text-gray-500 group-hover:text-amber-500 transition-colors">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors border border-white/10"><Clock size={16} /></div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Audit Due</span>
                                            </div>
                                            <span className="font-black text-xs text-amber-500">{formatDate(decision.reviewDeadline)}</span>
                                        </div>
                                    )}
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
                    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-500">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl"
                        >
                            <Card className="rounded-[3rem] shadow-2xl border border-white/10 p-2 bg-[#0d1117] overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(auditStep / 4) * 100}%` }}
                                        className="h-full bg-primary shadow-glow"
                                    />
                                </div>

                                <CardHeader className="text-center pb-8 pt-12 relative z-10">
                                    <div className="flex items-center justify-between px-8 mb-8">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Strategic Audit</span>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{auditStep} / 4</span>
                                    </div>
                                    <CardTitle className="text-4xl font-black text-white tracking-tighter uppercase px-8">
                                        {auditStep === 1 && "Final Verdict"}
                                        {auditStep === 2 && "Neural Post-Mortem"}
                                        {auditStep === 3 && "Assumption Check"}
                                        {auditStep === 4 && "Final Commitment"}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-8 p-10 relative z-10 min-h-[400px]">
                                    {auditStep === 1 && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: 'SUCCEEDED', label: 'Mission Succeeded', icon: Target, color: 'success' },
                                                { id: 'FAILED', label: 'Trace Deviation', icon: XCircle, color: 'red-500' },
                                                { id: 'REVERSED', label: 'Strategic Pivot', icon: RotateCcw, color: 'primary' }
                                            ].map((status) => (
                                                <button
                                                    key={status.id}
                                                    onClick={() => {
                                                        setAuditData((prev: Partial<OutcomeReview>) => ({ ...prev, outcome: status.id as any }));
                                                        setAuditStep(2);
                                                    }}
                                                    className={cn(
                                                        "group flex items-center gap-8 p-6 rounded-[2rem] border-2 transition-all text-left bg-white/5",
                                                        auditData.outcome === status.id ? `border-${status.color}/50 bg-${status.color}/5` : "border-white/5 hover:border-white/10"
                                                    )}
                                                >
                                                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", `bg-${status.color}/10 text-${status.color}`)}>
                                                        <status.icon size={32} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-black text-white text-lg uppercase tracking-tight">{status.label}</h5>
                                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">RECORD AS GLOBAL REALITY</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {auditStep === 2 && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">What actually happened?</label>
                                                <Textarea
                                                    value={auditData.whatHappened || ''}
                                                    onChange={e => setAuditData((prev: Partial<OutcomeReview>) => ({ ...prev, whatHappened: e.target.value }))}
                                                    placeholder="Describe the real-world outcome in high fidelity..."
                                                    className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Key Strategic Learning</label>
                                                <Textarea
                                                    value={auditData.whatWeLearned || ''}
                                                    onChange={e => setAuditData((prev: Partial<OutcomeReview>) => ({ ...prev, whatWeLearned: e.target.value }))}
                                                    placeholder="What should the neural engine remember for next time?"
                                                    className="min-h-[100px] bg-white/5 border-white/10 rounded-2xl text-white font-bold italic"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {auditStep === 3 && (
                                        <div className="space-y-6">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Validate the original Decision Foundations:</p>
                                            <div className="grid gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {decision.assumptions.map((a, idx) => {
                                                    const validation = auditData.assumptionValidations?.find(v => v.id === a.id);
                                                    return (
                                                        <div key={a.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                                                            <p className="text-xs font-bold text-gray-300">"{a.value}"</p>
                                                            <div className="flex gap-2">
                                                                {['TRUE', 'FALSE', 'PARTIALLY_TRUE'].map(status => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => {
                                                                            const newValidations = [...(auditData.assumptionValidations || [])];
                                                                            const vIdx = newValidations.findIndex((v: any) => v.id === a.id);
                                                                            newValidations[vIdx] = { ...newValidations[vIdx], validatedAs: status as any };
                                                                            setAuditData((prev: Partial<OutcomeReview>) => ({ ...prev, assumptionValidations: newValidations }));
                                                                        }}
                                                                        className={cn(
                                                                            "flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all",
                                                                            validation?.validatedAs === status ?
                                                                                (status === 'TRUE' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                                                                    status === 'FALSE' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                                                                        'bg-amber-500/20 border-amber-500/50 text-amber-400')
                                                                                : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
                                                                        )}
                                                                    >
                                                                        {status.replace('_', ' ')}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {auditStep === 4 && (
                                        <div className="flex flex-col items-center justify-center text-center space-y-8 py-10">
                                            <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-[2.5rem] flex items-center justify-center text-primary shadow-glow animate-pulse">
                                                <Brain size={48} strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Commit Audit to Trace?</h3>
                                                <p className="text-gray-500 text-xs font-bold max-w-sm uppercase tracking-widest leading-relaxed">
                                                    You are about to record this {auditData.outcome} outcome. This will finalize the strategic log and update global metrics.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex justify-between p-10 bg-white/5 border-t border-white/5">
                                    <Button
                                        variant="ghost"
                                        onClick={() => auditStep === 1 ? setShowOutcomeFlow(false) : setAuditStep((prev: number) => prev - 1)}
                                        className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-white"
                                    >
                                        {auditStep === 1 ? 'Cancel Trace' : 'Prev Vector'}
                                    </Button>
                                    {auditStep < 4 ? (
                                        <Button
                                            onClick={() => setAuditStep((prev: number) => prev + 1)}
                                            className="rounded-2xl px-10 h-12 font-black uppercase tracking-widest text-[10px] bg-white text-black hover:bg-gray-200"
                                        >
                                            Next Phase <ChevronRight size={14} className="ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleAuditSubmit}
                                            className="rounded-2xl px-12 h-12 font-black uppercase tracking-widest text-[10px] bg-primary text-white shadow-glow"
                                        >
                                            Commit Audit <Zap size={14} className="ml-2" />
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
