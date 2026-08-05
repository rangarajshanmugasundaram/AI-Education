import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function UserFilters({ 
  search, 
  setSearch, 
  roleFilter, 
  setRoleFilter, 
  statusFilter, 
  setStatusFilter, 
  onReset 
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all"
        />
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Role Select */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Trainer">Trainer</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Status Select */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}