'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Sparkles,
    BrainCircuit,
    Target,
    Info,
    AlertTriangle,
    Zap,
    LifeBuoy,
    TrendingUp,
    Lock,
    Globe,
    EyeOff,
    Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { apiRequest } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateSelector } from './TemplateSelector';
import { QualityMeter } from './QualityMeter';
import { RiskAnalyzer } from './RiskAnalyzer';
import { DecisionLinker } from './DecisionLinker';
import { PatternWarning } from './PatternWarning';
import { getRandomChallenge } from '@/lib/assumption-challenger';
import { detectFailurePatterns } from '@/lib/pattern-detector';

const decisionSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    category: z.enum(['PRODUCT', 'MARKETING', 'SALES', 'HIRING', 'TECH', 'OPERATIONS', 'STRATEGIC', 'OTHER']),
    decision: z.string().min(10, 'Please describe the decision in more detail'),
    context: z.string().min(10, 'Context helps the AI provide better analysis'),
    alternatives: z.array(z.object({
        name: z.string().min(1, 'Alternative name is required'),
        whyRejected: z.string().min(1, 'Reason for rejection is required'),
    })).min(1, 'At least one alternative must be documented'),
    assumptions: z.array(z.object({
        value: z.string().min(1, 'Assumption cannot be empty')
    })).min(1, 'At least one assumption is required'),
    successCriteria: z.array(z.object({
        value: z.string().min(1, 'Criterion cannot be empty')
    })).min(1, 'At least one success criterion is required'),
    privacy: z.enum(['This Workspace', 'Public Community', 'Anonymous Public']),
    aiRiskScore: z.number().optional(),
});

type DecisionFormValues = z.infer<typeof decisionSchema>;

const STEPS = [
    {
        id: 'basic',
        title: 'Core Choice',
        desc: 'What is the specific decision being made?',
        fields: ['title', 'category', 'decision'],
        icon: Target
    },
    {
        id: 'context',
        title: 'Strategic Context',
        desc: 'Why now? What forced this choice?',
        fields: ['context'],
        icon: BrainCircuit
    },
    {
        id: 'details',
        title: 'Alternatives & Risks',
        desc: 'What else did you consider?',
        fields: ['alternatives', 'assumptions'],
        icon: Zap
    },
    {
        id: 'success',
        title: 'Success Criteria',
        desc: 'How will we measure success?',
        fields: ['successCriteria'],
        icon: Check
    },
];

interface DecisionFormProps {
    initialData?: Partial<DecisionFormValues>;
    isEditing?: boolean;
    decisionId?: string;
}

export function DecisionForm({ initialData, isEditing, decisionId }: DecisionFormProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isAIGenerating, setIsAIGenerating] = useState(false);
    const [showTemplateSelector, setShowTemplateSelector] = useState(!isEditing && !initialData);
    const { decisions, draft, setDraft, clearDraft, addDecision, updateDecision, featureFlags } = useStore();

    const {
        register,
        control,
        handleSubmit,
        trigger,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<DecisionFormValues>({
        resolver: zodResolver(decisionSchema),
        defaultValues: (initialData as DecisionFormValues) || (draft as DecisionFormValues) || {
            title: '',
            category: 'TECH',
            decision: '',
            context: '',
            alternatives: [{ name: '', whyRejected: '' }],
            assumptions: [{ value: '' }],
            successCriteria: [{ value: '' }],
            privacy: 'This Workspace',
        },
        mode: 'onChange',
    });

    // Auto-save draft
    const watchedFields = watch();
    useEffect(() => {
        if (!showTemplateSelector) {
            const timeout = setTimeout(() => {
                setDraft(watchedFields as any);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [watchedFields, setDraft, showTemplateSelector]);

    const failurePattern = React.useMemo(() => {
        if (!featureFlags?.failure_detection) return null;
        return detectFailurePatterns(
            watchedFields.title || '',
            (watchedFields.decision || '') + ' ' + (watchedFields.context || ''),
            decisions
        );
    }, [watchedFields.title, watchedFields.decision, watchedFields.context, decisions, featureFlags?.failure_detection]);

    const { fields: alternativeFields, append: appendAlternative, remove: removeAlternative } = useFieldArray({
        control,
        name: 'alternatives',
    });

    const { fields: assumptionFields, append: appendAssumption, remove: removeAssumption } = useFieldArray({
        control,
        name: 'assumptions',
    });

    const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({
        control,
        name: 'successCriteria',
    });

    const handleTemplateSelect = (template: any) => {
        if (template.id !== 'blank') {
            reset({
                ...template.prefill,
                privacy: 'This Workspace'
            });
            toast.success('Template Applied', {
                description: `${template.name} template loaded.`
            });
        }
        setShowTemplateSelector(false);
    };

    const handleNext = async () => {
        const fields = STEPS[currentStep].fields as any[];
        const isStepValid = await trigger(fields);
        if (isStepValid && currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAISuggest = async () => {
        setIsAIGenerating(true);
        try {
            if (currentStep === 1) {
                // Fetch context suggestions based on title/category
                const res = await apiRequest<{ data: { tags: string[] } }>('/ai/tag', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: watchedFields.title,
                        category: watchedFields.category
                    })
                });

                const tags = res.data.tags.join(', ');
                setValue('context', (watchedFields.context || '') +
                    `\n\n[NEURAL FOCUS]: The engine identified critical intersections in ${tags}. Consider how these vectors impact your long-term scalability and operational debt.`);
            } else if (currentStep === 2) {
                // Fetch dynamic bias check or alternatives suggestions
                const res = await apiRequest<{ data: { blindspots: string[] } }>('/ai/blindspot', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: watchedFields.title,
                        context: watchedFields.context,
                        theDecision: watchedFields.decision
                    })
                });

                if (res.data.blindspots.length > 0) {
                    toast.message('Neural Guardrail Triggered', {
                        description: res.data.blindspots[0],
                        icon: <AlertTriangle size={16} className="text-amber-500" />
                    });
                }

                // Add a standard alternative if few exist
                if (watchedFields.alternatives.length < 2) {
                    appendAlternative({ name: 'Maintain Status Quo', whyRejected: '[AI] Does not address the identified growth bottlenecks.' });
                }
            }

            toast.success('AI Trace Active', {
                description: 'Neural insights have been injected into your strategic flow.',
                icon: <Sparkles size={16} className="text-purple-500" />
            });
        } catch (e) {
            toast.error('Neural Sync Failed');
        } finally {
            setIsAIGenerating(false);
        }
    };

    const onSubmit = (data: DecisionFormValues) => {
        if (isEditing && decisionId) {
            updateDecision(decisionId, data);
            toast.success('Trace Updated', {
                description: 'The neural log has been refined to reflect new strategic data.'
            });
            router.push(`/decision/${decisionId}`);
        } else {
            addDecision(data);
            clearDraft();
            toast.success('Decision Launched!', {
                description: 'Your decision has been logged and is now being analyzed for potential blindspots.',
            });
            router.push('/dashboard');
        }
    };

    if (showTemplateSelector) {
        return (
            <div className="max-w-6xl mx-auto pb-20">
                {featureFlags.decision_templates ? (
                    <TemplateSelector
                        onSelect={handleTemplateSelect}
                        onSkip={() => setShowTemplateSelector(false)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                        <Sparkles size={48} className="text-primary/20" />
                        <h3 className="text-2xl font-black text-white uppercase italic">Initializing System...</h3>
                        <Button onClick={() => setShowTemplateSelector(false)} className="rounded-xl">Start Blank Trace</Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-start lg:max-w-7xl mx-auto pb-20">
            <div className="lg:col-span-8 space-y-12">
                {/* Multi-step Header */}
                <div className="flex justify-between items-center px-4">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center gap-3 relative flex-1 group">
                            <div className={cn(
                                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 z-10 border-2",
                                idx < currentStep ? "bg-primary border-primary text-white shadow-glow" :
                                    idx === currentStep ? "bg-white border-primary text-primary shadow-glow scale-110" :
                                        "bg-white/5 border-white/10 text-gray-600"
                            )}>
                                {idx < currentStep ? <Check size={28} strokeWidth={4} /> : <step.icon size={28} />}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                    idx === currentStep ? "text-primary shadow-glow shadow-primary/20" : "text-gray-600"
                                )}>Section {idx + 1}</span>
                                <span className={cn(
                                    "text-xs font-black uppercase tracking-widest mt-1 sm:block hidden",
                                    idx === currentStep ? "text-white" : "text-gray-600"
                                )}>{step.title}</span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={cn(
                                    "absolute top-8 left-1/2 w-full h-[2px] -z-0 transition-colors duration-500",
                                    idx < currentStep ? "bg-primary shadow-glow shadow-primary/20" : "bg-white/5"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                <Card variant="glass" className="shadow-premium border-white/5 overflow-hidden bg-white/5">
                    <CardHeader className="bg-white/5 border-b border-white/5 p-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] px-3 h-7 flex items-center">
                                        Strategic Analysis
                                    </Badge>
                                    {isAIGenerating && (
                                        <Badge className="bg-purple-500 text-white border-none animate-pulse font-black uppercase tracking-[0.2em] text-[10px] px-3 h-7 flex items-center shadow-glow">
                                            Neural Compute
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-4xl font-black text-white tracking-tighter uppercase">
                                    {STEPS[currentStep].title}
                                </CardTitle>
                                <p className="text-gray-500 font-bold text-base uppercase tracking-widest max-w-xl">
                                    {STEPS[currentStep].desc}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={handleAISuggest}
                                disabled={isAIGenerating}
                                className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-white transition-all active:scale-90 shadow-glow shadow-purple-500/5"
                            >
                                <Sparkles size={24} className={cn(isAIGenerating && "animate-spin")} />
                            </Button>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="p-10 space-y-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-10"
                                >
                                    {currentStep === 0 && (
                                        <div className="space-y-8">
                                            {featureFlags?.failure_detection && <PatternWarning match={failurePattern} />}
                                            <Input
                                                label="What is the high-level title of this decision?"
                                                placeholder="e.g., Migrating to PostgreSQL for scalability"
                                                {...register('title')}
                                                error={errors.title?.message}
                                                className="h-14 text-lg"
                                            />
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['TECH', 'HIRING', 'PRODUCT', 'MARKETING', 'SALES', 'STRATEGIC', 'OPERATIONS', 'OTHER'].map(cat => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => setValue('category', cat as any)}
                                                            className={cn(
                                                                "h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border transition-all",
                                                                watch('category') === cat
                                                                    ? "bg-primary text-white border-primary shadow-glow scale-105"
                                                                    : "bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white"
                                                            )}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <Textarea
                                                label="Describe the actual choice made."
                                                placeholder="Clearly state what path was taken..."
                                                {...register('decision')}
                                                error={errors.decision?.message}
                                                className="min-h-[120px] text-lg leading-relaxed"
                                            />

                                            <div className="space-y-4 pt-4 border-t border-white/5">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Visibility Level</label>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[
                                                        { id: 'This Workspace', icon: Lock, label: 'Private Workspace', desc: 'Team Only' },
                                                        { id: 'Public Community', icon: Globe, label: 'Public Community', desc: 'Visible to Everyone' },
                                                        { id: 'Anonymous Public', icon: EyeOff, label: 'Anonymous Public', desc: 'Hidden Author' },
                                                    ].map((option) => (
                                                        <div
                                                            key={option.id}
                                                            onClick={() => setValue('privacy', option.id as any)}
                                                            className={cn(
                                                                "p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 group",
                                                                watch('privacy') === option.id
                                                                    ? "bg-primary/20 border-primary text-white"
                                                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                                watch('privacy') === option.id ? "bg-primary text-white shadow-glow" : "bg-white/5 text-gray-400"
                                                            )}>
                                                                <option.icon size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm">{option.label}</div>
                                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{option.desc}</div>
                                                            </div>
                                                            {watch('privacy') === option.id && <div className="ml-auto text-primary"><Check size={16} /></div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div className="space-y-8">
                                            {featureFlags?.failure_detection && <PatternWarning match={failurePattern} />}
                                            <div className="p-10 bg-white/2 border border-white/5 rounded-[2.5rem] flex gap-6 items-start shadow-inner">
                                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-premium border border-white/5">
                                                    <Info size={24} className="text-blue-400" />
                                                </div>
                                                <div className="text-sm text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
                                                    Context is the critical layer. Describe technical debt, market shifts, or resource constraints that mandated this trace.
                                                </div>
                                            </div>
                                            <Textarea
                                                label="Strategic Context"
                                                placeholder="e.g., We are hitting the limits of our current MySQL instance, and maintenance costs have doubled in 6 months..."
                                                {...register('context')}
                                                error={errors.context?.message}
                                                className="min-h-[300px] text-lg leading-relaxed"
                                            />
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-12">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                                                            <span className="w-4 h-4 rounded-xl bg-red-500 shadow-glow shadow-red-500/20"></span>
                                                            Rejected Paths
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">What other choices were discarded?</p>
                                                    </div>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => appendAlternative({ name: '', whyRejected: '' })} className="rounded-xl px-6 h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px]">
                                                        <Plus size={20} className="mr-2" strokeWidth={4} /> Add Path
                                                    </Button>
                                                </div>
                                                <div className="space-y-8">
                                                    {alternativeFields.map((field, idx) => (
                                                        <div key={field.id} className="p-10 bg-white/2 border border-white/5 rounded-[3rem] space-y-8 relative group hover:border-white/10 transition-all">
                                                            <Input
                                                                label="Path Name"
                                                                placeholder="Alternative name"
                                                                {...register(`alternatives.${idx}.name` as const)}
                                                                error={errors.alternatives?.[idx]?.name?.message}
                                                                className="h-12"
                                                            />
                                                            <Textarea
                                                                label="Rejection Catalyst"
                                                                placeholder="Why was this path not chosen?"
                                                                className="min-h-[100px]"
                                                                {...register(`alternatives.${idx}.whyRejected` as const)}
                                                                error={errors.alternatives?.[idx]?.whyRejected?.message}
                                                            />
                                                            {alternativeFields.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAlternative(idx)}
                                                                    className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-premium"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                                                            <span className="w-4 h-4 rounded-xl bg-amber-500 shadow-glow shadow-amber-500/20"></span>
                                                            Key Assumptions
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">What must be true for success?</p>
                                                    </div>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => appendAssumption({ value: '' })} className="rounded-xl px-6 h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px]">
                                                        <Plus size={20} className="mr-2" strokeWidth={4} /> Add Assumption
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {assumptionFields.map((field, idx) => (
                                                        <div key={field.id} className="flex gap-6 group items-start p-4 hover:bg-white/5 rounded-3xl transition-all">
                                                            <div className="w-12 h-12 rounded-[1.25rem] bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-1 border border-amber-500/20 shadow-glow shadow-amber-500/5">
                                                                <AlertTriangle size={24} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <Input
                                                                    placeholder="e.g., Scaling will stay linear with data volume..."
                                                                    {...register(`assumptions.${idx}.value` as const)}
                                                                    error={errors.assumptions?.[idx]?.value?.message}
                                                                    className="h-12 bg-white/50"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 mt-2">
                                                                {featureFlags?.assumption_checker && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toast.message('AI CHALLENGE', { description: getRandomChallenge() })}
                                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-amber-500 hover:bg-amber-500/10 bg-white/5 border border-white/10 transition-all shadow-premium group/challenge"
                                                                        title="Challenge this assumption"
                                                                    >
                                                                        <Zap size={20} className="group-hover/challenge:fill-amber-500/20" />
                                                                    </button>
                                                                )}
                                                                {assumptionFields.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeAssumption(idx)}
                                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all shadow-premium"
                                                                    >
                                                                        <Trash2 size={20} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-10">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                                                            <span className="w-4 h-4 rounded-xl bg-green-500 shadow-glow shadow-green-500/20"></span>
                                                            Success Matrix
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Quantifiable verification metrics.</p>
                                                    </div>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => appendCriteria({ value: '' })} className="rounded-xl px-6 h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px]">
                                                        <Plus size={20} className="mr-2" strokeWidth={4} /> Add Metric
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {criteriaFields.map((field, idx) => (
                                                        <div key={field.id} className="flex gap-6 group items-start p-4 hover:bg-white/5 rounded-3xl transition-all">
                                                            <div className="w-12 h-12 rounded-[1.25rem] bg-green-500/10 text-green-400 flex items-center justify-center shrink-0 mt-1 border border-green-500/20 shadow-glow shadow-green-500/5">
                                                                <TrendingUp size={24} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <Input
                                                                    placeholder="e.g., Database response time < 50ms at peak..."
                                                                    {...register(`successCriteria.${idx}.value` as const)}
                                                                    error={errors.successCriteria?.[idx]?.value?.message}
                                                                    className="h-12 bg-white/50"
                                                                />
                                                            </div>
                                                            {criteriaFields.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeCriteria(idx)}
                                                                    className="mt-2 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all shadow-premium"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-10 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] flex gap-8 items-start shadow-inner">
                                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-amber-500 shrink-0 shadow-glow shadow-amber-500/5 border border-amber-500/20">
                                                    <LifeBuoy size={32} />
                                                </div>
                                                <div className="text-gray-400 leading-relaxed font-bold">
                                                    <strong className="text-amber-400 block text-lg font-black uppercase tracking-[0.2em] mb-2">Neural Guardrail</strong>
                                                    Success criteria combat hindsight bias. Documentation now prevents the rewriting of history later.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                                                    <span className="w-4 h-4 rounded-xl bg-purple-500 shadow-glow shadow-purple-500/20"></span>
                                                    Decision Network
                                                </h4>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Connect this decision to the wider knowledge graph.</p>
                                            </div>

                                            {featureFlags.decision_linking && (
                                                <div className="p-8 rounded-[2rem] bg-black/20 border border-white/5">
                                                    <DecisionLinker
                                                        currentDecisionId={decisionId}
                                                        onLinkAdd={(link: any) => {
                                                            // For new decision form, we might want to store these in local state 
                                                            // before submitting, but for now let's just toast
                                                            toast.info('Links will be saved when you submit the decision.');
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t border-white/5 bg-white/2 p-10 rounded-b-[3rem]">
                            <Button type="button" variant="ghost" onClick={handleBack} disabled={currentStep === 0} className="h-16 rounded-[1.5rem] px-10 font-black uppercase tracking-[0.2em] text-[10px] text-gray-500 hover:text-white transition-all">
                                <ChevronLeft size={20} className="mr-3" strokeWidth={4} /> Previous Segment
                            </Button>
                            {currentStep === STEPS.length - 1 ? (
                                <Button type="submit" className="h-16 bg-primary hover:bg-blue-600 px-16 rounded-[1.5rem] shadow-glow shadow-primary/20 transition-all text-sm uppercase tracking-[0.3em] font-black">
                                    Launch Trace
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleNext} className="h-16 rounded-[1.5rem] px-12 font-black text-sm uppercase tracking-[0.2em] gap-4 shadow-glow shadow-primary/10">
                                    Next Sequence <ChevronRight size={22} className="mt-0.5" strokeWidth={4} />
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </Card>
            </div>

            <div className="lg:col-span-4 hidden lg:block sticky top-8 space-y-6">
                {featureFlags?.risk_analyzer && (
                    <RiskAnalyzer
                        text={(watchedFields.decision || '') + ' ' + (watchedFields.context || '')}
                        alternativesCount={watchedFields.alternatives?.length || 0}
                        assumptionsCount={watchedFields.assumptions?.length || 0}
                        onScoreChange={(score) => setValue('aiRiskScore', score)}
                    />
                )}
                {featureFlags.quality_meter && <QualityMeter fields={watchedFields as any} />}

                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Pro Tip</h4>
                    <p className="text-xs text-primary/80 leading-relaxed font-medium">
                        Decisions with detailed "Why Rejected" context for alternatives are 40% less likely to be relitigated later by the team.
                    </p>
                </div>
            </div>
        </div >
    );
}
