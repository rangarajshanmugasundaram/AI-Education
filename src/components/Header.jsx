import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerLeftHub}>
        <button 
          className="mobile-only"
          style={styles.headerMenuTrigger} 
          onClick={toggleSidebar} 
          aria-label="Open Navigation Menu"
        >☰</button>

        <div style={styles.headerTitleBox}>
          <h1 style={styles.headerMainTitle}>Dashboard</h1>
          <nav className="desktop-only" style={styles.headerBreadcrumb}>
            Home <span style={styles.breadcrumbSeparator}>/</span> 
            <span style={styles.breadcrumbActive}>Dashboard</span>
          </nav>
        </div>
      </div>

      <div style={styles.headerRightHub}>
        <div className="desktop-only" style={styles.utilityGroup}>
          <button style={styles.headerUtilityBtn} aria-label="Notifications">
            <div style={styles.badgeWrapper}>
              <span style={styles.utilityIcon}>🔔</span>
              <span style={styles.badgeDot}></span>
            </div>
          </button>
          <button style={styles.headerUtilityBtn} aria-label="Messages">
            <span style={styles.utilityIcon}>✉️</span>
          </button>
        </div>
        
        <div style={styles.avatarWrapper} onClick={handleLogout} title="Click to Logout">
          <div style={styles.headerUserBadge}>RS</div>
          <span style={styles.onlineIndicator}></span>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: 'var(--header-height)', backgroundColor: '#ffffff', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0',
    padding: '0 20px', position: 'sticky', top: 0, zIndex: 90, width: '100%', boxSizing: 'border-box',
  },
  headerLeftHub: { display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 },
  headerMenuTrigger: {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '20px', cursor: 'pointer', color: '#334155', width: '40px', height: '40px',
    display: 'none', alignItems: 'center', justifyContent: 'center',
  },
  headerTitleBox: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
  headerMainTitle: { margin: 0, fontSize: '20px', color: 'var(--text-dark)', fontWeight: '700', letterSpacing: '-0.3px' },
  headerBreadcrumb: { fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center' },
  breadcrumbSeparator: { color: '#cbd5e1', margin: '0 8px' },
  breadcrumbActive: { color: '#475569' },
  headerRightHub: { display: 'flex', alignItems: 'center', gap: '24px' },
  utilityGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerUtilityBtn: { 
    background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', 
    width: '40px', height: '40px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  utilityIcon: { fontSize: '18px' },
  badgeWrapper: { position: 'relative' },
  badgeDot: {
    position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px',
    backgroundColor: '#f43f5e', borderRadius: '50%', border: '1px solid #ffffff',
  },
  avatarWrapper: { position: 'relative', cursor: 'pointer' },
  headerUserBadge: {
    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)',
    color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px',
  },
  onlineIndicator: {
    position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px',
    backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid #ffffff',
  }
};

export default memo(Header);