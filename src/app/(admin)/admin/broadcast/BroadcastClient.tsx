'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    Megaphone,
    Send,
    Info,
    AlertTriangle,
    CheckCircle,
    Eye,
    Zap,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function BroadcastClient() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [isSending, setIsSending] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) {
            toast.error("Title and message are required for the broadcast.");
            return;
        }

        setIsSending(true);
        try {
            await apiRequest('/admin/broadcast', {
                method: 'POST',
                body: JSON.stringify({ title, message, type })
            });

            toast.success("Broadcast transmitted to all neural nodes.");
            setTitle('');
            setMessage('');
            setType('INFO');
        } catch (err) {
            console.error("Broadcast failed", err);
            toast.error("Transmission failure. Check relay connectivity.");
        } finally {
            setIsSending(false);
        }
    };

    if (!mounted) return null;

    const types = [
        { id: 'INFO', icon: Info, color: 'text-blue-400', label: 'Neutral Info' },
        { id: 'SUCCESS', icon: CheckCircle, color: 'text-emerald-400', label: 'Success Signal' },
        { id: 'WARNING', icon: AlertTriangle, color: 'text-amber-400', label: 'Security Warning' },
        { id: 'ERROR', icon: AlertTriangle, color: 'text-red-400', label: 'System Failure' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Megaphone className="text-primary" size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Global Broadcast</h1>
                </div>
                <p className="text-gray-500 text-sm font-medium tracking-wide">Interface for high-priority global neurotransmissions</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor */}
                <Card className="p-8 bg-[#0d1117] border-white/5 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Select Message Frequency</label>
                        <div className="grid grid-cols-2 gap-2">
                            {types.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${type === t.id
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'
                                        }`}
                                >
                                    <t.icon size={16} className={type === t.id ? t.color : ''} />
                                    <span className="text-[10px] font-black uppercase tracking-tight">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Broadcast Header</label>
                        <Input
                            placeholder="Priority Alpha Status..."
                            className="bg-black/50 border-white/10 text-white h-12"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Transmission Content</label>
                        <textarea
                            placeholder="Detailed sync instructions for the collective..."
                            className="w-full min-h-[160px] bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                            variant="ghost"
                            className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-[#8b949e] border border-white/5 hover:bg-white/5"
                        >
                            <Eye size={16} className="mr-2" />
                            {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                        <Button
                            onClick={handleBroadcast}
                            disabled={isSending || !title || !message}
                            className="flex-1 h-12 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white hover:shadow-glow disabled:opacity-50"
                        >
                            {isSending ? (
                                <Zap className="animate-spin mr-2" size={16} />
                            ) : (
                                <Send size={16} className="mr-2" />
                            )}
                            Broadcast
                        </Button>
                    </div>
                </Card>

                {/* Live Preview */}
                <div className="relative">
                    <AnimatePresence>
                        {isPreviewMode ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Eye className="text-primary" size={16} />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End-User Perception</span>
                                </div>

                                {/* Notification Mockup */}
                                <div className="p-5 rounded-2xl bg-[#161b22] border border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            {(() => {
                                                const Icon = types.find(t => t.id === type)?.icon;
                                                return Icon ? <Icon size={20} className="text-primary" /> : null;
                                            })()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-black text-white truncate">{title || 'Priority Header'}</h4>
                                            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-3">
                                                {message || 'The neural network awaits your command sequence...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Analyze Signal</span>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Users className="text-primary" size={20} />
                                        <div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Target Reach</h4>
                                            <p className="text-[10px] font-medium text-gray-500 uppercase mt-0.5">Estimated Impact Zone</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                        This broadcast will be dispatched to <span className="text-white font-bold">100%</span> of active operatives.
                                        Critical alerts will trigger high-frequency haptic feedback.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-12 text-center opacity-40">
                                <Megaphone className="text-gray-700 mb-4" size={48} />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Awaiting Transmission Sequence</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

