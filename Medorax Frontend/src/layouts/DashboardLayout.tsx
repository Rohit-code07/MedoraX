import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Shared/Sidebar';
import { Navbar } from '../components/Shared/Navbar';
import { MobileHeader } from '../components/Shared/MobileHeader';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!isAuthenticated) {
    // If not authenticated, redirect to landing / login page
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Drawer Menu */}
      <MobileHeader isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Content Body with Framer Motion Page Transition */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto h-full flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
