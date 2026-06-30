import React, { memo } from 'react';

const StatsCard = ({ title, count, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl flex justify-between items-center shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] w-full">
      <div className="flex flex-col min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-500 mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </div>
        <div className="text-3xl font-bold text-slate-900 leading-tight">
          {count}
        </div>
      </div>
      
      {color && (
        <div 
          className="w-3 h-3 rounded-full ml-4 flex-shrink-0"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}40`
          }} 
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default memo(StatsCard);