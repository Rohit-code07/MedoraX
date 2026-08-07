import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Medicine, ReminderLog, AppNotification, ChatMessage, PrescriptionScan, UserProfile } from '../types';
import * as medicineApi from '../api/medicine.api';
import * as profileApi from '../api/profile.api';
import * as reminderApi from '../api/reminder.api';

interface AppContextType {
  medicines: Medicine[];
  reminderLogs: ReminderLog[];
  notifications: AppNotification[];
  chatHistory: ChatMessage[];
  scans: PrescriptionScan[];
  profile: UserProfile;
  isAuthenticated: boolean;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'status'>) => string;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  archiveMedicine: (id: string) => void;
  logReminder: (logId: string, status: 'completed' | 'missed' | 'upcoming') => void;
  addChatMessage: (text: string, sender: 'user' | 'assistant', suggestPromptList?: string[]) => void;
  clearChat: () => void;
  addPrescriptionScan: (scan: PrescriptionScan) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to format date relative to today (YYYY-MM-DD)
const getRelativeDateString = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Rohit Kumar',
  email: 'rohit@medorax.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  bloodType: 'O-Positive',
  height: '178 cm',
  weight: '72 kg',
  allergies: ['Penicillin', 'Peanuts'],
  emergencyContact: {
    name: 'Aisha Kumar',
    relationship: 'Spouse',
    phone: '+91 98765 43210',
  },
  theme: 'dark',
  reminderPreferences: {
    sound: true,
    push: true,
    email: false,
    reminderBufferMinutes: 10,
  },
  privacySettings: {
    shareData: true,
    biometricLock: false,
  },
  connectedDevices: ['Apple Watch Series 9', 'Withings Smart Scale'],
};

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Lipitor (Atorvastatin)',
    dosage: '10mg',
    frequency: 'daily',
    times: ['08:00'],
    foodTiming: 'after',
    duration: 'continuous',
    startDate: getRelativeDateString(-30),
    status: 'active',
    category: 'tablet',
    notes: 'For cholesterol management. Take before bedtime or in morning.',
    imageUrl: 'tablet',
  },
  {
    id: 'med-2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'daily',
    times: ['14:00', '20:00'],
    foodTiming: 'with',
    duration: 'continuous',
    startDate: getRelativeDateString(-15),
    status: 'active',
    category: 'capsule',
    notes: 'Blood sugar regulation. Always take with meals.',
    imageUrl: 'capsule',
  },
  {
    id: 'med-3',
    name: 'Vitamin D3 (Cholecalciferol)',
    dosage: '2000 IU',
    frequency: 'weekly',
    frequencyDays: [0], // Sundays
    times: ['10:00'],
    foodTiming: 'with',
    duration: 'fixed',
    durationDays: 90,
    startDate: getRelativeDateString(-28),
    endDate: getRelativeDateString(62),
    status: 'active',
    category: 'tablet',
    notes: 'Bone strength support.',
    imageUrl: 'tablet',
  },
  {
    id: 'med-4',
    name: 'Albuterol (ProAir HFA)',
    dosage: '2 puffs',
    frequency: 'as_needed',
    times: ['12:00'],
    foodTiming: 'none',
    duration: 'continuous',
    startDate: getRelativeDateString(-45),
    status: 'active',
    category: 'inhaler',
    notes: 'Use in case of shortness of breath or asthma symptoms.',
    imageUrl: 'inhaler',
  },
  {
    id: 'med-5',
    name: 'Amoxicillin Trihydrate',
    dosage: '500mg',
    frequency: 'daily',
    times: ['08:00', '16:00', '22:00'],
    foodTiming: 'before',
    duration: 'fixed',
    durationDays: 7,
    startDate: getRelativeDateString(-14),
    endDate: getRelativeDateString(-7),
    status: 'completed',
    category: 'capsule',
    notes: 'Antibiotic for sinus infection. Make sure to complete the entire course.',
    imageUrl: 'capsule',
  },
];

// Helper to seed reminder logs for the last 7 days + today
const seedReminderLogs = (medicines: Medicine[]): ReminderLog[] => {
  const logs: ReminderLog[] = [];
  const statusPool: ('completed' | 'missed')[] = ['completed', 'completed', 'completed', 'completed', 'missed', 'completed']; // ~83% completion rate

  // Let's seed logs for past 7 days (day -7 to -1)
  for (let i = -7; i < 0; i++) {
    const dateStr = getRelativeDateString(i);
    const dayOfWeek = new Date(dateStr).getDay();

    medicines.forEach((med) => {
      // Completed medicines aren't scheduled if date is outside range
      if (med.status === 'completed' && med.endDate && dateStr > med.endDate) return;
      if (med.status === 'completed' && dateStr < med.startDate) return;

      // Handle weekly
      if (med.frequency === 'weekly' && med.frequencyDays && !med.frequencyDays.includes(dayOfWeek)) {
        return;
      }
      
      // As needed drugs are rarely logged automatically
      if (med.frequency === 'as_needed') {
        if (Math.random() > 0.7) {
          logs.push({
            id: `log-${med.id}-${dateStr}-as-needed`,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            category: med.category,
            date: dateStr,
            time: '13:00',
            foodTiming: med.foodTiming,
            status: 'completed',
            actionedAt: `${dateStr}T13:05:00Z`,
          });
        }
        return;
      }

      // Daily schedule logs
      med.times.forEach((time, index) => {
        const randStatus = statusPool[Math.floor(Math.random() * statusPool.length)];
        logs.push({
          id: `log-${med.id}-${dateStr}-${time.replace(':', '')}`,
          medicineId: med.id,
          medicineName: med.name,
          dosage: med.dosage,
          category: med.category,
          date: dateStr,
          time,
          foodTiming: med.foodTiming,
          status: randStatus,
          actionedAt: randStatus === 'completed' ? `${dateStr}T${time}:12Z` : undefined,
        });
      });
    });
  }

  // Today's logs (some completed, some upcoming/pending)
  const todayStr = getRelativeDateString(0);
  const todayDayOfWeek = new Date().getDay();

  medicines.forEach((med) => {
    if (med.status !== 'active') return;
    if (med.frequency === 'weekly' && med.frequencyDays && !med.frequencyDays.includes(todayDayOfWeek)) return;
    if (med.frequency === 'as_needed') return;

    med.times.forEach((time) => {
      const [hour] = time.split(':').map(Number);
      const currentHour = new Date().getHours();
      let status: 'completed' | 'missed' | 'upcoming' = 'upcoming';
      let actionedAt: string | undefined;

      if (hour < currentHour - 1) {
        // Dose was in past. Most likely completed or missed.
        status = Math.random() > 0.15 ? 'completed' : 'missed';
        if (status === 'completed') {
          actionedAt = `${todayStr}T${time}:04Z`;
        }
      } else if (hour <= currentHour + 1) {
        // Active window - pending
        status = 'upcoming';
      } else {
        // Far future
        status = 'upcoming';
      }

      logs.push({
        id: `log-${med.id}-${todayStr}-${time.replace(':', '')}`,
        medicineId: med.id,
        medicineName: med.name,
        dosage: med.dosage,
        category: med.category,
        date: todayStr,
        time,
        foodTiming: med.foodTiming,
        status,
        actionedAt,
      });
    });
  });

  return logs;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Morning Dose Missed',
    message: 'You forgot to take Metformin 500mg at 08:00 AM today.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    type: 'warning',
    priority: 'high',
    medicineId: 'med-2',
  },
  {
    id: 'notif-2',
    title: 'Adherence Goal Unlocked! 🌟',
    message: 'Great job! You maintained 100% adherence over the past 4 days.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    type: 'system',
    priority: 'medium',
  },
  {
    id: 'notif-3',
    title: 'Refill Warning',
    message: 'Lipitor (Atorvastatin) is running low. Only 5 tablets left.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'alert',
    priority: 'high',
    medicineId: 'med-1',
  },
];

const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'chat-1',
    text: 'Hello Rohit! I am your MedoraX AI Assistant. I can help analyze your prescriptions for conflicts, explain dosage timings, or answer questions about side effects. How can I assist you today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    suggestedPrompts: [
      'Explain Lipitor side effects',
      'Can I take Metformin with coffee?',
      'Check conflicts in my prescription',
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('medorax_auth') === 'true';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('medorax_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('medorax_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    const saved = localStorage.getItem('medorax_logs');
    if (saved) return JSON.parse(saved);
    const initialLogs = seedReminderLogs(INITIAL_MEDICINES);
    localStorage.setItem('medorax_logs', JSON.stringify(initialLogs));
    return initialLogs;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('medorax_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('medorax_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_HISTORY;
  });

  const [scans, setScans] = useState<PrescriptionScan[]>(() => {
    const saved = localStorage.getItem('medorax_scans');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('medorax_profile', JSON.stringify(profile));
    // Apply dark class to html document element for Tailwind dark mode
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('medorax_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('medorax_logs', JSON.stringify(reminderLogs));
  }, [reminderLogs]);

  useEffect(() => {
    localStorage.setItem('medorax_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('medorax_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('medorax_scans', JSON.stringify(scans));
  }, [scans]);

  // Fetch backend data on authentication
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBackendData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const [medRes, profRes] = await Promise.allSettled([
          medicineApi.getMedicines(),
          userId ? profileApi.getProfile(userId) : Promise.reject('No userId'),
        ]);

        if (medRes.status === 'fulfilled' && Array.isArray(medRes.value.data) && medRes.value.data.length > 0) {
          const apiMeds: Medicine[] = medRes.value.data.map((m: any) => ({
            id: String(m.id),
            name: m.name || '',
            dosage: m.dosage || '',
            frequency: m.frequency || 'daily',
            times: [m.time || '08:00'],
            foodTiming: 'with',
            duration: 'continuous',
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            category: (m.category || 'tablet').toLowerCase(),
            notes: m.notes || '',
            color: m.color,
            stock: m.stock,
            maxStock: m.maxStock,
            takenToday: m.takenToday,
          }));
          setMedicines(apiMeds);
        }

        if (profRes.status === 'fulfilled' && profRes.value.data) {
          setProfile(prev => ({
            ...prev,
            ...profRes.value.data,
          }));
        }
      } catch (err) {
        console.warn('Backend sync warning:', err);
      }
    };
    fetchBackendData();
  }, [isAuthenticated]);

  const login = useCallback((email: string, name?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('medorax_auth', 'true');
    setProfile(prev => ({ ...prev, email, ...(name ? { name } : {}) }));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('medorax_auth');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }, []);

  const addMedicine = (medData: Omit<Medicine, 'id' | 'status'>) => {
    const tempId = `med-${Date.now()}`;
    const newMed: Medicine = {
      ...medData,
      id: tempId,
      status: 'active',
    };

    setMedicines((prev) => [...prev, newMed]);

    // Backend sync
    medicineApi.addMedicine({
      name: newMed.name,
      dosage: newMed.dosage,
      time: newMed.times[0] || '08:00',
      stock: 30,
      maxStock: 30,
      frequency: newMed.frequency,
      category: newMed.category,
      color: newMed.imageUrl || 'tablet',
      notes: newMed.notes || '',
      takenToday: false,
    }).then((res: any) => {
      if (res.data && res.data.id) {
        setMedicines(prev => prev.map(m => m.id === tempId ? { ...m, id: String(res.data.id) } : m));
      }
    }).catch((err: any) => console.warn('Failed to persist medicine to backend:', err));

    // Automatically seed logs for this new medicine for today
    const todayStr = getRelativeDateString(0);
    const dayOfWeek = new Date().getDay();
    const newLogs: ReminderLog[] = [];

    if (newMed.frequency === 'daily' || (newMed.frequency === 'weekly' && newMed.frequencyDays?.includes(dayOfWeek))) {
      newMed.times.forEach((time) => {
        newLogs.push({
          id: `log-${newMed.id}-${todayStr}-${time.replace(':', '')}`,
          medicineId: newMed.id,
          medicineName: newMed.name,
          dosage: newMed.dosage,
          category: newMed.category,
          date: todayStr,
          time,
          foodTiming: newMed.foodTiming,
          status: 'upcoming',
        });
      });
      setReminderLogs((prev) => [...prev, ...newLogs]);
    }

    // Add alert notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Medication Tracked',
      message: `You successfully added ${newMed.name} to your dashboard.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'system',
      priority: 'low',
      medicineId: tempId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return tempId;
  };

  const updateMedicine = (updatedMed: Medicine) => {
    setMedicines((prev) => prev.map((m) => (m.id === updatedMed.id ? updatedMed : m)));

    // Backend sync if numeric ID
    const numericId = Number(updatedMed.id);
    if (!isNaN(numericId) && numericId > 0) {
      medicineApi.updateMedicine(numericId, {
        name: updatedMed.name,
        dosage: updatedMed.dosage,
        time: updatedMed.times[0] || '08:00',
        stock: updatedMed.stock || 30,
        maxStock: updatedMed.maxStock || 30,
        frequency: updatedMed.frequency,
        category: updatedMed.category,
        color: updatedMed.category,
        notes: updatedMed.notes || '',
        takenToday: false,
      }).catch((err: any) => console.warn('Failed to update medicine on backend:', err));
    }

    // Update logs' basic data if changed
    setReminderLogs((prev) =>
      prev.map((log) => {
        if (log.medicineId === updatedMed.id) {
          return {
            ...log,
            medicineName: updatedMed.name,
            dosage: updatedMed.dosage,
            category: updatedMed.category,
            foodTiming: updatedMed.foodTiming,
          };
        }
        return log;
      })
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setReminderLogs((prev) => prev.filter((log) => log.medicineId !== id));

    const numericId = Number(id);
    if (!isNaN(numericId) && numericId > 0) {
      medicineApi.deleteMedicine(numericId).catch((err: any) => console.warn('Failed to delete medicine on backend:', err));
    }
  };

  const archiveMedicine = (id: string) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === 'archived' ? 'active' : 'archived' } : m))
    );
  };

  const logReminder = (logId: string, status: 'completed' | 'missed' | 'upcoming') => {
    setReminderLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            status,
            actionedAt: status !== 'upcoming' ? new Date().toISOString() : undefined,
          };
        }
        return log;
      })
    );

    const numericLogId = Number(logId.replace(/\D/g, ''));
    if (!isNaN(numericLogId) && numericLogId > 0) {
      const backendStatus = status === 'completed' ? 'TAKEN' : 'MISSED';
      reminderApi.updateReminder(numericLogId, backendStatus).catch((err: any) => console.warn('Failed to update reminder on backend:', err));
    }
  };

  const addChatMessage = (text: string, sender: 'user' | 'assistant', suggestPromptList?: string[]) => {
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      text,
      sender,
      timestamp: new Date().toISOString(),
      suggestedPrompts: suggestPromptList,
    };
    setChatHistory((prev) => [...prev, newMsg]);
  };

  const clearChat = () => {
    setChatHistory([INITIAL_CHAT_HISTORY[0]]);
  };

  const addPrescriptionScan = (scan: PrescriptionScan) => {
    setScans((prev) => [scan, ...prev]);

    // Create high-priority notification warning about mismatches if found
    const hasMismatch = scan.results.some(r => r.status !== 'match');
    const warningNotif: AppNotification = {
      id: `notif-scan-${Date.now()}`,
      title: hasMismatch ? 'Prescription Mismatch Detected ⚠️' : 'Prescription Review Complete ✅',
      message: hasMismatch
        ? `We found conflicts between your current medications and the uploaded prescription "${scan.fileName}".`
        : `Your uploaded prescription matches your current medication list perfectly.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: hasMismatch ? 'warning' : 'system',
      priority: hasMismatch ? 'high' : 'medium',
    };
    setNotifications(prev => [warningNotif, ...prev]);
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...profileUpdate }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        medicines,
        reminderLogs,
        notifications,
        chatHistory,
        scans,
        profile,
        isAuthenticated,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        archiveMedicine,
        logReminder,
        addChatMessage,
        clearChat,
        addPrescriptionScan,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
