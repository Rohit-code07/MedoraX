import React from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex p-1 bg-slate-100 dark:bg-zinc-800/60 rounded-xl select-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center justify-center gap-2 flex-1 py-2 px-3 text-xs font-semibold rounded-lg
              transition-colors duration-200 cursor-pointer
              ${isActive 
                ? 'text-slate-800 dark:text-white' 
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-slate-200/20 dark:border-zinc-800"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
