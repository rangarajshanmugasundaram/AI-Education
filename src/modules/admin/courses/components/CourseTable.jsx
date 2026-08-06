import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, UserCheck, Edit3, Archive, Trash2 } from 'lucide-react';

export default function CourseTable({ 
  courses, 
  loading, 
  onEdit, 
  onArchive, 
  onDelete, 
  onOpenAssignTrainer 
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
          <tr>
            <th className="p-3.5">Code & Title</th>
            <th className="p-3.5">Category</th>
            <th className="p-3.5">Assigned Trainer</th>
            <th className="p-3.5">Duration</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-8 text-slate-400">
                Loading courses...
              </td>
            </tr>
          ) : courses.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-8 text-slate-400">
                No courses found.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5">
                  <span className="font-bold text-slate-900 block">{course.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{course.code}</span>
                </td>
                <td className="p-3.5 text-slate-600">{course.category}</td>
                <td className="p-3.5">
                  <span className="text-slate-800 font-semibold">{course.trainer_name || 'Unassigned'}</span>
                  {course.trainer_email && (
                    <span className="text-[10px] text-slate-400 block">{course.trainer_email}</span>
                  )}
                </td>
                <td className="p-3.5 text-slate-500">{course.duration || 'N/A'}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      course.isArchived
                        ? 'bg-slate-100 text-slate-500'
                        : course.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                  >
                    {course.isArchived ? 'Archived' : course.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-1">
                  <button
                    title="View Details"
                    onClick={() => navigate(`/admin/courses/${course._id}`)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Assign Trainer"
                    onClick={() => onOpenAssignTrainer(course)}
                    className="p-1.5 hover:bg-slate-100 rounded text-indigo-600 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => onEdit(course)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title={course.isArchived ? 'Restore' : 'Archive'}
                    onClick={() => onArchive(course._id)}
                    className="p-1.5 hover:bg-amber-50 rounded text-amber-600 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => onDelete(course._id)}
                    className="p-1.5 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
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