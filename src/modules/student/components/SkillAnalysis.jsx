import React, { memo } from 'react';

const SkillAnalysis = ({ skills }) => {
  return (
    <div className="bg-white rounded-2xl w-full p-5 md:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)]">
      <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-[-0.4px]">
        Skill Analysis
      </h3>
      
      <div className="flex flex-col gap-5">
        {skills?.map((skill) => {
          const value = skill.percentage ?? skill.score ?? 0;
          
          return (
            <div key={skill.id || skill.name} className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-semibold leading-none">
                <span className="text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap">
                  {skill.name}
                </span>
                <span className="text-blue-600 tabular-nums">
                  {value}%
                </span>
              </div>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ width: `${value}%` }}
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

export default memo(SkillAnalysis);