'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    CreditCard,
    Globe,
    Zap,
    Shield,
    Save,
    Trash2,
    DollarSign,
    RefreshCw,
    Info,
    AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

interface PriceConfig {
    id: string;
    planTier: string;
    countryCode: string | null;
    amount: number;
    currency: string;
}

const tiers = [
    { id: 'PRO', label: 'Pro Operative', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'TEAM', label: 'Tactical Team', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'ENTERPRISE', label: 'Global Matrix', color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

export default function PricingClient() {
    const [planTier, setPlanTier] = useState('PRO');
    const [amount, setAmount] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [prices, setPrices] = useState<PriceConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const fetchPrices = async () => {
        try {
            const res = await apiRequest<{ data: PriceConfig[] }>('/admin/pricing');
            setPrices(res.data);
        } catch (err) {
            console.error("Failed to fetch prices", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchPrices();
    }, []);

    const handleSavePrice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        setIsSaving(true);
        try {
            await apiRequest('/admin/pricing', {
                method: 'POST',
                body: JSON.stringify({
                    planTier,
                    amount: parseFloat(amount),
                    countryCode: countryCode || undefined,
                    currency
                })
            });

            toast.success(`${planTier} price matrix updated.`);
            setAmount('');
            setCountryCode('');
            fetchPrices();
        } catch (err) {
            console.error("Pricing update failed", err);
            toast.error("Price calibration failed. Matrix stabilized at previous values.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePrice = async (id: string) => {
        try {
            await apiRequest(`/admin/pricing/${id}`, { method: 'DELETE' });
            toast.success("Price configuration deleted.");
            setPrices(prices.filter(p => p.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete price configuration.");
        }
    };

    const handleResetPrices = async () => {
        setIsResetting(true);
        try {
            const res = await apiRequest<{ data: PriceConfig[] }>('/admin/pricing/reset', { method: 'POST' });
            setPrices(res.data);
            toast.success("Pricing matrix reset to factory defaults.");
        } catch (err) {
            console.error("Reset failed", err);
            toast.error("Failed to reset pricing matrix.");
        } finally {
            setIsResetting(false);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'PRO': return 'text-amber-400';
            case 'TEAM': return 'text-blue-400';
            case 'ENTERPRISE': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                            <CreditCard className="text-emerald-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Licensed Pricing</h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">Adjust frequency of credit exchange across global sectors</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleResetPrices}
                    disabled={isResetting}
                    className="border-white/5 text-[10px] font-black uppercase tracking-widest text-[#8b949e] hover:border-red-500/20 hover:text-red-400"
                >
                    {isResetting ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <RefreshCw size={14} className="mr-2" />}
                    Reset to Default
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Price Editor */}
                <Card className="lg:col-span-1 p-8 bg-[#0d1117] border-white/5 space-y-6 self-start">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Licensing Tier</label>
                        <div className="space-y-2">
                            {tiers.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setPlanTier(t.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${planTier === t.id
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${planTier === t.id ? (t.id === 'PRO' ? 'bg-amber-400' : t.id === 'TEAM' ? 'bg-blue-400' : 'bg-purple-400') : 'bg-gray-700'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                    </div>
                                    <Zap size={14} className={planTier === t.id ? t.color : 'opacity-0'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Regional Sector (ISO)</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <Input
                                placeholder="Global (Leave empty)"
                                className="bg-black/50 border-white/10 text-white pl-11 h-12 uppercase"
                                maxLength={2}
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Exchange Rate (Amount)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="bg-black/50 border-white/10 text-white pl-11 h-12"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleSavePrice}
                        disabled={isSaving || !amount}
                        className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white hover:shadow-glow disabled:opacity-50"
                    >
                        {isSaving ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                        Apply Matrix Update
                    </Button>
                </Card>

                {/* Price Matrix Table */}
                <Card className="lg:col-span-2 p-8 bg-[#0d1117] border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Matrix Configurations</h3>
                        <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">Propagated</Badge>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : prices.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <AlertTriangle className="mx-auto mb-4 opacity-50" size={48} />
                            <p className="text-sm">No pricing configurations found</p>
                            <p className="text-[10px] mt-2">Use the editor to add prices or reset to defaults</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-white/5">
                                    <tr>
                                        <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sector</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tier</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Exchange</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {prices.map((row, i) => (
                                        <motion.tr
                                            key={row.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group transition-colors hover:bg-white/5"
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                        {row.countryCode ? row.countryCode : <Shield size={12} />}
                                                    </div>
                                                    <span className="text-xs font-bold text-white">{row.countryCode || 'Global'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <Badge variant="outline" className={`text-[9px] font-black border-white/10 ${getTierColor(row.planTier)}`}>
                                                    {row.planTier}
                                                </Badge>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-sm font-black text-white tracking-widest">${row.amount.toFixed(2)}</span>
                                                <span className="text-[10px] text-gray-500 ml-1">{row.currency}</span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => handleDeletePrice(row.id)}
                                                    className="p-2 text-gray-700 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-8 p-6 rounded-2xl bg-amber-400/5 border border-amber-400/10">
                        <div className="flex items-start gap-3">
                            <Info className="text-amber-400 mt-1 shrink-0" size={16} />
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                Regional sector pricing overrides the global matrix for that specific currency zone. Ensure ISO 3166-1 alpha-2 codes are used for sector identification.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
