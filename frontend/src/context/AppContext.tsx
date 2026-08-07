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
  name: '',
  email: '',
  avatarUrl: '',
  bloodType: '',
  height: '',
  weight: '',
  allergies: [],
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
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
  connectedDevices: [],
};

const INITIAL_MEDICINES: Medicine[] = [];
const INITIAL_NOTIFICATIONS: AppNotification[] = [];
const INITIAL_CHAT_HISTORY: ChatMessage[] = [];

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
    return saved ? JSON.parse(saved) : [];
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    const saved = localStorage.getItem('medorax_logs');
    return saved ? JSON.parse(saved) : [];
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
        const [medRes, profRes, remRes] = await Promise.allSettled([
          medicineApi.getMedicines(),
          userId ? profileApi.getProfile(userId) : Promise.reject('No userId'),
          reminderApi.getReminders(),
        ]);

        if (medRes.status === 'fulfilled' && Array.isArray(medRes.value.data)) {
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
            color: m.color || m.colour || 'tablet',
            stock: m.stock !== undefined ? m.stock : 30,
            maxStock: m.maxStock !== undefined ? m.maxStock : 30,
            takenToday: Boolean(m.takenToday),
          }));
          setMedicines(apiMeds);
        }

        if (profRes.status === 'fulfilled' && profRes.value.data) {
          setProfile(prev => ({
            ...prev,
            name: profRes.value.data.name || prev.name,
            email: profRes.value.data.email || prev.email,
            bloodType: profRes.value.data.bloodGroup || prev.bloodType,
            emergencyContact: {
              ...prev.emergencyContact,
              name: profRes.value.data.emergencyContactName || prev.emergencyContact.name,
              phone: profRes.value.data.emergencyContactPhone || prev.emergencyContact.phone,
            }
          }));
        }

        if (remRes.status === 'fulfilled' && Array.isArray(remRes.value.data)) {
          const apiLogs: ReminderLog[] = remRes.value.data.map((r: any) => ({
            id: String(r.id),
            medicineId: r.medicine ? String(r.medicine.id) : '',
            medicineName: r.medicine ? r.medicine.name : 'Medication',
            dosage: r.medicine ? r.medicine.dosage : '',
            category: r.medicine ? (r.medicine.category || 'tablet').toLowerCase() : 'tablet',
            date: r.date || new Date().toISOString().split('T')[0],
            time: r.time ? String(r.time).substring(0, 5) : '08:00',
            foodTiming: r.medicine ? r.medicine.foodTiming || 'with' : 'with',
            status: r.Remainderstatus === 'TAKEN' ? 'completed' : r.Remainderstatus === 'MISSED' ? 'missed' : 'upcoming',
          }));
          setReminderLogs(apiLogs);
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
    const userId = localStorage.getItem('userId');
    if (userId) {
      profileApi.updateProfile(userId, {
        name: profileUpdate.name,
        email: profileUpdate.email,
        phone: profileUpdate.emergencyContact?.phone,
        bloodGroup: profileUpdate.bloodType,
        emergencyContactName: profileUpdate.emergencyContact?.name,
        emergencyContactPhone: profileUpdate.emergencyContact?.phone,
      }).catch(err => console.warn('Failed to sync profile update to backend:', err));
    }
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
