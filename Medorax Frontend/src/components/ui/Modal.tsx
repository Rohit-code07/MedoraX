import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 350 } }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            className={`
              relative w-full ${sizeClasses[size]} glass-panel-heavy
              rounded-2xl shadow-2xl overflow-hidden border border-border-light dark:border-border-dark
              z-10 flex flex-col max-h-[90vh] text-left
            `}
          >
            {/* Header */}
            <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-50 dark:border-zinc-800/50">
              <div>
                {title && (
                  <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                    {description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                onClick={onClose}
                leftIcon={<X className="w-4 h-4" />}
              />
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-600 dark:text-zinc-300">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 pt-4 border-t border-slate-50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-800/10 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
