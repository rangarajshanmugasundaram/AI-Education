import React, { useState, useEffect, useCallback, memo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [isMobile, isMobileOpen]);

  const toggleSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return (
    <div style={styles.layoutContainer}>
      <Sidebar toggleMobileMenu={toggleSidebar} isOpen={isMobileOpen} />

      {isMobile && isMobileOpen && (
        <div 
          onClick={toggleSidebar} 
          style={styles.mobileOverlay} 
        />
      )}

      <div style={{
        ...styles.rightViewport,
        paddingLeft: isMobile ? '0' : 'var(--sidebar-width, 260px)',
      }}>
        <Header toggleSidebar={toggleSidebar} />

        <main style={styles.contentArea}>
          <div style={{
            ...styles.pageContent,
            padding: isMobile ? '16px' : '40px',
            paddingTop: isMobile ? 'calc(var(--header-height, 70px) + 20px)' : '40px',
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  layoutContainer: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    position: 'relative',
    contain: 'clean',
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 1010,
    willChange: 'opacity',
  },
  rightViewport: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    transition: 'padding-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box',
  },
  contentArea: {
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
  },
  pageContent: {
    boxSizing: 'border-box',
    width: '100%',
  },
};

export default memo(AppLayout);