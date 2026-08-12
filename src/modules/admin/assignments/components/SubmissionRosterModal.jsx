import React, { useState, useEffect } from 'react';
import { X, Users, AlertTriangle, CheckCircle2, Clock, Award } from 'lucide-react';
import { fetchSubmissionsRoster, fetchAssignmentAnalytics } from '../../../../services/features/assignmentService';
import GradeSubmissionModal from './GradeSubmissionModal';

export default function SubmissionRosterModal({ isOpen, onClose, assignment }) {
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const loadData = () => {
    if (assignment?.assignment_id || assignment?._id) {
      const id = assignment.assignment_id || assignment._id;
      setLoading(true);
      Promise.all([
        fetchSubmissionsRoster(id),
        fetchAssignmentAnalytics(id)
      ])
        .then(([rosterRes, analyticsRes]) => {
          setSubmissions(rosterRes.data || []);
          setAnalytics(analyticsRes.analytics || null);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen, assignment]);

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 border-b border-slate-100 pr-12 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Submissions & Evaluation Roster</h3>
              <p className="text-[11px] text-slate-500">{assignment.title} • Batch: {assignment.batch_code}</p>
            </div>
          </div>

          {/* Quick Analytics Header Cards */}
          {analytics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Submission Rate</span>
                <span className="text-sm font-black text-indigo-600 font-mono">{analytics.submission_rate}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Late Submissions</span>
                <span className="text-sm font-black text-rose-600 font-mono">{analytics.late_submissions}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Graded</span>
                <span className="text-sm font-black text-emerald-600 font-mono">{analytics.graded_submissions}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Class Average</span>
                <span className="text-sm font-black text-slate-800 font-mono">{analytics.average_score}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submissions Table */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">Loading Student Submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No student submissions logged yet.</div>
          ) : (
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Submitted Date</th>
                    <th className="p-3">Late Status</th>
                    <th className="p-3">Marks</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {submissions.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{s.student_name}</div>
                        <div className="text-[10px] text-slate-400">{s.student_email}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {new Date(s.submitted_at).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {s.is_late ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Late
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> On-Time
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono">
                        {s.obtained_marks !== null && s.obtained_marks !== undefined ? (
                          <span className="font-bold text-slate-900">{s.obtained_marks} / {assignment.total_marks} ({s.grade})</span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          s.submission_status === 'Graded'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {s.submission_status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedSubmission(s)}
                          className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 cursor-pointer"
                        >
                          {s.submission_status === 'Graded' ? 'Edit Grade' : 'Grade Work'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Grade Submission Modal */}
      <GradeSubmissionModal
        isOpen={Boolean(selectedSubmission)}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
        assignmentMarks={assignment.total_marks}
        onSuccess={loadData}
      />
    </div>
  );
}