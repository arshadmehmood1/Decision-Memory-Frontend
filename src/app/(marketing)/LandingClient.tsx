'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  BrainCircuit,
  ChevronRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Target,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  Repeat,
  Layout,
  Search,
  Check,
  TrendingUp,
  X,
  Menu
} from 'lucide-react';
import { MarketingNavbar } from '@/components/layout/MarketingNavbar';
import { Footer } from '@/components/layout/Footer';
import { NeuronBackground } from '@/components/ui/NeuronBackground';
import { DecisionCard } from '@/components/decisions/DecisionCard';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

const TESTIMONIALS = [
  {
    quote: "We used to argue about why we chose Postgres over Mongo for weeks. Now I just drop the Decision Memory link in Slack and the debate ends. It's lowered our meeting load by 30%.",
    name: "Alex V.",
    role: "CTO @ Streamline",
    avatar: "/images/avatar_1.png"
  },
  {
    quote: "I didn't realize how much knowledge walked out the door with our last VP of Engineering until we looked for the 'why' behind our pricing structure. Never again.",
    name: "J. Thorne",
    role: "Founder, Series A Fintech",
    avatar: "/images/avatar_2.png"
  },
  {
    quote: "The 'Blindspot Analysis' is actually scary good. It flagged that I was ignoring the maintenance cost of a new tool because I was biased by the sales demo. Saved us $20k.",
    name: "Sarah Jenkins",
    role: "Product Lead",
    avatar: "/images/avatar_3.png"
  }
];

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [publicDecisions, setPublicDecisions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${baseUrl}/public/community`);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPublicDecisions(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch public community data:", err);
        // Fallback or silent fail for landing page
      }
    };
    fetchPublic();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-black uppercase tracking-widest animate-pulse-subtle"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow" />
              <span>Now in Public Beta</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]"
            >
              Building Your <br />
              <span className="gradient-text">Institutional Brain.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl text-gray-200 leading-tight max-w-3xl mx-auto font-medium"
            >
              High-velocity teams make fast decisions. <br className="hidden md:block" />
              <span className="text-gray-400">Great teams remember <em>why</em>.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/signup">
                <Button className="h-16 px-10 rounded-2xl shadow-glow font-black text-lg uppercase tracking-widest transition-all active:scale-95 group bg-white text-black hover:bg-gray-200 border-none">
                  Start Logging
                  <ChevronRight size={22} className="ml-2 mt-0.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="#how-it-works">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 shadow-soft font-black text-lg uppercase tracking-widest transition-all active:scale-95 text-white">
                  <Zap size={20} className="mr-2 text-yellow-400" />
                  See Example
                </Button>
              </Link>
            </motion.div>

            <div className="pt-4 text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-3">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-500" /> Free for individuals
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-800" />
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-blue-500" /> SOC2 Compliant
              </span>
            </div>
          </div>

          {/* Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.3 }}
            className="mt-24 relative max-w-6xl mx-auto px-4"
          >
            <div className="bg-white/5 p-2 rounded-[2.5rem] shadow-glow border border-white/10 overflow-hidden group backdrop-blur-3xl">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/10 shadow-inner">
                <Image
                  src="/images/dashboard_hero.png"
                  alt="Dashboard Mockup"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-20 md:py-32 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Founders Make Fast Decisions. <br />
              <span className="text-blue-500">Then Forget Why.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Decision Amnesia",
                desc: "You switched tools 6mo ago. Now switching back. Why? Nobody remembers.",
                icon: AlertCircle,
                color: "red"
              },
              {
                title: "Co-Founder Arguments",
                desc: "Different memories of the same decision. Waste hours in circular debates.",
                icon: MessageSquare,
                color: "red"
              },
              {
                title: "Repeat Mistakes",
                desc: "Same pricing mistake 3x because the lesson wasn't documented.",
                icon: Repeat,
                color: "red"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ ...fadeIn.transition, delay: idx * 0.1 }}
              >
                <Card className="p-10 border-none group hover:scale-[1.02] transition-all bg-white shadow-soft">
                  <div className="icon-badge-red mb-8 group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Solution Section */}
      <section id="features" className="relative py-20 md:py-32 bg-neutral-900/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              What If Every Decision Was Reviewable, <br />
              <span className="gradient-text">and Learned From?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Structured Log",
                desc: "Capture context, alternatives, and assumptions in a rigid format that scales.",
                icon: Zap
              },
              {
                title: "Regret Analysis",
                desc: "Mark failed choices. Analyze what went wrong and build a 'Mistake Repository'.",
                icon: ShieldCheck
              },
              {
                title: "AI Insights",
                desc: "Identify your cognitive blindspots and patterns across hundreds of logs.",
                icon: BrainCircuit
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ ...fadeIn.transition, delay: idx * 0.1 }}
              >
                <Card className="p-10 border-transparent shadow-premium group hover:-translate-y-2 transition-all bg-white">
                  <div className="icon-badge-blue mb-8 group-hover:rotate-[10deg] transition-transform duration-300">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Preview Section */}
      {publicDecisions.length > 0 && (
        <section className="relative py-20 md:py-32 bg-black overflow-hidden border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div {...fadeIn} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Learned from <br />
                  <span className="text-primary italic">Global Intelligence.</span>
                </h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Recently shared neural traces from our users</p>
              </div>
              <Link href="/community">
                <Button variant="outline" className="h-14 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs">
                  View All Traces <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {publicDecisions.map((decision, idx) => (
                <motion.div
                  key={decision.id}
                  {...fadeIn}
                  transition={{ ...fadeIn.transition, delay: idx * 0.1 }}
                >
                  <DecisionCard decision={decision} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 md:py-32 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">How It Works</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Connector */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {[
                { step: "1", title: "Log Decision", desc: "Create a decision entry in 60 seconds with our guided template." },
                { step: "2", title: "Add Context", desc: "Capture why, alternatives considered, and key assumptions." },
                { step: "3", title: "Update Outcome", desc: "Mark success/failure and reflect on the result 3-6 months later." },
                { step: "4", title: "Get AI Insights", desc: "Identify patterns and blindspots across your decision history." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-blue-500/20 relative z-10">
                    {item.step}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-white">{item.title}</h4>
                    <p className="text-gray-200 font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-20 md:py-32 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">What {billingCycle === 'annually' ? 'Power' : ''} Founders Are Saying</h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 md:p-20 text-center space-y-6 md:space-y-10 bg-white/5 border border-white/10 shadow-premium relative">
                  <MessageSquare size={80} className="absolute top-4 left-4 md:top-10 md:left-10 text-gray-200 pointer-events-none opacity-50 hidden sm:block" />
                  <p className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                    "{TESTIMONIALS[activeTestimonial].quote}"
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-glow">
                      <Image
                        src={TESTIMONIALS[activeTestimonial].avatar}
                        alt={TESTIMONIALS[activeTestimonial].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">{TESTIMONIALS[activeTestimonial].name}</div>
                      <div className="text-blue-300 font-bold uppercase tracking-widest text-xs">{TESTIMONIALS[activeTestimonial].role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-12">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-12 h-2 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'bg-primary w-20' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 bg-black/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Simple, Transparent Pricing</h2>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold uppercase transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
                className="w-16 h-8 bg-white/10 rounded-full p-1 relative transition-all hover:bg-white/20 border border-white/10"
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-glow"
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                />
              </button>
              <span className={`text-sm font-bold uppercase transition-colors ${billingCycle === 'annually' ? 'text-white' : 'text-gray-500'}`}>Annually (Save 20%)</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
            {/* Free Plan */}
            <Card className="p-10 border-none shadow-soft bg-white/5 border border-white/10">
              <div className="space-y-6 mb-10">
                <h3 className="text-xl font-black uppercase tracking-widest text-blue-400">Free</h3>
                <div className="text-5xl font-black text-white">$0</div>
                <p className="text-gray-300 font-bold">Try Decision Memory for your small team.</p>
              </div>
              <div className="space-y-4 mb-10">
                <ul className="space-y-4">
                  {['Unlimited decision logs', 'AI blindspot analysis', 'Outcome tracking', 'Basic trace views'].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white font-bold">
                      <Check size={20} className="text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup">
                <Button className="w-full rounded-2xl h-14 text-lg">Start Free</Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            {/* Pro Plan */}
            <Card className="p-10 border-primary border-2 shadow-premium bg-white/5 relative z-10 md:scale-105 ring-1 ring-blue-500/50">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Startup</h3>
                  <p className="text-blue-100 font-bold tracking-tight">Perfect for solo founders and early-stage teams.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">${billingCycle === 'monthly' ? '29' : '23'}</span>
                  <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">/mo</span>
                </div>
                <p className="text-gray-300 font-bold">Scale your decision intelligence system.</p>
              </div>
              <div className="space-y-4 mb-10 mt-10">
                {[
                  "Unlimited decisions",
                  "Everything in Free+",
                  "Full AI blindspot analysis",
                  "Custom tags & categories",
                  "Export to PDF/JSON",
                  "Priority support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-white">
                    <Check className="text-primary" size={18} />
                    {feature}
                  </div>
                ))}
              </div>
              <Button className="w-full rounded-2xl h-16 text-xl shadow-xl shadow-blue-500/25">Start 7-Day Trial</Button>
            </Card>

            {/* Team Plan */}
            <Card className="p-10 border-none shadow-soft bg-white/5 border border-white/10 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Badge className="bg-primary hover:bg-primary-hover text-white border-0 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-glow">
                  Most Popular
                </Badge>
              </div>
              <div className="p-8 md:p-12 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Scale</h3>
                  <p className="text-white font-bold tracking-tight">For growing organizations that take decisions seriously.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">${billingCycle === 'monthly' ? '99' : '79'}</span>
                  <span className="text-blue-300 font-bold uppercase tracking-widest text-sm">/mo</span>
                </div>
                <ul className="space-y-4">
                  {['Everything in Startup', 'Team collaboration', 'Trend analysis', 'Priority support', 'Advanced AI insights'].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white font-bold">
                      <Check size={20} className="text-white" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="mailto:sales@decisionmemory.ai">
                <Button variant="outline" className="w-full rounded-2xl h-14 text-lg">Contact Sales</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn}
          >
            <Card className="cta-gradient p-10 md:p-32 rounded-[2rem] md:rounded-[4rem] text-center space-y-8 md:space-y-10 shadow-glow rounded-[2rem] md:rounded-[4rem] overflow-hidden relative group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

              <div className="relative z-10 space-y-8 md:space-y-10">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-none">
                  Build Your <br />
                  <span className="text-blue-400">Institutional Memory</span>
                </h2>
                <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium">
                  Join 300+ founders who have stopped repeating mistakes and started making data-driven decisions.
                </p>
                <div className="pt-4 md:pt-8 flex flex-col items-center gap-6">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-white text-primary hover:bg-blue-50 text-xl md:text-2xl font-black h-16 md:h-20 px-8 md:px-16 rounded-xl md:rounded-[2rem] shadow-2xl w-full">
                      Start Logging Now →
                    </Button>
                  </Link>
                  <div className="text-blue-100 font-bold uppercase tracking-widest text-sm">
                    No credit card required. Cancel anytime.
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </ >
  );
}
