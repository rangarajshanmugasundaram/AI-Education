import React, { useState, useEffect, memo } from 'react';

const MyCourses = ({ courses }) => {
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

  const currentWidgetBoxStyle = isMobile ? styles.widgetBoxMobile : styles.widgetBoxDesktop;
  const currentRowStyle = isMobile ? styles.rowMobile : styles.rowDesktop;
  const currentBadgeStyle = isMobile ? styles.badgeMobile : styles.badgeDesktop;

  return (
    <div style={currentWidgetBoxStyle}>
      <h3 style={styles.widgetTitle}>My Courses</h3>
      <div style={styles.widgetContent}>
        {courses?.map((course) => (
          <div key={course.id || course.name} style={currentRowStyle}>
            <div style={styles.courseDetails}>
              <div style={styles.courseName}>{course.name}</div>
              <div style={styles.courseMeta}>{course.duration || 'In Progress'}</div>
            </div>
            <div style={currentBadgeStyle} role="status">
              Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const baseWidgetBox = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  width: '100%',
  boxSizing: 'border-box',
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03), 0 4px 12px rgba(15, 23, 42, 0.02)',
  contain: 'content',
};

const baseRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: '#f1f5f9',
  width: '100%',
  boxSizing: 'border-box',
};

const baseBadge = {
  backgroundColor: '#dcfce7',
  color: '#15803d',
  padding: '6px 12px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '600',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const styles = {
  widgetBoxDesktop: { ...baseWidgetBox, padding: '32px' },
  widgetBoxMobile: { ...baseWidgetBox, padding: '20px' },
  
  widgetTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 24px 0',
    letterSpacing: '-0.4px',
  },
  widgetContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  rowDesktop: { ...baseRow, flexDirection: 'row', alignItems: 'center', gap: '16px' },
  rowMobile: { ...baseRow, flexDirection: 'column', alignItems: 'stretch', gap: '12px' },
  
  courseDetails: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  courseName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  courseMeta: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '4px',
    fontWeight: '500',
  },
  
  badgeDesktop: { ...baseBadge, alignSelf: 'center' },
  badgeMobile: { ...baseBadge, alignSelf: 'flex-start' }
};

export default memo(MyCourses);