import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { MedicineManagement } from './pages/MedicineManagement';
import { AddMedicine } from './pages/AddMedicine';
import { ReminderTimeline } from './pages/ReminderTimeline';
import { Analytics } from './pages/Analytics';
import { AIAssistant } from './pages/AIAssistant';
import { PrescriptionMismatch } from './pages/PrescriptionMismatch';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<MedicineManagement />} />
            <Route path="/add-medicine" element={<AddMedicine />} />
            <Route path="/timeline" element={<ReminderTimeline />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/prescription-mismatch" element={<PrescriptionMismatch />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-panel text-xs text-slate-800 dark:text-zinc-200 border-slate-100 dark:border-zinc-800/80 rounded-xl shadow-lg',
          duration: 3000,
        }}
      />
    </AppProvider>
  );
}

export default App;
