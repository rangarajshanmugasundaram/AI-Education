import React from 'react';
import { X } from 'lucide-react';

export default function BatchFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  courses = [],
  trainers = [],
  isEditing = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl"
      >
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isEditing ? 'Edit Batch' : 'Create New Batch'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Batch Name</label>
          <input
            required
            type="text"
            placeholder="e.g. Morning Cohort A"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Batch Code</label>
          <input
            required
            type="text"
            placeholder="e.g. BATCH-2026-A"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Linked Course</label>
          <select
            value={formData.course_id || ''}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="">-- Choose Linked Course --</option>
            {courses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.title} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assigned Trainer</label>
          <select
            value={formData.trainer_id || ''}
            onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="">-- Choose Lead Trainer --</option>
            {trainers.map((t) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Student Capacity</label>
          <input
            type="number"
            min="1"
            value={formData.max_capacity}
            onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded cursor-pointer shadow-xs"
          >
            Save Batch
          </button>
        </div>
      </form>
    </div>
  );
}