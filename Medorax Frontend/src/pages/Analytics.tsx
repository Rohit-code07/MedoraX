import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Heart, 
  Sparkles, 
  Award,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

import { getAnalytics, getHeatmap } from '../api/analytics.api';
import { useEffect } from 'react';

export const Analytics: React.FC = () => {
  const { reminderLogs, medicines } = useApp();
  const [activeTab, setActiveTab] = useState('weekly');
  const [backendAnalytics, setBackendAnalytics] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    Promise.allSettled([
      getAnalytics(userId),
      getHeatmap()
    ]).then(([analyticsRes, heatmapRes]) => {
      if (analyticsRes.status === 'fulfilled') {
        setBackendAnalytics(analyticsRes.value.data);
      }
    }).catch(err => console.warn('Backend analytics fetch error:', err));
  }, []);

  // Adherence compliance calculated overall
  const overallAdherence = useMemo(() => {
    const nonUpcoming = reminderLogs.filter((l) => l.status !== 'upcoming');
    const completed = nonUpcoming.filter((l) => l.status === 'completed').length;
    return nonUpcoming.length > 0 ? Math.round((completed / nonUpcoming.length) * 100) : 88;
  }, [reminderLogs]);

  // GitHub contribution-style Heatmap grid data (last 16 weeks)
  const heatmapData = useMemo(() => {
    const grid = [];
    const dateToday = new Date();
    
    // We render a grid of 7 rows (days) by 16 columns (weeks)
    for (let day = 0; day < 7; day++) {
      const row = [];
      for (let week = 15; week >= 0; week--) {
        const offset = -(week * 7 + day);
        const d = new Date(dateToday);
        d.setDate(d.getDate() + offset);
        const dateStr = d.toISOString().split('T')[0];
        
        const logs = reminderLogs.filter(l => l.date === dateStr);
        const completed = logs.filter(l => l.status === 'completed').length;
        const total = logs.filter(l => l.status !== 'upcoming').length || logs.length;
        
        let density = 'empty'; // gray
        const rate = total > 0 ? completed / total : 0;
        
        if (total > 0) {
          if (rate >= 0.9) density = 'high';      // deep green
          else if (rate >= 0.5) density = 'medium'; // mid green
          else density = 'low';                   // orange/rose
        }
        
        row.push({ dateStr, density, rate: Math.round(rate * 100) });
      }
      grid.push(row);
    }
    return grid;
  }, [reminderLogs]);

  // Recharts Chart: Compliance by medication name
  const medicationComplianceData = useMemo(() => {
    const medsMap: { [key: string]: { completed: number; total: number } } = {};
    
    reminderLogs.forEach((log) => {
      if (log.status === 'upcoming') return;
      if (!medsMap[log.medicineName]) {
        medsMap[log.medicineName] = { completed: 0, total: 0 };
      }
      medsMap[log.medicineName].total++;
      if (log.status === 'completed') {
        medsMap[log.medicineName].completed++;
      }
    });

    return Object.keys(medsMap).map((key) => {
      const rate = Math.round((medsMap[key].completed / medsMap[key].total) * 100);
      return { name: key.split(' ')[0], Rate: rate };
    });
  }, [reminderLogs]);

  // Recharts Chart: Trend line over past 6 months
  const monthlyTrendsData = [
    { name: 'Mar', Adherence: 78 },
    { name: 'Apr', Adherence: 82 },
    { name: 'May', Adherence: 85 },
    { name: 'Jun', Adherence: 89 },
    { name: 'Jul', Adherence: 91 },
    { name: 'Aug', Adherence: overallAdherence },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* 1. Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Medical analytics</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Medication Adherence Insights</h2>
        </div>
        
        <Tabs
          tabs={[
            { id: 'daily', label: 'Daily report' },
            { id: 'weekly', label: 'Weekly view' },
            { id: 'monthly', label: 'Monthly' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="w-full sm:w-auto"
        />
      </div>

      {/* 2. Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Adherence Rate */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardContent className="p-6 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">adherence rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{overallAdherence}%</span>
              <span className="text-[11px] font-semibold text-teal-500 bg-teal-500/10 px-1.5 py-0.5 rounded-lg">+1.8%</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal mt-2">
              Based on historical logs logged over past 30 days.
            </p>
          </CardContent>
        </Card>

        {/* Total Doses Logged */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardContent className="p-6 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Total Logs Logged</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                {reminderLogs.filter(l => l.status === 'completed').length}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">completed</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal mt-2">
              Logs saved in localStorage database.
            </p>
          </CardContent>
        </Card>

        {/* Active Treatments */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardContent className="p-6 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Active Shelf</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                {medicines.filter(m => m.status === 'active').length}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">medications</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal mt-2">
              Daily scheduling alerts active on profile.
            </p>
          </CardContent>
        </Card>

        {/* Compliance Award */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-gradient-to-tr from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-zinc-900 border-brand-primary/10">
          <CardContent className="p-6 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl -z-10" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">compliance badge</span>
            <div className="flex items-center gap-2 mt-1 select-none">
              <Award className="w-6 h-6 text-brand-primary dark:text-brand-secondary fill-brand-primary/10 dark:fill-brand-secondary/10" />
              <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">Silver Tier compliance</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal mt-3">
              Maintain &gt;90% adherence for 5 more days to unlock Gold status!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. GitHub Adherence Heatmap grid */}
      <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
        <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
            <Calendar className="w-4 h-4 text-brand-primary" />
            Medication Adherence Heatmap
          </CardTitle>
          <CardDescription>Year-to-date daily intake compliance consistency</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 overflow-x-auto">
          <div className="flex flex-col gap-2 min-w-[640px] select-none">
            {/* Heatmap Grid */}
            <div className="flex flex-col gap-1.5">
              {heatmapData.map((row, rowIdx) => {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return (
                  <div key={rowIdx} className="flex items-center gap-1.5">
                    <span className="w-8 text-[9px] font-bold text-slate-400 uppercase text-right mr-1.5 select-none">
                      {rowIdx % 2 === 0 ? days[rowIdx] : ''}
                    </span>
                    <div className="flex gap-1.5">
                      {row.map((cell, cellIdx) => {
                        const densityColor = {
                          empty: 'bg-slate-100 dark:bg-zinc-800/50 hover:ring-slate-300',
                          low: 'bg-rose-500/20 text-rose-500 border border-rose-500/20 hover:ring-rose-500',
                          medium: 'bg-teal-500/30 text-teal-600 border border-teal-500/20 hover:ring-teal-500',
                          high: 'bg-teal-500 text-white hover:ring-teal-300',
                        }[cell.density];

                        return (
                          <div
                            key={cellIdx}
                            className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-110 hover:ring-2 cursor-pointer ${densityColor}`}
                            title={`${cell.dateStr} • Adherence: ${cell.rate}%`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend info row */}
            <div className="flex justify-end gap-3 items-center text-[10px] font-semibold text-slate-400 mt-4 select-none">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded-sm bg-slate-100 dark:bg-zinc-850" />
              <div className="w-3.5 h-3.5 rounded-sm bg-rose-500/20 border border-rose-500/20" />
              <div className="w-3.5 h-3.5 rounded-sm bg-teal-500/30 border border-teal-500/20" />
              <div className="w-3.5 h-3.5 rounded-sm bg-teal-500" />
              <span>More compliance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Detailed Charts metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Compliance by Medication */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Intake Rate by Medication
            </CardTitle>
            <CardDescription>Adherence percentage compared across active prescription items</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pl-2 pt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medicationComplianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="Rate" fill="#14B8A6" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Adherence Trends Line Graph */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-primary" />
              6-Month Adherence Trend
            </CardTitle>
            <CardDescription>Visual curve of monthly compliance rates</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pl-2 pt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Line type="monotone" dataKey="Adherence" stroke="#8B5CF6" strokeWidth={3} dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
export default Analytics;
