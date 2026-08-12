import { Edit3, Trash2, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function AssignmentTableRoster({ assignments, loading, onToggleStatus, onEdit, onDelete, onViewRoster }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
          <tr>
            <th className="p-4">Assignment Title</th>
            <th className="p-4">Batch</th>
            <th className="p-4">Due Date</th>
            <th className="p-4">Marks</th>
            <th className="p-4">Submissions</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {loading ? (
            <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">Loading coursework data...</td></tr>
          ) : assignments.length === 0 ? (
            <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">No assignments created yet. Click "Create Assignment" to start.</td></tr>
          ) : (
            assignments.map((a) => (
              <tr key={a.assignment_id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900 leading-snug">{a.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{a.course_name}</div>
                </td>
                <td className="p-4 font-mono text-indigo-600 font-bold">{a.batch_code}</td>
                <td className="p-4 font-mono text-slate-600">
                  {new Date(a.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="p-4 font-mono font-bold text-slate-800">{a.total_marks}</td>
                <td className="p-4 font-mono">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-bold">
                    {a.total_submissions} Submitted
                  </span>
                </td>
                <td className="p-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="p-4 text-right space-x-1">
                  
                  {/* Quick Publish / Close Toggle */}
                  <button
                    onClick={() => onToggleStatus(a.assignment_id, a.status)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    {a.status === 'Published' || a.status === 'Open' ? 'Close' : 'Publish'}
                  </button>

                  {/* Open Roster */}
                  <button
                    onClick={() => onViewRoster(a)}
                    className="p-1.5 rounded-lg border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                    title="View Roster & Grade Work"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(a)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    title="Edit Assignment"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(a.assignment_id)}
                    className="p-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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