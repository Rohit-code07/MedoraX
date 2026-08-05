import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  LayoutDashboard, 
  Pill, 
  PlusCircle, 
  CalendarRange, 
  BarChart3, 
  MessageSquare, 
  FileWarning, 
  User, 
  Settings, 
  LogOut
} from 'lucide-react';
import { Button } from '../ui/Button';
import { MedoraxLogo } from '../ui/MedoraxLogo';

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useApp();

  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', path: '/medicines', icon: Pill },
    { id: 'add-medicine', label: 'Add Medicine', path: '/add-medicine', icon: PlusCircle },
    { id: 'timeline', label: 'Timeline', path: '/timeline', icon: CalendarRange },
    { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI Assistant', path: '/ai-assistant', icon: MessageSquare },
    { id: 'prescription-mismatch', label: 'Prescription OCR', path: '/prescription-mismatch', icon: FileWarning },
    { id: 'profile', label: 'Profile', path: '/profile', icon: User },
    { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop blocker overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Content Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#0c0c0e] h-full flex flex-col p-6 shadow-2xl z-10 border-r border-slate-100 dark:border-zinc-800 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] flex items-center justify-center shadow-md overflow-hidden">
              <MedoraxLogo size={28} />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-zinc-100">
              MedoraX
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-left
                  ${isActive 
                    ? 'bg-slate-50 dark:bg-zinc-800/40 text-brand-primary dark:text-white' 
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary dark:text-brand-secondary' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="mt-auto border-t border-slate-100 dark:border-zinc-800/80 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                {profile.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                {profile.email}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full text-slate-600 dark:text-zinc-300 border-border-light dark:border-border-dark py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};
export default MobileHeader;
