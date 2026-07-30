import React from 'react';

export default function RecordingFilters({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search recordings by title..."
        className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs outline-none focus:border-blue-500"
      />
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs outline-none focus:border-blue-500"
      >
        <option value="All">All Statuses</option>
        <option value="Ready">Ready</option>
        <option value="Processing">Processing</option>
      </select>
    </div>
  );
}