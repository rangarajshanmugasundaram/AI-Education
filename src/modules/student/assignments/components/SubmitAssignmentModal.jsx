import React, { useState, useEffect } from 'react';
import { X, Send, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { submitAssignment } from '../../../../services/features/assignmentService';

export default function SubmitAssignmentModal({ isOpen, onClose, assignment, studentInfo, onSuccess }) {
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrls, setFileUrls] = useState(['']);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmissionText('');
      setFileUrls(['']);
    }
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  const isPastDue = new Date() > new Date(assignment.due_date);

  const handleUrlChange = (idx, val) => {
    const updated = [...fileUrls];
    updated[idx] = val;
    setFileUrls(updated);
  };

  const addUrlField = () => setFileUrls([...fileUrls, '']);
  const removeUrlField = (idx) => setFileUrls(fileUrls.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        student_name: studentInfo?.name || localStorage.getItem('user_email')?.split('@')[0] || 'Student',
        student_email: studentInfo?.email || localStorage.getItem('user_email') || 'student@aieducation.com',
        submission_text: submissionText,
        file_urls: fileUrls.filter((u) => u.trim() !== '')
      };

      await submitAssignment(assignment.assignment_id || assignment._id, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit assignment:", err);
      alert("Submission failed. The assignment might be closed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{assignment.title}</h3>
            <p className="text-[11px] text-slate-500">
              Deadline: {new Date(assignment.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Late Submission Warning Banner */}
          {isPastDue && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Due date has passed. Your submission will be recorded as **LATE**.</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Submission Write-Up / Text</label>
            <textarea
              rows="4"
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your answer, project overview, or notes for the trainer..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 resize-none font-sans"
            />
          </div>

          {/* Dynamic Link URL Inputs */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Project / GitHub / Drive Link URLs</label>
              <button
                type="button"
                onClick={addUrlField}
                className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>

            {fileUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  placeholder="https://github.com/username/project or drive link"
                  className="w-full px-3 h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                />
                {fileUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(idx)}
                    className="text-rose-500 p-1 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
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
              disabled={submitting}
              className="px-5 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit Final Work'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}