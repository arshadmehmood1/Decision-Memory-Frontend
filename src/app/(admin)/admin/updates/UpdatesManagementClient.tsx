'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    Megaphone,
    Plus,
    CheckCircle,
    Archive,
    Trash2,
    Eye,
    X,
    Sparkles,
    Bug,
    TrendingUp,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

interface AppUpdate {
    id: string;
    title: string;
    description: string;
    version?: string;
    type: 'FEATURE' | 'BUGFIX' | 'IMPROVEMENT' | 'ANNOUNCEMENT';
    status: 'DRAFT' | 'LIVE' | 'ARCHIVED';
    approvedAt?: string;
    approvedBy?: string;
    publishedAt?: string;
    createdAt: string;
}

const TYPE_CONFIG = {
    FEATURE: { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    BUGFIX: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10' },
    IMPROVEMENT: { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ANNOUNCEMENT: { icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/10' }
};

const STATUS_CONFIG = {
    DRAFT: { label: 'Pending', bg: 'bg-amber-500/10', color: 'text-amber-400' },
    LIVE: { label: 'Implemented', bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
    ARCHIVED: { label: 'Archived', bg: 'bg-slate-500/10', color: 'text-slate-400' }
};

type FilterTab = 'ALL' | 'DRAFT' | 'LIVE' | 'ARCHIVED';

export default function UpdatesManagementClient() {
    const [updates, setUpdates] = useState<AppUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [showPreview, setShowPreview] = useState<AppUpdate | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        version: '',
        type: 'FEATURE' as AppUpdate['type']
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) loadUpdates();
    }, [mounted]);

    const loadUpdates = async () => {
        try {
            setLoading(true);
            const res = await apiRequest<{ data: AppUpdate[] }>('/admin/updates');
            setUpdates(res.data);
        } catch (err) {
            console.error('Failed to load updates', err);
            toast.error('Failed to load updates');
        } finally {
            setLoading(false);
        }
    };

    // Filter and stats
    const filteredUpdates = useMemo(() => {
        if (activeFilter === 'ALL') return updates;
        return updates.filter(u => u.status === activeFilter);
    }, [updates, activeFilter]);

    const stats = useMemo(() => ({
        total: updates.length,
        draft: updates.filter(u => u.status === 'DRAFT').length,
        live: updates.filter(u => u.status === 'LIVE').length,
        archived: updates.filter(u => u.status === 'ARCHIVED').length
    }), [updates]);

    const handleCreate = async () => {
        if (!editForm.title || !editForm.description) {
            toast.error('Title and description are required');
            return;
        }
        try {
            await apiRequest('/admin/updates', {
                method: 'POST',
                body: JSON.stringify(editForm)
            });
            toast.success('Update created as draft');
            setShowEditor(false);
            setEditForm({ title: '', description: '', version: '', type: 'FEATURE' });
            loadUpdates();
        } catch (err) {
            console.error('Create failed', err);
            toast.error('Failed to create update');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await apiRequest(`/admin/updates/${id}/approve`, { method: 'POST' });
            toast.success('Feature marked as implemented!');
            loadUpdates();
        } catch (err) {
            console.error('Approve failed', err);
            toast.error('Failed to approve update');
        }
    };

    const handleArchive = async (id: string) => {
        try {
            await apiRequest(`/admin/updates/${id}/archive`, { method: 'POST' });
            toast.success('Update archived');
            loadUpdates();
        } catch (err) {
            console.error('Archive failed', err);
            toast.error('Failed to archive update');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this update?')) return;
        try {
            await apiRequest(`/admin/updates/${id}`, { method: 'DELETE' });
            toast.success('Update deleted');
            loadUpdates();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('Failed to delete update');
        }
    };

    if (!mounted) return null;

    const filterTabs: { key: FilterTab; label: string; count: number }[] = [
        { key: 'ALL', label: 'All Features', count: stats.total },
        { key: 'DRAFT', label: 'Pending', count: stats.draft },
        { key: 'LIVE', label: 'Implemented', count: stats.live },
        { key: 'ARCHIVED', label: 'Archived', count: stats.archived }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-400/10 border border-purple-400/20">
                            <Megaphone className="text-purple-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Roadmap Tracker</h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">
                        Manage feature implementation status and publish updates to users
                    </p>
                </div>
                <Button
                    onClick={() => setShowEditor(true)}
                    className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-glow"
                >
                    <Plus size={14} className="mr-2" />
                    Add Feature
                </Button>
            </header>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Features', value: stats.total, color: 'text-white' },
                    { label: 'Pending', value: stats.draft, color: 'text-amber-400' },
                    { label: 'Implemented', value: stats.live, color: 'text-emerald-400' },
                    { label: 'Archived', value: stats.archived, color: 'text-gray-500' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-4">
                <Filter size={16} className="text-gray-500 mt-2" />
                {filterTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tab.key
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Updates List */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading updates...</div>
            ) : filteredUpdates.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <Megaphone className="mx-auto mb-4 opacity-50" size={48} />
                    <p>No {activeFilter === 'ALL' ? '' : activeFilter.toLowerCase()} features found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUpdates.map((update, i) => {
                        const TypeIcon = TYPE_CONFIG[update.type].icon;
                        return (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Card className="p-6 bg-[#0d1117] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                                    {update.status === 'LIVE' && (
                                        <div className="absolute top-0 right-0 p-1 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest px-3">
                                            Implemented
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${TYPE_CONFIG[update.type].bg}`}>
                                                <TypeIcon size={20} className={TYPE_CONFIG[update.type].color} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-sm font-black text-white">{update.title}</h4>
                                                    {update.version && (
                                                        <Badge className="bg-white/5 text-white/60 border-white/10 text-[9px] font-bold">
                                                            v{update.version}
                                                        </Badge>
                                                    )}
                                                    <Badge className={`text-[8px] font-black uppercase tracking-widest border-transparent ${STATUS_CONFIG[update.status].bg} ${STATUS_CONFIG[update.status].color}`}>
                                                        {STATUS_CONFIG[update.status].label}
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    {update.type} • {new Date(update.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowPreview(update)}
                                                className="h-10 w-10 p-0 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl"
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            {update.status === 'DRAFT' && (
                                                <Button
                                                    onClick={() => handleApprove(update.id)}
                                                    className="h-10 text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                >
                                                    <CheckCircle size={14} className="mr-2" />
                                                    Approve
                                                </Button>
                                            )}
                                            {update.status === 'LIVE' && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleArchive(update.id)}
                                                    className="h-10 text-[10px] font-black uppercase tracking-widest border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                                                >
                                                    <Archive size={14} className="mr-2" />
                                                    Archive
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(update.id)}
                                                className="h-10 w-10 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )
            }

            {/* Create Editor Modal */}
            <AnimatePresence>
                {showEditor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0d1117] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Create Update</h2>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                                        Will be saved as draft until approved
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowEditor(false)} className="rounded-2xl hover:bg-white/5">
                                    <X size={24} className="text-gray-500" />
                                </Button>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Title</label>
                                        <input
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            placeholder="New Feature: AI Insights"
                                            className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Version (optional)</label>
                                        <input
                                            value={editForm.version}
                                            onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                                            placeholder="1.2.0"
                                            className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Type</label>
                                    <div className="flex gap-2">
                                        {(['FEATURE', 'BUGFIX', 'IMPROVEMENT', 'ANNOUNCEMENT'] as const).map((t) => {
                                            const Icon = TYPE_CONFIG[t].icon;
                                            return (
                                                <button
                                                    key={t}
                                                    onClick={() => setEditForm({ ...editForm, type: t })}
                                                    className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${editForm.type === t
                                                        ? `${TYPE_CONFIG[t].bg} border-white/20 ${TYPE_CONFIG[t].color}`
                                                        : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'
                                                        }`}
                                                >
                                                    <Icon size={14} />
                                                    {t}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Description (Markdown)</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        placeholder="Describe the update in detail..."
                                        className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-medium text-white focus:border-primary outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowEditor(false)}
                                    className="flex-1 h-14 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    className="flex-[2] h-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow"
                                >
                                    Create Draft
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPreview(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <Badge className={`text-[9px] font-black uppercase tracking-widest border-transparent ${TYPE_CONFIG[showPreview.type].bg} ${TYPE_CONFIG[showPreview.type].color} mb-2`}>
                                        {showPreview.type}
                                    </Badge>
                                    <h2 className="text-xl font-black text-white">{showPreview.title}</h2>
                                    {showPreview.version && (
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Version {showPreview.version}</p>
                                    )}
                                </div>
                                <button onClick={() => setShowPreview(null)} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto max-h-[60vh]">
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono bg-black/30 p-4 rounded-xl">
                                        {showPreview.description}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
