import React, { useState, useEffect, memo } from 'react';

const SkillAnalysis = ({ skills }) => {
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

  return (
    <div style={currentWidgetBoxStyle}>
      <h3 style={styles.widgetTitle}>Skill Analysis</h3>
      <div style={styles.widgetContent}>
        {skills?.map((skill) => {
          const value = skill.percentage ?? skill.score ?? 0;
          
          return (
            <div key={skill.id || skill.name} style={styles.progressWrapper}>
              <div style={styles.progressInfo}>
                <span style={styles.skillName}>{skill.name}</span>
                <span style={styles.percentage}>{value}%</span>
              </div>
              <div style={styles.barBg}>
                <div 
                  style={{
                    ...styles.barFill,
                    width: `${value}%`
                  }} 
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          );
        })}
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
    gap: '20px',
  },
  progressWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1',
  },
  skillName: { 
    color: '#334155',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  percentage: { 
    color: 'var(--primary-blue, #1a56df)',
    fontVariantNumeric: 'tabular-nums',
  },
  barBg: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: 'var(--primary-blue, #1a56df)',
    borderRadius: '4px',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'width',
  }
};

export default memo(SkillAnalysis);