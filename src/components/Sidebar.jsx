import React, { useState, useEffect, memo } from 'react';

const Sidebar = ({ toggleMobileMenu, isOpen }) => {
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

  const getSidebarStyle = () => {
    if (!isMobile) {
      return styles.enterpriseSidebar;
    }
    return {
      ...styles.enterpriseSidebar,
      ...styles.mobileSidebar,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    };
  };

  return (
    <aside style={getSidebarStyle()}>
      
      {/* BRAND LOGO HUB */}
      <div style={styles.sidebarBrandBox}>
        <div style={styles.brandLogoLayout}>
          <div style={styles.brandLogoIcon}>AI</div>
          <span style={styles.brandLogoText}>AI Education</span>
        </div>
        
        {isMobile && (
          <button 
            style={styles.sidebarMobileClose} 
            onClick={toggleMobileMenu} 
            aria-label="Close Menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* USER PROFILE BANNER */}
      <div style={styles.sidebarUserCard}>
        <div style={styles.userCardAvatar}>MD</div>
        <div style={styles.userCardDetails}>
          <div style={styles.userCardName}>Markarn Doe</div>
          <div style={styles.userCardRole}>Administrator</div>
        </div>
      </div>

      {/* APPLICATION NAVIGATION LINKS */}
      <nav style={styles.sidebarNavMenu}>
        <div style={styles.navMenuGroupTitle}>PERSONAL</div>
        <div style={{ ...styles.navMenuLink, ...styles.navMenuLinkActive }}>
          <span style={styles.navLinkIcon}>📊</span>
          <span>Dashboard</span>
        </div>
        <div style={styles.navMenuLink}>
          <span style={styles.navLinkIcon}>📄</span>
          <span>Page Layouts</span>
        </div>

        <div style={styles.navMenuGroupTitle}>APPS</div>
        <div style={styles.navMenuLink}>
          <span style={styles.navLinkIcon}>📅</span>
          <span>Calendar</span>
        </div>
        <div style={styles.navMenuLink}>
          <span style={styles.navLinkIcon}>💬</span>
          <span>Chat Apps</span>
        </div>
      </nav>

    </aside>
  );
};

const styles = {
  enterpriseSidebar: {
    width: 'var(--sidebar-width, 260px)',
    height: '100vh',
    backgroundColor: '#1e293b', 
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    boxShadow: '4px 0 24px rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    contain: 'strict',
  },
  mobileSidebar: {
    zIndex: 1050,
  },
  sidebarBrandBox: {
    height: 'var(--header-height, 70px)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    boxSizing: 'border-box',
  },
  brandLogoLayout: { display: 'flex', alignItems: 'center', gap: '12px' },
  brandLogoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#00ccda',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '16px',
  },
  brandLogoText: { 
    fontSize: '16px', 
    fontWeight: '700', 
    letterSpacing: '0.75px', 
    color: '#f8fafc',
    whiteSpace: 'nowrap',
  },
  sidebarMobileClose: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: 'none',
    color: '#94a3b8',
    fontSize: '16px',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarUserCard: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    boxSizing: 'border-box',
  },
  userCardAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '13px',
    flexShrink: 0,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  userCardDetails: { display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 },
  userCardName: { fontWeight: '600', fontSize: '14px', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userCardRole: { fontSize: '11px', color: '#94a3b8', fontWeight: '500' },
  sidebarNavMenu: { 
    padding: '20px 16px', 
    flex: 1, 
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  navMenuGroupTitle: { 
    fontSize: '10px', 
    fontWeight: '700', 
    color: '#64748b', 
    padding: '0 12px', 
    marginTop: '20px', 
    marginBottom: '8px', 
    letterSpacing: '1.2px',
  },
  navMenuLink: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 14px', 
    fontSize: '14px', 
    fontWeight: '500', 
    borderRadius: '8px', 
    color: '#94a3b8', 
    cursor: 'pointer', 
    marginBottom: '4px',
    transition: 'background-color 0.15s, color 0.15s',
    boxSizing: 'border-box',
  },
  navMenuLinkActive: { 
    backgroundColor: 'rgba(0, 204, 218, 0.12)', 
    color: '#00ccda', 
    fontWeight: '600',
  },
  navLinkIcon: { fontSize: '16px', display: 'inline-block', width: '20px', textAlign: 'center' }
};

export default memo(Sidebar);