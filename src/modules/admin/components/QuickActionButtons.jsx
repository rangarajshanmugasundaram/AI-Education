import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionButtons() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Schedule Session', route: '/session-management', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
    { label: 'Manage Attendance', route: '/attendance', color: 'bg-slate-800 hover:bg-slate-900 text-white' },
    { label: 'Broadcast Notification', route: '/notifications', color: 'bg-amber-600 hover:bg-amber-700 text-white' },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h3 className="text-base font-semibold text-slate-800 mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((act, index) => (
          <button
            key={index}
            onClick={() => navigate(act.route)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${act.color}`}
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}