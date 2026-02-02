'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Mail, Lock, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                toast.success('Access granted. Welcome back, agent.');
                router.push('/dashboard');
            } else {
                console.log(result);
                setError('Authentication incomplete. Please check your credentials.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.errors?.[0]?.message || 'Invalid credentials or access denied.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isLoaded) return;

        // If already signed in, redirect to dashboard
        if (isSignedIn || signIn.status === 'complete') {
            router.push('/dashboard');
            return;
        }

        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
            });
        } catch (err: any) {
            console.error('Google login error:', err);
            // If the error suggests already signed in, redirect
            if (err.errors?.[0]?.code === 'session_exists') {
                router.push('/dashboard');
                return;
            }
            toast.error('Failed to initialize Google authentication.');
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/5 border-white/10 shadow-premium rounded-[2.5rem] overflow-hidden backdrop-blur-xl relative">
                    {/* Decorative glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

                    <CardHeader className="space-y-3 p-10 pb-6 relative z-10">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-4xl font-black text-center text-white tracking-tighter uppercase leading-tight">
                            Identity<br />Verified
                        </CardTitle>
                        <CardDescription className="text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Secure access to your decision neural network
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit} className="relative z-10">
                        <CardContent className="grid gap-5 p-10 py-0">
                            <div className="grid gap-4">
                                <Input
                                    id="email"
                                    type="email"
                                    label="Neural ID (Email)"
                                    placeholder="agent@decisionmemory.ai"
                                    className="h-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <Input
                                    id="password"
                                    type="password"
                                    label="Access Key"
                                    placeholder="••••••••"
                                    className="h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 mt-1"
                                    >
                                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                                        <p className="text-[11px] font-bold text-red-400 leading-snug uppercase tracking-tight">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 mt-2 rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow transition-all active:scale-95 group overflow-hidden relative z-20 touch-manipulation cursor-pointer"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Initiate Session
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </Button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                    <span className="bg-[#0b0b0b] px-4 text-gray-500">SSO Protocols</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-3 relative z-20 touch-manipulation cursor-pointer"
                            >
                                <Chrome className="h-5 w-5 text-gray-400" />
                                Google Authentication
                            </Button>
                        </CardContent>
                    </form>

                    <CardFooter className="flex flex-wrap items-center justify-center p-10 pt-8 relative z-10">
                        <div className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                            New Operative?{' '}
                            <Link href="/signup" className="text-primary hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                                Create Identity
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
