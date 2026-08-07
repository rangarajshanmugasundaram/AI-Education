import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, UserPlus, UserCheck, Edit3 } from 'lucide-react';

export default function BatchTable({
  batches,
  loading,
  onOpenStudentAllocation,
  onOpenTrainerAllocation,
  onEdit
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
          <tr>
            <th className="p-3.5">Code & Name</th>
            <th className="p-3.5">Linked Course</th>
            <th className="p-3.5">Assigned Trainer</th>
            <th className="p-3.5">Capacity</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-8 text-slate-400">
                Loading batches...
              </td>
            </tr>
          ) : batches.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-8 text-slate-400">
                No batches found.
              </td>
            </tr>
          ) : (
            batches.map((batch) => (
              <tr key={batch._id || batch.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5">
                  <span className="font-bold text-slate-900 block">{batch.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{batch.code}</span>
                </td>
                <td className="p-3.5 text-slate-700 font-semibold">{batch.course_name || 'Unassigned'}</td>
                <td className="p-3.5 text-slate-800">{batch.trainer_name || 'Unassigned'}</td>
                <td className="p-3.5 text-slate-600 font-mono">
                  {batch.enrolled_students_count || 0} / {batch.max_capacity}
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {batch.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-1">
                  <button
                    title="View Embedded Details"
                    onClick={() => navigate(`/admin/batches/${batch._id || batch.id}`)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Allocate Students"
                    onClick={() => onOpenStudentAllocation(batch)}
                    className="p-1.5 hover:bg-slate-100 rounded text-indigo-600 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Assign Trainer"
                    onClick={() => onOpenTrainerAllocation(batch)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Edit Batch"
                    onClick={() => onEdit(batch)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}