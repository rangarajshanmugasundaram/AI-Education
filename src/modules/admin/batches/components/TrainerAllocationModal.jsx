import React from 'react';
import { X } from 'lucide-react';

export default function TrainerAllocationModal({
  isOpen,
  onClose,
  onSubmit,
  trainers = [],
  assignedTrainerId,
  setAssignedTrainerId,
  batchName
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl"
      >
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Assign Lead Trainer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Batch: <strong className="text-slate-800">{batchName}</strong></p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Trainer</label>
          <select
            required
            value={assignedTrainerId}
            onChange={(e) => setAssignedTrainerId(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="">-- Choose a Trainer --</option>
            {trainers.map((t) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>
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
            className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer shadow-xs"
          >
            Assign
          </button>
        </div>
      </form>
    </div>
  );
}