// TypeScript interfaces for API data models
export interface User {
  userId: number;
  name: string;
  email: string;
}

export interface Profile {
  age: number;
  gender: string;
  weight: number;
  height: number;
}

export interface Medicine {
  id?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  time: string; // HH:mm
  startDate: string; // ISO date
  endDate?: string;
}

export interface Reminder {
  id?: number;
  medicineId: number;
  time: string; // HH:mm
  status?: string;
}

export interface Analytics {
  streak?: number;
  weeklyRate?: number;
  bestMedicine?: string;
  mostMissed?: string;
  weeklyChart?: any[]; // define proper type if needed
  medicineRate?: any[];
  heatmap?: any;
}
