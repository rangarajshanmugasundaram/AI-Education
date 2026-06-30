import React, { memo, useMemo } from 'react';
import AppLayout from "../../../layouts/AppLayout";
import StatsCard from "../components/StatsCard";
import MyCourses from "../components/MyCourses";
import SkillAnalysis from "../components/SkillAnalysis";

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
      <div className="w-full p-2 md:p-4">
        
        <section 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full min-h-[120px]" 
          aria-label="Overview Statistics"
        >
          {memoizedStats.map((item) => (
            <StatsCard 
              key={item.title} 
              title={item.title} 
              count={item.count} 
              color={item.color} 
            />
          ))}
        </section>

        <section 
          className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start w-full" 
          aria-label="Dashboard Widgets"
        >
          <div className="w-full min-h-[300px] overflow-hidden rounded-xl">
            <MyCourses courses={memoizedCourses} />
          </div>
          <div className="w-full min-h-[300px] overflow-hidden rounded-xl">
            <SkillAnalysis skills={memoizedSkills} />
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

export default memo(StudentDashboard);