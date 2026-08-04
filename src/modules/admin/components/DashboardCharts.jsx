import React from 'react';
import { Users, Radio, CheckCircle2, PieChart, Activity } from 'lucide-react';

export default function DashboardCharts({ stats = {} }) {
  // Safe Fallbacks
  const totalStudents = Number(stats.totalStudents) || 0;
  const totalTrainers = Number(stats.totalTrainers) || 0;
  const activeLiveSessions = Number(stats.activeLiveSessions) || 0;
  const completedSessions = Number(stats.completedSessions) || 0;

  // Calculation 1: User Distribution Breakdown
  const totalUsers = totalStudents + totalTrainers;
  const studentPercentage = totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0;
  const trainerPercentage = totalUsers > 0 ? 100 - studentPercentage : 0;

  // Calculation 2: Session Activity Rate
  const totalSessions = activeLiveSessions + completedSessions;
  const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const activePercentage = totalSessions > 0 ? 100 - completionPercentage : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart Card 1: User Ratio Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Ratio Breakdown</h3>
              <p className="text-xs text-slate-500">Student vs Trainer distribution</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {totalUsers} Total Users
          </span>
        </div>

        {/* Visual Progress Meter */}
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden flex mb-4 border border-slate-200/50">
          <div 
            style={{ width: `${studentPercentage}%` }} 
            className="bg-indigo-600 h-full transition-all duration-700 ease-in-out hover:opacity-90"
            title={`Students: ${studentPercentage}%`}
          />
          <div 
            style={{ width: `${trainerPercentage}%` }} 
            className="bg-purple-500 h-full transition-all duration-700 ease-in-out hover:opacity-90"
            title={`Trainers: ${trainerPercentage}%`}
          />
        </div>

        {/* Legend Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            <span className="text-slate-600 font-medium">
              Students: <strong className="text-slate-900 font-bold">{totalStudents}</strong> ({studentPercentage}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span className="text-slate-600 font-medium">
              Trainers: <strong className="text-slate-900 font-bold">{totalTrainers}</strong> ({trainerPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart Card 2: Live vs Completed Sessions Activity */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Session Activity Rate</h3>
              <p className="text-xs text-slate-500">Real-time session status tracking</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {totalSessions} Sessions
          </span>
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-600 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Completion Rate
              </span>
              <span className="font-bold text-slate-900 font-mono">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden flex border border-slate-200/50">
              <div 
                style={{ width: `${completionPercentage}%` }} 
                className="bg-emerald-500 h-full transition-all duration-700 ease-in-out"
                title={`Completed: ${completionPercentage}%`}
              />
              <div 
                style={{ width: `${activePercentage}%` }} 
                className="bg-rose-500 h-full transition-all duration-700 ease-in-out"
                title={`Active: ${activePercentage}%`}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block"></span>
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Radio className="w-3 h-3 text-rose-500" />
                Active Live: <strong className="text-slate-900 font-bold">{activeLiveSessions}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-600 font-medium">
                Completed: <strong className="text-slate-900 font-bold">{completedSessions}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}