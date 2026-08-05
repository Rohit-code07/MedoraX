import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Clock,
  BellRing,
  ChevronDown,
  Heart,
  ChevronRight,
  Star,
  CheckCircle2,
  Zap,
  Activity,
  Lock,
  Pill,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MedoraxLogo } from '../components/ui/MedoraxLogo';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Shared fade-up animation
───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const }
  })
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleCTA = () => {
    navigate(isAuthenticated ? '/dashboard' : '/auth');
  };

  /* ── Data ─────────────────────────────────────────────── */
  const stats = [
    { value: '98%', label: 'Adherence Accuracy' },
    { value: '2M+', label: 'Doses Tracked' },
    { value: '40K+', label: 'Active Patients' },
    { value: '4.9★', label: 'App Store Rating' },
  ];

  const features = [
    {
      icon: Clock,
      title: 'Smart Timing Schedules',
      description: 'Define reminders relative to meals or sleep cycles. Set daily, weekly, or custom recurrence patterns with zero friction.',
      gradient: 'from-blue-500/15 to-blue-600/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      border: 'border-blue-500/10'
    },
    {
      icon: BrainCircuit,
      title: 'AI Prescription Review',
      description: 'Upload prescriptions and let our neural OCR scanner detect conflicting dosages, drug interactions, or mismatch risks.',
      gradient: 'from-violet-500/15 to-violet-600/5',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      border: 'border-violet-500/10'
    },
    {
      icon: BellRing,
      title: 'Multichannel Alerts',
      description: 'Never miss a dose. Push alerts, alarm sounds, and SMS backups for every high-priority medication in your shelf.',
      gradient: 'from-teal-500/15 to-teal-600/5',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-500',
      border: 'border-teal-500/10'
    },
    {
      icon: ShieldCheck,
      title: 'HIPAA-Grade Security',
      description: 'AES-256 encryption at rest and in transit. FaceID locks and zero third-party health data sharing.',
      gradient: 'from-indigo-500/15 to-indigo-600/5',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      border: 'border-indigo-500/10'
    }
  ];

  const steps = [
    {
      number: '01',
      icon: Pill,
      title: 'Build Your Medicine Shelf',
      description: 'Input dosages, schedules, food constraints, and notes — or photo your pill bottle labels for instant OCR import.',
      color: 'text-blue-500'
    },
    {
      number: '02',
      icon: BrainCircuit,
      title: 'Scan Your Prescription',
      description: 'Drag-and-drop a PDF prescription to automatically analyse compatibility against your current medication stack.',
      color: 'text-violet-500'
    },
    {
      number: '03',
      icon: Activity,
      title: 'Receive AI Coaching',
      description: 'Chat with MedoraX AI for detailed breakdowns of side effects, interactions, and active compound profiles.',
      color: 'text-teal-500'
    }
  ];

  const testimonials = [
    {
      quote: "MedoraX solved my elderly mother's medication confusion overnight. The AI scan caught a critical dosage conflict between her new prescription and existing pills that we almost missed.",
      author: "Aditi Rao",
      role: "Caregiver & Product Manager",
      initials: "AR",
      rating: 5,
      avatarColor: 'from-blue-500 to-indigo-600'
    },
    {
      quote: "As a cardiologist, I rely on drug compliance. MedoraX's analytics makes it easy for patients to stay motivated and show me clear adherence logs during checkups.",
      author: "Dr. David Vance, MD",
      role: "Cardiologist, Mount Sinai",
      initials: "DV",
      rating: 5,
      avatarColor: 'from-teal-500 to-emerald-600'
    }
  ];

  const faqs = [
    {
      question: 'Is MedoraX a replacement for professional medical advice?',
      answer: 'No. MedoraX is a healthcare assistant and schedule coordinator. The information provided by our AI — including conflict alerts — should always be reviewed and confirmed by a licensed medical practitioner or pharmacist.'
    },
    {
      question: 'How secure is my health data on the platform?',
      answer: 'We employ AES-256 local database encryption. We do not sell or share your clinical details with insurers or advertising networks. Data storage is fully HIPAA compliant.'
    },
    {
      question: 'Can I link smart health tracking wearables to MedoraX?',
      answer: 'Yes! MedoraX integrates with Apple Health, Google Fit, Fitbit, and Withings to track vital statistics relative to your dosing schedule.'
    },
    {
      question: 'What happens if I miss a critical medication reminder?',
      answer: 'If a high-priority medication remains unchecked for more than 30 minutes, MedoraX can automatically notify your designated emergency contact via SMS.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-slate-800 dark:text-zinc-200 transition-colors duration-300 overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#09090B]/80 border-b border-slate-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-slate-950 dark:bg-zinc-900 flex items-center justify-center shadow-lg overflow-hidden ring-1 ring-blue-500/20">
              <MedoraxLogo size={32} />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-slate-900 dark:text-white">
              MedoraX
            </span>
            <Badge variant="info" size="sm" className="text-[9px] hidden sm:inline-flex">BETA</Badge>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Pricing', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-150 cursor-pointer hidden sm:block"
            >
              Log in
            </button>
            <Button
              onClick={handleCTA}
              size="sm"
              className="rounded-xl text-xs px-4 cursor-pointer shadow-md shadow-blue-500/20"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-blue-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-32 -left-40 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-3xl dark:bg-blue-500/8" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-violet-600/6 rounded-full blur-3xl dark:bg-violet-500/8" />
          {/* Dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-slate-900 dark:text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            className="lg:col-span-7 flex flex-col text-left"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            {/* Pill badge */}
            <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold tracking-wide w-max mb-8">
                <MedoraxLogo size={13} />
                <span>AI-Powered Healthcare Coordination</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] font-black text-slate-950 dark:text-white tracking-tight leading-[1.07] mb-6"
            >
              Your medications,{' '}
              <br className="hidden sm:block" />
              organized by{' '}
              <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 bg-clip-text text-transparent">
                intelligent AI
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="text-sm md:text-[15px] text-slate-500 dark:text-zinc-400 leading-relaxed max-w-[520px] mb-10"
            >
              The premium Medicine Reminder & AI Healthcare Assistant. Scan prescriptions for conflicts, chat with your AI health copilot, and track adherence with stunning dashboards.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-12"
            >
              <Button
                onClick={handleCTA}
                size="lg"
                className="w-full sm:w-auto shadow-xl shadow-blue-500/25 cursor-pointer rounded-xl"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start for Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto cursor-pointer rounded-xl"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How it works
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Lock, text: 'HIPAA Compliant' },
                { icon: ShieldCheck, text: 'AES-256 Encrypted' },
                { icon: Zap, text: 'Instant Setup' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                  <Icon className="w-3.5 h-3.5 text-teal-500" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: App Mockup Card */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow behind card */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/10 via-violet-500/8 to-teal-500/10 rounded-[40px] blur-2xl -z-10" />

            <div className="relative rounded-[24px] bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-700/40 shadow-2xl shadow-slate-300/30 dark:shadow-black/40 overflow-hidden">
              {/* Traffic light header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800/60 bg-slate-50/70 dark:bg-zinc-900/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-slate-900 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
                    <MedoraxLogo size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-widest uppercase">MedoraX Live</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Adherence bar */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">Today's Adherence</span>
                  <span className="text-[11px] font-black text-blue-500">94%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Medicine Cards */}
              <div className="px-5 pb-5 flex flex-col gap-3">
                {[
                  {
                    name: 'Lipitor (Atorvastatin)',
                    dose: '10mg · Daily after meal',
                    time: '08:00 AM',
                    iconBg: 'bg-blue-500/10',
                    iconColor: 'text-blue-500',
                    timeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    icon: Heart,
                    done: true
                  },
                  {
                    name: 'Metformin HCL',
                    dose: '500mg · Take with dinner',
                    time: '08:00 PM',
                    iconBg: 'bg-teal-500/10',
                    iconColor: 'text-teal-500',
                    timeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
                    icon: Pill,
                    done: false
                  },
                  {
                    name: 'Amlodipine',
                    dose: '5mg · Before bedtime',
                    time: '10:00 PM',
                    iconBg: 'bg-violet-500/10',
                    iconColor: 'text-violet-500',
                    timeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                    icon: Calendar,
                    done: false
                  }
                ].map((med, i) => {
                  const Icon = med.icon;
                  return (
                    <motion.div
                      key={med.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                        med.done
                          ? 'bg-slate-50/50 dark:bg-zinc-800/30 border-slate-100 dark:border-zinc-800/40 opacity-60'
                          : 'bg-white dark:bg-zinc-800/60 border-slate-200/60 dark:border-zinc-700/40 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${med.iconBg} ${med.iconColor} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-100">{med.name}</span>
                            {med.done && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{med.dose}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${med.timeBg}`}>{med.time}</span>
                    </motion.div>
                  );
                })}

                {/* AI analysis chip */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.9 }}
                  className="mt-1 p-3.5 rounded-xl bg-gradient-to-r from-blue-500/8 to-violet-500/8 dark:from-blue-500/12 dark:to-violet-500/12 border border-blue-500/15 dark:border-blue-500/20 flex gap-3 items-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                      AI Prescription Analyser
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase">Active</span>
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                      "Metformin dosage review recommended — 94% confidence match."
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <div className="border-y border-slate-200/70 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
              CORE FEATURES
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
              Designed for precision.{' '}
              <span className="text-slate-400 dark:text-zinc-500">Built for real patients.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i * 0.5}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <Card
                    hoverable
                    className={`h-full bg-white dark:bg-zinc-900/60 border ${f.border} dark:border-zinc-800/50 text-left overflow-hidden group`}
                  >
                    <CardContent className="p-6 flex flex-col h-full relative">
                      {/* Background gradient glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className={`relative z-10 w-11 h-11 rounded-xl ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-5`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="relative z-10 text-[13px] font-bold text-slate-900 dark:text-white mb-2">{f.title}</span>
                      <p className="relative z-10 text-[12px] text-slate-500 dark:text-zinc-500 leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-50/70 dark:bg-zinc-900/20 border-y border-slate-200/60 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left */}
          <motion.div
            className="lg:col-span-5"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
              3-STEP SETUP
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-5 leading-tight">
              Your clinical routine, organized in seconds.
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-8">
              We stripped away the clutter of traditional patient apps. MedoraX delivers clear paths to upload docs and watch schedules update dynamically.
            </p>
            <Button onClick={handleCTA} className="cursor-pointer rounded-xl shadow-md shadow-blue-500/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Free Account
            </Button>
          </motion.div>

          {/* Right: Steps */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  custom={i * 0.6}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="group flex gap-5 p-5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700/60 hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-300"
                >
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <span className="text-3xl font-black text-slate-200 dark:text-zinc-800 select-none leading-none">{step.number}</span>
                    <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center ${step.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mb-1.5">{step.title}</span>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center max-w-xl mx-auto mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">
              USER STORIES
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Trusted by clinicians and patients alike.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                variants={fadeUp}
                custom={i * 0.6}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/50 text-left">
                  <CardContent className="p-7 flex flex-col h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(t.rating)].map((_, si) => (
                        <Star key={si} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-7 flex-1">
                      "{t.quote}"
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-[11px] font-black shrink-0`}>
                        {t.initials}
                      </div>
                      <div>
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white block">{t.author}</span>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500">{t.role}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-slate-50/70 dark:bg-zinc-900/20 border-t border-slate-200/60 dark:border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">FAQ</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.4}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-blue-500/30 dark:border-blue-500/25 bg-blue-500/3 dark:bg-blue-500/5'
                      : 'border-slate-200/70 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className={`text-[13px] font-semibold transition-colors duration-150 ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-zinc-200'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'text-blue-500 rotate-180' : 'text-slate-400 dark:text-zinc-500'}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800/40 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative rounded-[28px] overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-left"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 30%, #4f46e5 70%, #7c3aed 100%)'
            }}
          >
            {/* Background grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>

            {/* Glow blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl translate-y-1/2" />

            <div className="relative z-10 flex flex-col gap-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-widest w-max border border-white/20">
                <Zap className="w-3 h-3" />
                Ready for peace of mind?
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Start monitoring your medical schedules today.
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed">
                Join thousands of patient families and healthcare professionals who trust MedoraX. Free onboarding takes under 3 minutes.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                {['No credit card required', 'Cancel anytime', 'HIPAA compliant'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-[11px] text-blue-200 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 shrink-0 w-full md:w-auto">
              <Button
                onClick={handleCTA}
                size="lg"
                className="w-full md:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-2xl shadow-black/20 cursor-pointer rounded-xl font-bold border-0"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Get Started Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/60 dark:border-zinc-800/50 bg-white dark:bg-[#0a0a0b] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-left">
            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-slate-950 dark:bg-zinc-900 flex items-center justify-center overflow-hidden ring-1 ring-blue-500/20">
                  <MedoraxLogo size={28} />
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">MedoraX</span>
              </div>
              <p className="text-[12px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                Empowering individuals with smart AI medicine scheduling, conflict validation, and clinical reminders.
              </p>
              <div className="flex gap-2 mt-1">
                {['🇺🇸 HIPAA', '🔒 SOC 2'].map(badge => (
                  <span key={badge} className="text-[9px] font-black px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: 'Product',
                links: ['Features', 'Security', 'AI Assistant', 'Pricing']
              },
              {
                title: 'Integrations',
                links: ['Apple Health', 'Google Fit', 'Fitbit Sync', 'Withings']
              },
              {
                title: 'Legal',
                links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy']
              }
            ].map(col => (
              <div key={col.title}>
                <span className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-300 block mb-4 uppercase tracking-wider">{col.title}</span>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[12px] text-slate-400 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors duration-150">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 dark:text-zinc-600">
              © 2026 MedoraX. All rights reserved.
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-600">
              <span>Made with</span>
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>in React & TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
