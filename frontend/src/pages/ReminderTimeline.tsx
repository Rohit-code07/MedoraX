import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { ReminderLog } from '../types';

export const ReminderTimeline: React.FC = () => {
  const { reminderLogs, medicines, logReminder } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Generate date list for horizontal calendar strip (7 days centered around selected date)
  const calendarDates = useMemo(() => {
    const dates = [];
    const baseDate = new Date(selectedDate);
    
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      const dayName = d.toLocaleDateString([], { weekday: 'short' });
      
      dates.push({ dateStr, dayNum, dayName });
    }
    return dates;
  }, [selectedDate]);

  // Handle date shifts
  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Filter logs for the selected date, dynamically including active medicine schedules
  const selectedDateLogs = useMemo(() => {
    const logsMap = new Map<string, ReminderLog>();
    
    // Existing database logs for selectedDate
    reminderLogs.forEach(l => {
      if (l.date === selectedDate) {
        logsMap.set(`${l.medicineId || l.medicineName}-${l.time}`, l);
      }
    });

    const result: ReminderLog[] = [...reminderLogs.filter(l => l.date === selectedDate)];

    // Inject schedule slots for active medicines if not logged yet for selectedDate
    medicines.forEach((med) => {
      if (med.status !== 'active') return;
      med.times.forEach((time) => {
        const key = `${med.id}-${time}`;
        if (!logsMap.has(key) && !result.some(l => (l.medicineId === med.id || l.medicineName === med.name) && l.time === time)) {
          result.push({
            id: `sch-${med.id}-${selectedDate}-${time.replace(':', '')}`,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            category: med.category,
            date: selectedDate,
            time: time,
            foodTiming: med.foodTiming,
            status: 'upcoming',
          });
        }
      });
    });

    return result.sort((a, b) => a.time.localeCompare(b.time));
  }, [reminderLogs, medicines, selectedDate]);

  // Derived stats for the selected date
  const stats = useMemo(() => {
    const total = selectedDateLogs.length;
    const completed = selectedDateLogs.filter((l) => l.status === 'completed').length;
    const missed = selectedDateLogs.filter((l) => l.status === 'missed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, missed, rate };
  }, [selectedDateLogs]);

  const handleStatusChange = (logId: string, status: 'completed' | 'missed') => {
    logReminder(logId, status);
    toast.success(status === 'completed' ? 'Dose logged successfully!' : 'Marked dose as missed.');
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Compliance logs</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Reminder Timeline Calendar</h2>
        </div>
        
        {/* Navigation controllers */}
        <div className="flex items-center gap-2 select-none">
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-0 rounded-xl cursor-pointer"
            onClick={() => shiftDate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-zinc-200">
            {new Date(selectedDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-0 rounded-xl cursor-pointer"
            onClick={() => shiftDate(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2. Horizontal Calendar Strip */}
      <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
        <CardContent className="p-4 flex justify-between items-center overflow-x-auto gap-2 no-scrollbar">
          {calendarDates.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            const isToday = item.dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`
                  relative flex flex-col items-center justify-center py-3.5 px-4 min-w-[56px] rounded-xl cursor-pointer select-none transition-all duration-200
                  ${isSelected 
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10' 
                    : 'bg-slate-50/50 hover:bg-slate-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
                  }
                `}
              >
                {/* sliding circle outline for selected */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedCalendarDay"
                    className="absolute inset-0 bg-brand-primary rounded-xl -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}

                <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                  {item.dayName}
                </span>
                
                <span className="text-sm font-extrabold mt-2 leading-none">
                  {item.dayNum}
                </span>

                {isToday && (
                  <span className={`
                    w-1.5 h-1.5 rounded-full mt-1.5
                    ${isSelected ? 'bg-white' : 'bg-brand-primary'}
                  `} />
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* 3. Daily Completion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Compliance statistics card */}
        <Card className="md:col-span-1 border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardContent className="p-6 flex flex-col justify-between h-full gap-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Selected date stats</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1">Intake Compliance</h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-zinc-400 select-none">
                <span>Taken Doses</span>
                <span>{stats.rate}%</span>
              </div>
              <Progress value={stats.rate} variant="success" size="md" />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-semibold border-t border-slate-50 dark:border-zinc-800/50 pt-4 select-none">
              <span>Completed: {stats.completed}</span>
              <span>Missed: {stats.missed}</span>
              <span>Total: {stats.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Event log */}
        <Card className="md:col-span-2 border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#121214] h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              Hourly Medication Events
            </CardTitle>
            <CardDescription>Chronological sequence of alerts configured for the day</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 pt-0">
            {selectedDateLogs.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center text-slate-300 mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">No events logged for this date</span>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                  Adjust date selections or verify active medication durations.
                </p>
              </div>
            ) : (
              <div className="relative border-l border-slate-150 dark:border-zinc-800/80 pl-6 ml-2 flex flex-col gap-6">
                {selectedDateLogs.map((log) => {
                  const isCompleted = log.status === 'completed';
                  const isMissed = log.status === 'missed';
                  const isUpcoming = log.status === 'upcoming';

                  return (
                    <div key={log.id} className="relative text-left">
                      {/* Timeline dot */}
                      <span className={`
                        absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-[#121214] flex items-center justify-center select-none
                        ${isCompleted ? 'border-teal-500 text-teal-500' : ''}
                        ${isMissed ? 'border-rose-500 text-rose-500' : ''}
                        ${isUpcoming ? 'border-slate-300 dark:border-zinc-700 text-slate-400' : ''}
                      `}>
                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 fill-teal-500/10 text-teal-500" />}
                        {isMissed && <XCircle className="w-3.5 h-3.5 fill-rose-500/10 text-rose-500" />}
                        {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-750" />}
                      </span>

                      {/* Event description block */}
                      <div className="p-4 rounded-xl border border-slate-50 dark:border-zinc-800/40 bg-slate-50/20 dark:bg-zinc-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 select-none">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase">{log.time}</span>
                            <Badge variant={isCompleted ? 'success' : isMissed ? 'danger' : 'neutral'} size="sm">
                              {log.status}
                            </Badge>
                          </div>
                          
                          <span className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-200'}`}>
                            {log.medicineName} ({log.dosage})
                          </span>
                          
                          {log.foodTiming !== 'none' && (
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 leading-none select-none">
                              Take {log.foodTiming} meals
                            </span>
                          )}
                        </div>

                        {/* Event checkoff action items */}
                        {isUpcoming ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2.5 py-1 text-[11px] rounded-lg border-border-light hover:border-rose-300 dark:border-border-dark text-slate-500 hover:text-rose-500 cursor-pointer"
                              onClick={() => handleStatusChange(log.id, 'missed')}
                            >
                              Missed
                            </Button>
                            <Button
                              size="sm"
                              className="px-2.5 py-1 text-[11px] rounded-lg bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
                              onClick={() => handleStatusChange(log.id, 'completed')}
                            >
                              Taken
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => logReminder(log.id, 'upcoming')}
                            className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline cursor-pointer"
                          >
                            Reset Compliance Status
                          </button>
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

    </div>
  );
};
export default ReminderTimeline;
