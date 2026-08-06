import React from 'react';
import { Search } from 'lucide-react';

export default function CourseFilters({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onReset
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-3 shadow-xs">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search code, title, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="py-1.5 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
      >
        <option value="all">All Categories</option>
        <option value="General">General</option>
        <option value="Programming">Programming</option>
        <option value="AI & ML">AI & ML</option>
        <option value="Design">Design</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="py-1.5 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
      >
        <option value="all">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Archived">Archived</option>
      </select>

      <button
        onClick={onReset}
        className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}