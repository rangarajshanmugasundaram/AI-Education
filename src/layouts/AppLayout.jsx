import { useState, useEffect, useCallback, memo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Changed breakpoint to 1024px for better tablet support

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false); // Auto-close sidebar when switching to desktop
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Sidebar - Positioned for optimal mobile overlay */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out ${
        isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <Sidebar toggleMobileMenu={toggleSidebar} isOpen={isMobileOpen} />
      </div>

      {/* Main Content Area */}
      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${!isMobile ? 'ml-64' : 'ml-0'}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main Viewport Container */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Backdrop - Overlay to click-to-close */}
      {isMobile && isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        />
      )}
    </div>
  );
};

export default memo(AppLayout);