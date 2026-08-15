import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Pill, 
  PlusCircle, 
  CalendarRange, 
  BarChart3, 
  MessageSquare, 
  FileWarning, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { MedoraxLogo } from '../ui/MedoraxLogo';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, updateProfile, notifications, logout } = useApp();

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', path: '/medicines', icon: Pill },
    { id: 'add-medicine', label: 'Add Medicine', path: '/add-medicine', icon: PlusCircle },
    { id: 'timeline', label: 'Timeline', path: '/timeline', icon: CalendarRange },
    { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { 
      id: 'ai-assistant', 
      label: 'AI Assistant', 
      path: '/ai-assistant', 
      icon: MessageSquare,
      badge: 'AI'
    },
    { 
      id: 'prescription-mismatch', 
      label: 'Prescription OCR', 
      path: '/prescription-mismatch', 
      icon: FileWarning 
    },
    { id: 'profile', label: 'Profile', path: '/profile', icon: User },
    { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleThemeToggle = () => {
    updateProfile({ theme: profile.theme === 'light' ? 'dark' : 'light' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col border-r border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-50 dark:border-zinc-800/50 gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center shadow-md shadow-brand-primary/20 overflow-hidden">
          <MedoraxLogo size={32} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-zinc-100 leading-none">
            MedoraX
          </span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold tracking-wider uppercase mt-1">
            AI Healthcare
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group text-left cursor-pointer
                ${isActive 
                  ? 'bg-slate-50 dark:bg-zinc-800/40 text-brand-primary dark:text-white' 
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50/50 dark:hover:bg-zinc-800/10'
                }
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-primary dark:text-brand-secondary' : ''}`} />
              <span className="flex-1">{item.label}</span>
              
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-primary/10 dark:bg-brand-secondary/10 text-brand-primary dark:text-brand-secondary tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Actions & Profile Footer */}
      <div className="p-4 border-t border-slate-50 dark:border-zinc-800/50 flex flex-col gap-2 bg-slate-50/20 dark:bg-zinc-900/5">
        {/* Theme and Logout Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl h-10 p-0 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
            onClick={handleThemeToggle}
            leftIcon={profile.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          />
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl h-10 p-0 text-slate-500 hover:text-rose-600 border-border-light hover:border-rose-200 dark:border-border-dark dark:hover:border-rose-950 cursor-pointer"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          />
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-all duration-200 cursor-pointer mt-1" onClick={() => navigate('/profile')}>
          <img
            src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
            alt={profile.name}
            className="w-9 h-9 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-zinc-800"
          />
          <div className="flex-1 min-w-0 flex flex-col text-left">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate">
              {profile.name}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">
              {profile.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
