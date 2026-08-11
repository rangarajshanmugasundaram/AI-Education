import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function ResultCharts({ analytics }) {
  if (!analytics) return null;

  const passData = [
    { name: 'Passed', value: analytics.passed_count, color: '#10b981' },
    { name: 'Failed', value: analytics.failed_count, color: '#f43f5e' },
  ].filter(d => d.value > 0);

  const distData = Object.entries(analytics.score_distribution || {}).map(([range, count]) => ({
    range,
    Students: count
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pass / Fail Pie Chart */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
          Pass vs Fail Breakdown
        </h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={passData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                {passData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold">
          <span className="text-emerald-600 font-mono">Passed: {analytics.pass_percentage}</span>
          <span className="text-rose-600 font-mono">Failed: {analytics.fail_percentage}</span>
        </div>
      </div>

      {/* Score Range Histogram */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
          Score Range Distribution
        </h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData}>
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="Students" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}