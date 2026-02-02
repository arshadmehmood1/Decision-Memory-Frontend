'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    Activity,
    Users,
    CreditCard,
    DollarSign,
    Server,
    TrendingUp,
    TrendingDown,
    ShieldAlert,
    Clock,
    Zap,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    mrr: number;
    serverLoad: number;
    userGrowth: number;
    revenueGrowth: number;
    recentActivity: any[];
    chartData: any[];
    health: {
        status: string;
        dbLatency: string;
        cdnStatus: string;
        lastSync: string;
    };
}

export default function DashboardClient() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurging, setIsPurging] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadStats();
        const interval = setInterval(loadStats, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const res = await apiRequest<{ data: AdminStats }>('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Telemetry link failed", { description: "Failed to sync with global neural network." });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurgeCache = async () => {
        setIsPurging(true);
        try {
            await apiRequest('/admin/system/purge-cache', { method: 'POST' });
            toast.success("Global CDN matrix cleared.");
        } catch (err) {
            toast.error("Purge failed. Matrix persists.");
        } finally {
            setIsPurging(false);
        }
    };

    const handleToggleSystem = async () => {
        try {
            await apiRequest('/admin/system/toggle-maintenance', { method: 'POST' });
            toast.success("System status synchronized.");
            loadStats();
        } catch (err) {
            toast.error("Synchronization failed.");
        }
    };

    if (!mounted) return null;

    if (isLoading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Initializing Neural Link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Activity className="text-primary" size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Command Center</h1>
                </div>
                <p className="text-gray-500 text-sm font-medium tracking-wide">Real-time telemetry of the global neural network</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-[#0d1117] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Operatives</p>
                        <h3 className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-widest">
                                <TrendingUp size={10} className="mr-1" />
                                {stats.userGrowth}%
                            </Badge>
                            <span className="text-[10px] text-gray-500">vs last week</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-[#0d1117] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={64} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Monthly Yield (MRR)</p>
                        <h3 className="text-3xl font-black text-white">${stats.mrr.toLocaleString()}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-widest">
                                <TrendingUp size={10} className="mr-1" />
                                {stats.revenueGrowth}%
                            </Badge>
                            <span className="text-[10px] text-gray-500">vs last month</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-[#0d1117] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={64} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Sessions</p>
                        <h3 className="text-3xl font-black text-white">{stats.activeUsers.toLocaleString()}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full bg-gray-700 border border-[#0d1117]" />
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-500 ml-1">Live now</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-[#0d1117] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server size={64} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">System Load</p>
                        <h3 className="text-3xl font-black text-white">{stats.serverLoad}%</h3>
                        <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${stats.serverLoad}%` }} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <Card className="lg:col-span-2 p-6 bg-[#0d1117] border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Growth Trajectory</h3>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase bg-white/5 text-white">7D</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-gray-500 hover:text-white">30D</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-gray-500 hover:text-white">All</Button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#374151" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                                <YAxis dataKey="revenue" stroke="#374151" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(value: number) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-1 p-6 bg-[#0d1117] border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">System Feed</h3>
                        <Activity size={14} className="text-primary animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        {stats.recentActivity.map((item: any, i: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4 relative"
                            >
                                <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-white/5 last:hidden" />
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${item.type === 'ALERT' ? 'bg-red-500/10 text-red-500' :
                                    item.type === 'SUB_UPGRADE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {item.type === 'ALERT' ? <ShieldAlert size={18} /> :
                                        item.type === 'SUB_UPGRADE' ? <Zap size={18} /> : <Users size={18} />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white leading-tight">
                                        {item.type === 'USER_JOINED' && `New operative ${item.user} initialized`}
                                        {item.type === 'SUB_UPGRADE' && `${item.user} upgraded to ${item.plan}`}
                                        {item.type === 'ALERT' && item.message}
                                    </p>
                                    <p className="text-[10px] font-medium text-gray-500 mt-1 flex items-center gap-1">
                                        <Clock size={10} /> {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest border-white/5 text-gray-500 hover:text-white">
                        View Full Logs
                    </Button>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                <Button
                    onClick={handlePurgeCache}
                    disabled={isPurging}
                    className="h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center gap-3 shrink-0"
                >
                    <Globe className={isPurging ? "text-blue-400 animate-spin" : "text-blue-400"} size={20} />
                    <div className="text-left">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global CDN</p>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{isPurging ? 'Purging...' : 'Purge Cache'}</p>
                    </div>
                </Button>
                <Button
                    onClick={handleToggleSystem}
                    className="h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center gap-3 shrink-0"
                >
                    <Zap className="text-emerald-400" size={20} />
                    <div className="text-left">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">System Status</p>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{stats.health.status === 'HEALTHY' ? 'All Systems Normal' : 'Maintenance Active'}</p>
                    </div>
                </Button>
                <Button className="h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center gap-3 shrink-0">
                    <Server className="text-purple-400" size={20} />
                    <div className="text-left">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Database</p>
                        <p className="text-xs font-black text-white uppercase tracking-wider">Latence: {stats.health.dbLatency}</p>
                    </div>
                </Button>
            </div>
        </div>
    );
}
