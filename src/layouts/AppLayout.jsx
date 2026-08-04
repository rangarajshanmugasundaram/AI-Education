import { useState, useEffect, useCallback, memo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900 selection:bg-slate-200">
      {/* Full-width Top Header across the entire top viewport */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 w-full relative">
        {/* Sidebar Positioned Below Header */}
        <div className={`fixed top-16 bottom-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-out ${
          isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'
        }`}>
          <Sidebar toggleMobileMenu={toggleSidebar} isOpen={isMobileOpen} />
        </div>

        {/* Main Content Area */}
        <div className={`flex min-h-[calc(100vh-4rem)] flex-1 flex-col transition-all duration-300 ${!isMobile ? 'ml-64' : 'ml-0'}`}>
          <main className="flex-1 w-full overflow-x-hidden">
            <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-slate-900/20 backdrop-blur-xs transition-opacity" 
        />
      )}
    </div>
  );
};

export default memo(AppLayout);