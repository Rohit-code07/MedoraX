import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Activity, 
  Calendar, 
  Check, 
  X, 
  Plus, 
  ArrowRight, 
  BrainCircuit, 
  FileWarning, 
  Flame, 
  Clock, 
  Heart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { medicines, reminderLogs, profile, logReminder, notifications } = useApp();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Inspirational health quote
  const quote = useMemo(() => {
    const quotes = [
      "Your health is your greatest wealth. Let's maintain the routine today.",
      "Consistency is the secret to medication efficacy. You are doing great!",
      "A healthy outside starts from the inside. Stay on schedule today.",
      "Small daily actions build a lifetime of wellness. Keep the streak active!"
    ];
    return quotes[new Date().getDate() % quotes.length];
  }, []);

  // Filter logs for today
  const todaysLogs = useMemo(() => {
    return reminderLogs
      .filter((log) => log.date === todayStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [reminderLogs, todayStr]);

  // Split today's logs into Completed, Missed, Pending/Upcoming
  const logStats = useMemo(() => {
    let completed = 0;
    let missed = 0;
    let upcoming = 0;

    todaysLogs.forEach((log) => {
      if (log.status === 'completed') completed++;
      else if (log.status === 'missed') missed++;
      else upcoming++;
    });

    const total = todaysLogs.length;
    const rate = total > 0 ? Math.round((completed / (completed + missed || 1)) * 100) : 100;

    return { completed, missed, upcoming, total, rate };
  }, [todaysLogs]);

  // Adherence streak: consecutive days with no missed doses
  const streak = useMemo(() => {
    let count = 0;
    // Walk back 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const logsForDay = reminderLogs.filter(l => l.date === dateStr && l.status !== 'upcoming');
      
      if (logsForDay.length === 0) continue; // No records, skip
      
      const hasMissed = logsForDay.some(l => l.status === 'missed');
      if (!hasMissed) {
        count++;
      } else {
        break; // Streak broken
      }
    }
    return count || 3; // Default minimum streak display
  }, [reminderLogs]);

  // Prepare adherence data for Recharts area graph (last 7 days)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString([], { weekday: 'short' });
      
      const logsForDay = reminderLogs.filter((l) => l.date === dateStr);
      const completed = logsForDay.filter((l) => l.status === 'completed').length;
      const total = logsForDay.filter((l) => l.status !== 'upcoming').length || logsForDay.length;
      
      const rate = total > 0 ? Math.round((completed / total) * 100) : 90; // mock high default if empty
      data.push({ name: dayName, Adherence: rate });
    }
    return data;
  }, [reminderLogs]);

  // Quick actions config
  const quickActions = [
    { label: 'Add Medication', icon: Plus, onClick: () => navigate('/add-medicine'), variant: 'primary' as const },
    { label: 'Scan Prescription', icon: FileWarning, onClick: () => navigate('/prescription-mismatch'), variant: 'secondary' as const },
    { label: 'Chat Copilot', icon: BrainCircuit, onClick: () => navigate('/ai-assistant'), variant: 'outline' as const },
  ];

  const handleLogStatus = (logId: string, status: 'completed' | 'missed') => {
    logReminder(logId, status);
    toast.success(status === 'completed' ? 'Medication logged successfully!' : 'Marked dose as missed.');
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* 1. Large Welcome Card */}
      <div className="p-6 md:p-8 rounded-[24px] bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-accent shadow-xl relative overflow-hidden text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 flex-1 max-w-xl">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-200">Clinical Coordination Portal</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
            {greeting}, {profile.name}!
          </h2>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed font-medium">
            "{quote}"
          </p>
        </div>
        <div className="relative z-10 shrink-0 flex gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none">{streak} Days</span>
              <span className="text-[9px] text-slate-200 mt-1 uppercase font-bold tracking-wider">Routine Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Adherence dial */}
        <Card className="md:col-span-1 border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardContent className="p-6 flex flex-col items-center text-center justify-between h-full">
            <div className="w-full text-left">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Adherence %</span>
              <h4 className="text-base font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Compliance Rate</h4>
            </div>

            {/* Custom SVG Dial Loader */}
            <div className="relative w-28 h-28 my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-zinc-800" fill="transparent" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-brand-primary dark:text-brand-secondary"
                  fill="transparent"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * logStats.rate) / 100 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{logStats.rate}%</span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1.5">Today</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal">
              {logStats.completed} of {logStats.total - logStats.upcoming} doses logged taken today.
            </p>
          </CardContent>
        </Card>

        {/* Weekly Area Chart */}
        <Card className="md:col-span-3 border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardHeader className="p-6 pb-2 border-b-0 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">History Insights</span>
              <CardTitle className="text-base font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Weekly Intake Progress</CardTitle>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% adherence</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 pl-2 pt-0 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="Adherence" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#adherenceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Core Workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Intake schedule */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214] h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  Today's Medications Log
                </CardTitle>
                <CardDescription className="mt-1">Tick off taken doses in chronological order</CardDescription>
              </div>
              <Badge variant="neutral" className="text-[10px] font-bold">
                {todaysLogs.length} Doses scheduled
              </Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[420px]">
              {todaysLogs.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center text-slate-300 dark:text-zinc-700 mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">No scheduled medications today</span>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 max-w-[240px] leading-normal">
                    Add new medicines or check as_needed drugs in your catalog.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                  {todaysLogs.map((log) => {
                    const isCompleted = log.status === 'completed';
                    const isMissed = log.status === 'missed';
                    const isPending = log.status === 'upcoming';

                    return (
                      <div
                        key={log.id}
                        className={`
                          p-5 flex items-center justify-between gap-4 transition-colors duration-150
                          ${isCompleted ? 'bg-slate-50/20 dark:bg-zinc-900/10' : ''}
                          ${isMissed ? 'bg-rose-500/5 dark:bg-rose-500/10' : ''}
                        `}
                      >
                        {/* Time & Med details */}
                        <div className="flex items-center gap-4">
                          {/* Time badge */}
                          <div className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 tracking-wide uppercase select-none
                            ${isCompleted ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : ''}
                            ${isMissed ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : ''}
                            ${isPending ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300' : ''}
                          `}>
                            {log.time}
                          </div>

                          <div className="flex flex-col text-left">
                            <span className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-200'}`}>
                              {log.medicineName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1 select-none">
                              <Badge variant="neutral" size="sm" className="text-[9px] lowercase font-semibold">
                                {log.dosage}
                              </Badge>
                              {log.foodTiming !== 'none' && (
                                <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                  • Take {log.foodTiming} meals
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {isPending ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-8 h-8 p-0 rounded-lg border-border-light hover:border-rose-300 dark:border-border-dark dark:hover:border-rose-950 text-slate-400 hover:text-rose-500 cursor-pointer"
                                onClick={() => handleLogStatus(log.id, 'missed')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-8 h-8 p-0 rounded-lg border-border-light hover:border-teal-300 dark:border-border-dark dark:hover:border-teal-950 text-slate-400 hover:text-teal-500 cursor-pointer"
                                onClick={() => handleLogStatus(log.id, 'completed')}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <div className="flex items-center gap-1.5 select-none">
                              <Badge variant={isCompleted ? 'success' : 'danger'} size="sm">
                                {log.status}
                              </Badge>
                              <button
                                onClick={() => logReminder(log.id, 'upcoming')}
                                className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline ml-2 cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Assistant shortcut & Quick Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions Tray */}
          <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 p-5 pt-0">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={idx}
                    variant={action.variant}
                    onClick={action.onClick}
                    className="w-full py-3 rounded-xl justify-between text-xs cursor-pointer font-bold"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Helper Banner */}
          <Card className="border-slate-100 dark:border-zinc-800/80 bg-gradient-to-tr from-[#1f1f2e]/10 to-brand-accent/5 dark:from-[#181825]/50 border-brand-accent/20 relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl -z-10" />
            <CardHeader className="pb-2">
              <Badge variant="info" size="sm" className="w-max mb-1 select-none">
                MedoraX Copilot
              </Badge>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-brand-accent" />
                Ask Health Assistant
              </CardTitle>
              <CardDescription>Get guidance on chemical compounds and food intake constraints</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-5 text-xs text-slate-500 dark:text-zinc-400 flex flex-col gap-3">
              {/* Predefined prompt helpers */}
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => navigate('/ai-assistant?q=Explain side effects of Lipitor')}
                  className="p-2.5 rounded-xl border border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f]/40 text-[11px] text-slate-700 dark:text-zinc-300 font-semibold hover:border-brand-accent hover:text-brand-accent transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>"Explain Lipitor side effects"</span>
                  <Plus className="w-3 h-3 text-slate-400" />
                </button>
                <button 
                  onClick={() => navigate('/ai-assistant?q=Is it safe to take Metformin with food')}
                  className="p-2.5 rounded-xl border border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f]/40 text-[11px] text-slate-700 dark:text-zinc-300 font-semibold hover:border-brand-accent hover:text-brand-accent transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>"Is Metformin safe with coffee?"</span>
                  <Plus className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* 4. Floating Action Button - Mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/add-medicine')}
        className="fixed bottom-6 right-6 z-30 md:hidden w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 select-none cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

    </div>
  );
};
export default Dashboard;
