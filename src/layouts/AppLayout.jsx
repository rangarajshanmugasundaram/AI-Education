import React, { useState, useEffect, useCallback, memo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-slate-50 relative overflow-x-hidden">
  
      <Sidebar toggleMobileMenu={toggleSidebar} isOpen={isMobileOpen} />

      <div 
        className={`flex flex-col flex-1 w-full min-h-screen transition-all duration-300 ease-in-out ${
          !isMobile ? 'ml-[260px]' : 'ml-0'
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 w-full">
          <div className={`w-full ${isMobile ? 'p-4' : 'p-10'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(AppLayout);