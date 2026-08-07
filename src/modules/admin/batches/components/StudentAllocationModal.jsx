import React, { useState, useEffect } from 'react';
import { Search, UserPlus, X } from 'lucide-react';

export default function StudentAllocationModal({
  isOpen,
  onClose,
  onSubmit,
  allStudents,
  currentStudentIds = [],
  batchName
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSelectedIds(currentStudentIds);
  }, [currentStudentIds, isOpen]);

  if (!isOpen) return null;

  const filteredStudents = allStudents.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedIds);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <form onSubmit={handleFormSubmit} className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Allocate Students
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Batch: <strong className="text-slate-800">{batchName}</strong> ({selectedIds.length} selected)
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">No students found.</div>
          ) : (
            filteredStudents.map((student) => {
              const sid = student._id || student.id;
              const isChecked = selectedIds.includes(sid);
              return (
                <label
                  key={sid}
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    isChecked ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStudent(sid)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{student.email}</p>
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer shadow-xs">
            Save Allocation
          </button>
        </div>
      </form>
    </div>
  );
}