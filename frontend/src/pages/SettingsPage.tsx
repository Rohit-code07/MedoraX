import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Sun, 
  Moon, 
  BellRing, 
  Globe, 
  Lock, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  UserX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, logout } = useApp();

  const [language, setLanguage] = useState('english');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateProfile({ theme });
    toast.success(`Theme updated to ${theme} mode!`);
  };

  const handlePreferenceToggle = (key: 'sound' | 'push' | 'email') => {
    updateProfile({
      reminderPreferences: {
        ...profile.reminderPreferences,
        [key]: !profile.reminderPreferences[key]
      }
    });
    toast.success('Notification settings saved.');
  };

  const handlePrivacyToggle = (key: 'shareData' | 'biometricLock') => {
    updateProfile({
      privacySettings: {
        ...profile.privacySettings,
        [key]: !profile.privacySettings[key]
      }
    });
    toast.success('Privacy configuration updated.');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out securely.');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    logout();
    toast.error('Account database deleted permanently.');
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
      
      {/* 1. Header */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">preferences</span>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">System Settings</h2>
      </div>

      {/* 2. Settings layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation chips for categories */}
        <div className="md:col-span-1 flex flex-col gap-2 select-none">
          <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214] p-3 flex flex-col gap-1">
            <button className="flex items-center justify-between p-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-zinc-800/40 text-brand-primary dark:text-white text-left cursor-pointer">
              <span>General Preferences</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 text-left cursor-pointer">
              <span>Security & Encryption</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Card>
        </div>

        {/* Configurations pane */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* General setup */}
          <Card className="border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#121214]">
            <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
                <Settings className="w-4 h-4 text-brand-primary" />
                Theme & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6">
              
              {/* Theme toggler */}
              <div className="flex items-center justify-between select-none">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">System Color Scheme</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">Toggle between Light and Dark interface templates</p>
                </div>

                <div className="h-9 p-0.5 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center border border-slate-150 dark:border-zinc-800/80">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${profile.theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${profile.theme === 'dark' ? 'bg-zinc-900 text-white shadow-sm' : 'text-slate-400'}`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
                </div>
              </div>

              {/* Language selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="System Interface Language"
                  options={[
                    { value: 'english', label: 'English (US)' },
                    { value: 'hindi', label: 'Hindi (हिन्दी)' },
                    { value: 'spanish', label: 'Spanish (Español)' },
                  ]}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>

            </CardContent>
          </Card>

          {/* Alarm reminder notifications settings */}
          <Card className="border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#121214]">
            <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
                <BellRing className="w-4 h-4 text-brand-secondary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-5 select-none">
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">System Alarm Audio</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">Play alert tones when high-priority timers fire</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.reminderPreferences.sound}
                  onChange={() => handlePreferenceToggle('sound')}
                  className="w-4 h-4 text-brand-primary border-slate-350 dark:border-zinc-800 rounded focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">Device Push Notifications</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">Receive compliance alerts on desktop screen locks</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.reminderPreferences.push}
                  onChange={() => handlePreferenceToggle('push')}
                  className="w-4 h-4 text-brand-primary border-slate-350 dark:border-zinc-800 rounded focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">Email Backups</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">Recieve daily adherence digests via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.reminderPreferences.email}
                  onChange={() => handlePreferenceToggle('email')}
                  className="w-4 h-4 text-brand-primary border-slate-350 dark:border-zinc-800 rounded focus:ring-brand-primary"
                />
              </div>

            </CardContent>
          </Card>

          {/* Privacy and Security settings */}
          <Card className="border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#121214]">
            <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
                <Lock className="w-4 h-4 text-rose-500" />
                Data Privacy & Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-5 select-none">
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">Anonymous Diagnostics Sharing</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">Help improve clinical scanning accuracy rates</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.privacySettings.shareData}
                  onChange={() => handlePrivacyToggle('shareData')}
                  className="w-4 h-4 text-brand-primary border-slate-350 dark:border-zinc-800 rounded focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">FaceID / Biometric App Lock</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">Require lock validation on launching dashboard</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.privacySettings.biometricLock}
                  onChange={() => handlePrivacyToggle('biometricLock')}
                  className="w-4 h-4 text-brand-primary border-slate-350 dark:border-zinc-800 rounded focus:ring-brand-primary"
                />
              </div>

            </CardContent>
          </Card>

          {/* Destructive actions area */}
          <Card className="border-rose-500/10 bg-rose-500/5 select-none">
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 block">Dangerous Actions Area</span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 max-w-sm">
                  Logging out clears active authentication tokens. Deleting profile clears all locally saved treatment database records.
                </p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none border-rose-200 dark:border-rose-950/40 text-slate-600 dark:text-zinc-300 cursor-pointer"
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Log out
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 sm:flex-none cursor-pointer"
                  leftIcon={<UserX className="w-3.5 h-3.5" />}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Account Deletion confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
        description="Are you absolutely sure you want to clear your local database?"
      >
        <div className="flex flex-col gap-4 text-left select-none">
          <div className="p-4 rounded-xl bg-rose-500/5 text-rose-500 border border-rose-500/10 flex gap-2.5 items-start">
            <UserX className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 leading-normal text-xs">
              <span className="font-bold">Irreversible Action Warning</span>
              <p>
                Deleting your account will permanently wipe all local medicine lists, historical logs, notifications, and settings preferences from this browser's localStorage. This cannot be recovered.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2 border-t border-slate-50 dark:border-zinc-800/50 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete All Data
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
export default SettingsPage;
