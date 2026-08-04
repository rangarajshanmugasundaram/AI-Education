import React from 'react';

export default function StatCard({ title, value, icon: Icon, badgeText, badgeColor = 'bg-blue-100 text-blue-800' }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-800">{value ?? 0}</h3>
        {badgeText && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}