'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Mail, Lock, User, Chrome, ArrowRight, AlertCircle, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError(null);

        try {
            await signUp.create({
                emailAddress: email,
                password,
                firstName: name,
            });

            // Start the verification process
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
            toast.success('Neural handshake initiated. Check your inbox for the terminal code.');
        } catch (err: any) {
            console.error('Signup error:', err);
            const errorMessage = err.errors?.[0]?.message || 'Initialization failed. Please check your data.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError(null);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status !== 'complete') {
                console.log(JSON.stringify(completeSignUp, null, 2));
                setError('Verification incomplete. Security protocol active.');
            } else {
                await setActive({ session: completeSignUp.createdSessionId });
                toast.success('Identity verified. Welcome to the collective.');
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            const errorMessage = err.errors?.[0]?.message || 'Invalid verification code.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        if (!isLoaded) return;
        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
            });
        } catch (err: any) {
            console.error('Google signup error:', err);
            toast.error('Failed to initialize Google registration.');
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/5 border-white/10 shadow-premium rounded-[2.5rem] overflow-hidden backdrop-blur-xl relative">
                    {/* Decorative glow */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

                    <CardHeader className="space-y-3 p-10 pb-6 relative z-10 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">
                            {pendingVerification ? 'Verification' : 'Initialize'}
                        </CardTitle>
                        <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            {pendingVerification
                                ? 'Submit the decryption code sent to your terminal'
                                : 'Create your neural workspace to start logging traces'}
                        </CardDescription>
                    </CardHeader>

                    {!pendingVerification ? (
                        <form onSubmit={handleSubmit} className="relative z-10">
                            <CardContent className="grid gap-5 p-10 py-0">
                                <div className="grid gap-4">
                                    <Input
                                        id="name"
                                        type="text"
                                        label="Operator Name"
                                        placeholder="Agent Smith"
                                        className="h-12"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
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
                                            className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3"
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
                                    className="w-full h-14 mt-2 rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow transition-all active:scale-95 group"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Initialize Account
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </Button>

                                {/* Target for Clerk Bot Protection */}
                                <div id="clerk-captcha" className="mt-2" />

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/5" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                        <span className="bg-[#0b0b0b] px-4 text-gray-500">Neural Bridge</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleSignup}
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Chrome className="h-5 w-5 text-gray-400" />
                                    Google Registration
                                </Button>
                            </CardContent>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="relative z-10">
                            <CardContent className="grid gap-6 p-10 py-0">
                                <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] text-center space-y-4">
                                    <Fingerprint className="w-12 h-12 text-primary mx-auto opacity-50" />
                                    <p className="text-xs text-gray-400 font-medium">
                                        Enter the verification code sent to <br />
                                        <span className="text-white font-bold">{email}</span>
                                    </p>
                                </div>

                                <Input
                                    id="code"
                                    type="text"
                                    label="Security Code"
                                    placeholder="000000"
                                    className="h-14 text-center text-2xl tracking-[0.5em] font-black"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow transition-all active:scale-95"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Identity'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => setPendingVerification(false)}
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                                >
                                    Wrong email? Reset handshake
                                </button>
                            </CardContent>
                        </form>
                    )}

                    <CardFooter className="flex flex-wrap items-center justify-center p-10 pt-8 relative z-10">
                        <div className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                            Existing operative?{' '}
                            <Link href="/login" className="text-primary hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                                Secure Access
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
