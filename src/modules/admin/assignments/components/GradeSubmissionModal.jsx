import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { gradeSubmission } from '../../../../services/features/assignmentService';

export default function GradeSubmissionModal({ isOpen, onClose, submission, assignmentMarks, onSuccess }) {
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submission) {
      setObtainedMarks(submission.obtained_marks !== null && submission.obtained_marks !== undefined ? submission.obtained_marks : '');
      setFeedback(submission.feedback || '');
    }
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await gradeSubmission(submission.submission_id || submission.id, {
        obtained_marks: Number(obtainedMarks),
        feedback
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Grading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 relative">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Evaluate Submission</h3>
              <p className="text-[11px] text-slate-500">{submission.student_name} ({submission.student_email})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGradeSubmit} className="p-5 space-y-4">
          
          {/* Late Badge Indicator */}
          {submission.is_late && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Late Submission — Submitted after due date ({new Date(submission.submitted_at).toLocaleString()})</span>
            </div>
          )}

          {/* Student Submitted Answer / Content */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Student Work / Text</label>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
              {submission.submission_text || "No response text typed."}
            </div>
          </div>

          {/* Student Submitted Links */}
          {submission.file_urls?.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Attached Files / Links</label>
              <div className="space-y-1">
                {submission.file_urls.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-600 hover:underline flex items-center justify-between"
                  >
                    <span className="truncate">{link}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation Input */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Obtained Marks</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  min="0"
                  max={assignmentMarks || 100}
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold font-mono focus:bg-white focus:border-slate-900"
                />
                <span className="text-xs font-bold text-slate-400 font-mono">/ {assignmentMarks || 100}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Trainer Feedback / Comments</label>
            <textarea
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback for the student..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save Evaluation'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}