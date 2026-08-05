export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'custom' | 'as_needed';
  frequencyDays?: number[]; // [0-6] for sunday-saturday
  times: string[]; // e.g. ["08:00", "20:00"]
  foodTiming: 'before' | 'with' | 'after' | 'none';
  duration: 'continuous' | 'fixed';
  durationDays?: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status: 'active' | 'archived' | 'completed';
  category: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'other';
  notes?: string;
  imageUrl?: string;
  stock?: number;
  maxStock?: number;
  color?: string;
  takenToday?: boolean;
}

export interface ReminderLog {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  foodTiming: 'before' | 'with' | 'after' | 'none';
  status: 'completed' | 'missed' | 'upcoming';
  actionedAt?: string; // ISO String when marked completed/missed
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  type: 'reminder' | 'warning' | 'alert' | 'system';
  priority: 'high' | 'medium' | 'low';
  medicineId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  suggestedPrompts?: string[];
  prescriptionScanId?: string;
}

export interface ComparisonResult {
  medicineName: string;
  status: 'match' | 'dosage_mismatch' | 'missing_in_app' | 'missing_in_prescription' | 'interaction_warning';
  severity: 'none' | 'low' | 'medium' | 'high';
  appValue: string;
  prescriptionValue: string;
  explanation: string;
}

export interface PrescriptionScan {
  id: string;
  date: string;
  fileName: string;
  confidenceScore: number;
  results: ComparisonResult[];
  recommendation: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  theme: 'light' | 'dark';
  reminderPreferences: {
    sound: boolean;
    push: boolean;
    email: boolean;
    reminderBufferMinutes: number; // 0, 5, 10, 15, 30
  };
  privacySettings: {
    shareData: boolean;
    biometricLock: boolean;
  };
  connectedDevices: string[]; // ["Apple Watch", "Fitbit"]
}
