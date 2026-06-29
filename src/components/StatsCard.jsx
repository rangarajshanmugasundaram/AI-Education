import React, { memo } from 'react';

const StatsCard = ({ title, count, color }) => {
  return (
    <div style={styles.analyticsCard}>
      <div style={styles.textContainer}>
        <div style={styles.analyticsCardTitle}>{title}</div>
        <div style={styles.analyticsCardCount}>{count}</div>
      </div>
      
      {color && (
        <div 
          style={{
            ...styles.indicatorDot,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}40`,
          }} 
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const styles = {
  analyticsCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03), 0 4px 12px rgba(15, 23, 42, 0.02)',
    width: '100%',
    boxSizing: 'border-box',
    contain: 'content',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  analyticsCardTitle: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  analyticsCardCount: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2',
  },
  indicatorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginLeft: '16px',
    flexShrink: 0,
  }
};

export default memo(StatsCard);