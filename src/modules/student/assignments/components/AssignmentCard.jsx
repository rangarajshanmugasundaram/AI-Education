import React from 'react';
import { Clock, Award, Upload, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

export default function AssignmentCard({ assignment, onOpenSubmit }) {
  const isSubmitted = Boolean(assignment.student_submission);
  const sub = assignment.student_submission;
  const isPastDue = new Date() > new Date(assignment.due_date);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
      
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Batch: {assignment.batch_code}
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-400">
            {assignment.total_marks} Marks
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
          {assignment.title}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2">
          {assignment.description || assignment.instructions || "No additional instructions provided."}
        </p>
      </div>

      {/* Due Date & Submission Status */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Due:
          </span>
          <span className={`font-bold ${isPastDue && !isSubmitted ? 'text-rose-600' : 'text-slate-800'}`}>
            {new Date(assignment.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </div>

        {/* State Display: Submitted vs Pending Submission */}
        {isSubmitted ? (
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
              </span>
              {sub.is_late && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded flex items-center gap-0.5 font-mono">
                  <AlertTriangle className="w-2.5 h-2.5" /> LATE
                </span>
              )}
            </div>

            {/* Evaluation Marks or Pending Status */}
            {sub.obtained_marks !== null && sub.obtained_marks !== undefined ? (
              <div className="space-y-1 pt-1 border-t border-slate-200/50">
                <div className="text-xs font-bold text-slate-900 font-mono">
                  Score: {sub.obtained_marks} / {assignment.total_marks} ({sub.grade})
                </div>
                {sub.feedback && (
                  <p className="text-[10px] text-slate-600 italic bg-white p-1.5 rounded border border-slate-100">
                    "{sub.feedback}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic">Pending Trainer Evaluation</div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenSubmit(assignment)}
            className="w-full h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit Work</span>
          </button>
        )}
      </div>

    </div>
  );
}