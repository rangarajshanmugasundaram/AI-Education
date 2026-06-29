import React, { memo, useMemo } from 'react';
import AppLayout from '../layouts/AppLayout'; 
import StatsCard from '../components/StatsCard';
import MyCourses from '../components/MyCourses';
import SkillAnalysis from '../components/SkillAnalysis';

const statsData = [
  { title: "Total Enrolled Courses", count: 6, color: "#4e73df" },
  { title: "Completed Courses", count: 3, color: "#1cc88a" },
  { title: "Pending Assessments", count: 2, color: "#f6c23e" },
  { title: "Applied Jobs", count: 5, color: "#36b9cc" }
];

const coursesData = [
  { id: 1, name: "Frontend Development with React", progress: 95 },
  { id: 2, name: "Advanced JavaScript (ES6+)", progress: 90 },
  { id: 3, name: "UI/UX Design Fundamentals", progress: 40 }
];

const skillsData = [
  { name: "HTML5 & CSS3", percentage: 95 },
  { name: "JavaScript", percentage: 70 },
  { name: "React.js", percentage: 60 }
];

const StudentDashboard = () => {
  const memoizedStats = useMemo(() => statsData, []);
  const memoizedCourses = useMemo(() => coursesData, []);
  const memoizedSkills = useMemo(() => skillsData, []);

  return (
    <AppLayout>
      <div style={styles.dashboardContainer}>
        
        <section style={styles.statsSection} aria-label="Overview Statistics">
          {memoizedStats.map((item) => (
            <StatsCard 
              key={item.title} 
              title={item.title} 
              count={item.count} 
              color={item.color} 
            />
          ))}
        </section>

        <section style={styles.widgetsGrid} aria-label="Dashboard Widgets">
          <div style={styles.widgetItem}>
            <MyCourses courses={memoizedCourses} />
          </div>
          <div style={styles.widgetItem}>
            <SkillAnalysis skills={memoizedSkills} />
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

const styles = {
  dashboardContainer: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    contain: 'layout style',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '24px', 
    marginBottom: '32px',
    width: '100%',
    minHeight: '120px', 
  },
  widgetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 100%, 480px), 1fr))',
    gap: '32px', 
    alignItems: 'start',
    width: '100%',
  },
  widgetItem: {
    width: '100%',
    minHeight: '300px', 
    borderRadius: '12px',
    overflow: 'hidden',
  }
};

export default memo(StudentDashboard);