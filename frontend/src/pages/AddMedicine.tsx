import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Medicine } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  FileText, 
  Pill,
  Volume2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const AddMedicine: React.FC = () => {
  const navigate = useNavigate();
  const { addMedicine } = useApp();
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'tablet' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'other'>('tablet');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom' | 'as_needed'>('daily');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [foodTiming, setFoodTiming] = useState<'before' | 'with' | 'after' | 'none'>('none');
  const [duration, setDuration] = useState<'continuous' | 'fixed'>('continuous');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [notes, setNotes] = useState('');

  const totalSteps = 4;

  const handleNextStep = () => {
    if (step === 1 && !name.trim()) {
      toast.error('Please enter the medication name.');
      return;
    }
    if (step === 2 && !dosage.trim()) {
      toast.error('Please specify the dosage amount.');
      return;
    }
    if (step === 3 && times.some(t => !t)) {
      toast.error('Please provide valid intake hours.');
      return;
    }

    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleAddTimeRow = () => {
    setTimes([...times, '12:00']);
  };

  const handleRemoveTimeRow = (idx: number) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== idx));
    }
  };

  const handleTimeChange = (idx: number, val: string) => {
    const updated = [...times];
    updated[idx] = val;
    setTimes(updated);
  };

  const handleFinalSubmit = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Calculate end date if fixed duration
    let endDate: string | undefined;
    if (duration === 'fixed') {
      const d = new Date();
      d.setDate(d.getDate() + durationDays);
      endDate = d.toISOString().split('T')[0];
    }

    addMedicine({
      name,
      category,
      dosage,
      frequency,
      times,
      foodTiming,
      duration,
      durationDays: duration === 'fixed' ? durationDays : undefined,
      startDate: todayStr,
      endDate,
      notes,
    });

    setStep(5); // Move to success step!
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 text-left">
      
      {/* Back button link */}
      {step < 5 && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous screen</span>
        </button>
      )}

      {/* 1. Form Header & Progress Tracker */}
      {step < 5 && (
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Medication Setup Wizard</span>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Configure New Treatment</h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <Progress value={((step - 1) / (totalSteps - 1)) * 100} size="sm" variant="primary" />
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider select-none">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(((step - 1) / (totalSteps - 1)) * 100)}% Complete</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Step Wrapper card */}
      <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214] shadow-xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Basic details */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5 select-none">
                    <Info className="w-4 h-4 text-brand-primary" />
                    Medication Basic Info
                  </h3>

                  <Input
                    label="Medication Name"
                    placeholder="E.g., Lipitor, Metformin, Vitamin D3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase select-none">Medication Category Type</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {(['tablet', 'capsule', 'liquid', 'injection', 'inhaler', 'other'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`
                            py-3 rounded-xl border text-[11px] font-bold capitalize transition-all select-none cursor-pointer
                            ${category === cat 
                              ? 'border-brand-primary bg-brand-primary/5 text-brand-primary dark:border-brand-secondary dark:bg-brand-secondary/5 dark:text-brand-secondary' 
                              : 'border-slate-100 dark:border-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-850'
                            }
                          `}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase select-none">Administration Instructions / Notes</label>
                    <textarea
                      placeholder="E.g., Take with glass of water. Avoid grapefruits while taking Lipitor."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none text-slate-800 dark:text-zinc-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Dosages & Recurrence */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5 select-none">
                    <Pill className="w-4 h-4 text-brand-primary" />
                    Dosage & Recurrence Setup
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Dosage Strength"
                      placeholder="E.g. 500mg, 1 tablet, 2 puffs"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      required
                    />

                    <Select
                      label="Alert Recurrence frequency"
                      options={[
                        { value: 'daily', label: 'Every day (Daily)' },
                        { value: 'weekly', label: 'Once a week' },
                        { value: 'as_needed', label: 'As needed (PRN)' },
                      ]}
                      value={frequency}
                      onChange={(e: any) => setFrequency(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Timing logs */}
              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5 select-none">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    Intake Alarm Timings
                  </h3>

                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase select-none">Select Alarm Times</label>
                    <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-2">
                      {times.map((t, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="time"
                            value={t}
                            onChange={(e) => handleTimeChange(idx, e.target.value)}
                            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-zinc-100 outline-none focus:border-brand-primary cursor-pointer"
                          />
                          {times.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2.5 h-10 border-rose-200 dark:border-rose-950 text-rose-500 cursor-pointer"
                              onClick={() => handleRemoveTimeRow(idx)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-max mt-1 rounded-xl text-[11px] cursor-pointer"
                      onClick={handleAddTimeRow}
                    >
                      + Add another alarm time
                    </Button>
                  </div>

                  <Select
                    label="Food Intake Restriction"
                    options={[
                      { value: 'none', label: 'Take anytime (No constraints)' },
                      { value: 'before', label: 'Before Meals' },
                      { value: 'with', label: 'Take WITH Meals' },
                      { value: 'after', label: 'After Meals' },
                    ]}
                    value={foodTiming}
                    onChange={(e: any) => setFoodTiming(e.target.value)}
                  />
                </div>
              )}

              {/* Step 4: Duration setup & summary review */}
              {step === 4 && (
                <div className="flex flex-col gap-5 text-left">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5 select-none">
                    <Calendar className="w-4 h-4 text-brand-primary" />
                    Treatment Duration & Preview
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Treatment Duration Type"
                      options={[
                        { value: 'continuous', label: 'Continuous (No End Date)' },
                        { value: 'fixed', label: 'Fixed Course (Limited Days)' },
                      ]}
                      value={duration}
                      onChange={(e: any) => setDuration(e.target.value)}
                    />

                    {duration === 'fixed' && (
                      <Input
                        label="Number of Days"
                        type="number"
                        min={1}
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        required
                      />
                    )}
                  </div>

                  {/* Summary preview block */}
                  <div className="p-5 border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[20px] flex flex-col gap-4 text-left">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block select-none">Medication Setup Preview</span>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Medication Name</span>
                        <p className="text-sm font-extrabold text-brand-primary dark:text-brand-secondary">{name}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Dosage Strength</span>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-white">{dosage} ({category})</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between border-t border-slate-100 dark:border-zinc-800/50 pt-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Frequency & Intake Times</span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
                          {frequency} recurrence, scheduled at {times.join(', ')}.
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Food Constraint</span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 capitalize">
                          {foodTiming === 'none' ? 'None' : `${foodTiming} meals`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Success Page */}
              {step === 5 && (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-6">
                  {/* Celebration Check ring */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle2 className="w-8 h-8 fill-teal-500/10" />
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Medication Logged Successfully!</h2>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                      "{name}" has been mapped to your patient profile dashboard. Your daily scheduling alerts have updated automatically.
                    </p>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto mt-2">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none cursor-pointer"
                      onClick={() => navigate('/medicines')}
                    >
                      View Shelf Catalog
                    </Button>
                    <Button
                      className="flex-1 sm:flex-none cursor-pointer"
                      onClick={() => navigate('/dashboard')}
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation button panel */}
              {step < 5 && (
                <div className="flex justify-between items-center border-t border-slate-50 dark:border-zinc-800/50 pt-6 mt-6 select-none">
                  {step > 1 ? (
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handlePrevStep}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < totalSteps ? (
                    <Button
                      className="cursor-pointer"
                      onClick={handleNextStep}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      className="cursor-pointer bg-teal-500 hover:bg-teal-600 shadow-teal-500/10"
                      onClick={handleFinalSubmit}
                      rightIcon={<Sparkles className="w-4 h-4 fill-white/10" />}
                    >
                      Finalize & Setup
                    </Button>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

    </div>
  );
};
export default AddMedicine;
