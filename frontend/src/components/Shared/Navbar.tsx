import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, Search, Menu, CheckCircle, X, Circle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MedoraxLogo } from '../ui/MedoraxLogo';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // Derive page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/medicines')) return 'Medications';
    if (path.startsWith('/add-medicine')) return 'Add Medicine';
    if (path.startsWith('/timeline')) return 'Timeline Log';
    if (path.startsWith('/analytics')) return 'Adherence Insights';
    if (path.startsWith('/ai-assistant')) return 'MedoraX Copilot';
    if (path.startsWith('/prescription-mismatch')) return 'Prescription OCR Scanner';
    if (path.startsWith('/profile')) return 'Profile Center';
    if (path.startsWith('/settings')) return 'System Settings';
    return 'Health Hub';
  };

  const getPriorityColorClass = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-l-4 border-rose-500 bg-rose-500/5 dark:bg-rose-500/10';
      case 'medium': return 'border-l-4 border-amber-500 bg-amber-500/5 dark:bg-amber-500/10';
      case 'low': return 'border-l-4 border-blue-500 bg-blue-500/5 dark:bg-blue-500/10';
      default: return 'border-l-4 border-slate-300';
    }
  };

  return (
    <header className="h-16 border-b border-slate-100 dark:border-zinc-800 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      {/* Left section: Title or Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-800 dark:text-zinc-100 tracking-tight leading-none">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 hidden sm:block mt-1">
            Personal AI Health Assistant
          </p>
        </div>
      </div>

      {/* Right section: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar - Apple Style */}
        <div className="relative hidden lg:flex items-center w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search medications, history..."
            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-xl py-1.5 pl-9 pr-4 text-xs outline-none text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 focus:border-brand-primary dark:focus:border-brand-secondary transition-all"
          />
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer relative
              ${showNotifications ? 'bg-slate-100 dark:bg-zinc-800' : ''}
            `}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              {/* Overlay blocker */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setShowNotifications(false)}
              />
              
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214] shadow-2xl z-50 overflow-hidden fade-in">
                {/* Header */}
                <div className="p-4 border-b border-slate-50 dark:border-zinc-800/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                    <MedoraxLogo size={16} />
                    Notification Center
                  </span>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] font-semibold text-brand-primary dark:text-brand-secondary hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50 dark:divide-zinc-800/50">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center text-slate-400 mb-2">
                        <Bell className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`
                          p-4 flex gap-3 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900/50
                          ${getPriorityColorClass(notif.priority)}
                          ${!notif.isRead ? 'bg-slate-50/30 dark:bg-zinc-900/20' : 'opacity-70'}
                        `}
                      >
                        <div className="mt-0.5">
                          {notif.isRead ? (
                            <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-brand-primary dark:text-brand-secondary fill-brand-primary/10 dark:fill-brand-secondary/10 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                            {notif.title}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-normal">
                            {notif.message}
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Footer */}
                <div className="p-3 bg-slate-50 dark:bg-zinc-900/20 text-center border-t border-slate-50 dark:border-zinc-800/50">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/settings');
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
                  >
                    Configure alerts preferences
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-zinc-800 cursor-pointer"
        >
          <img
            src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
            alt={profile.name}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-50 dark:ring-zinc-900"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 hidden sm:block">
            {profile.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
export default Navbar;
