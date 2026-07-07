import React, { memo } from 'react';

const MyCourses = ({ courses }) => {
  return (
    <div className="bg-white rounded-2xl w-full p-5 md:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)]">
      <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-[-0.4px]">
        My Courses
      </h3>
      
      <div className="flex flex-col gap-4">
        {courses?.map((course) => (
          <div 
            key={course.id || course.name} 
            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-slate-100 gap-3 md:gap-4"
          >
            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
              <div className="text-[15px] font-semibold text-slate-800 truncate">
                {course.name}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                {course.duration || 'In Progress'}
              </div>
            </div>
            
            <div 
              className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap self-start md:self-center" 
              role="status"
            >
              Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MyCourses);