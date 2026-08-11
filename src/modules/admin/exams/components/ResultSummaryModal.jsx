import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, XCircle } from 'lucide-react';
import { fetchExamResults, fetchExamAnalytics } from '../../../../services/features/examService';
import ResultCharts from './ResultCharts';

export default function ResultSummaryModal({ isOpen, onClose, examId, examTitle }) {
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && examId) {
      setLoading(true);
      Promise.all([
        fetchExamResults(examId),
        fetchExamAnalytics(examId)
      ]).then(([resData, analyticsData]) => {
        setResults(resData.data || []);
        setAnalytics(analyticsData.analytics || null);
      }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, examId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 border-b border-slate-100 pr-12 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Exam Results & Analytics</h3>
              <p className="text-[11px] text-slate-500">{examTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'summary' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Student Roster ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Performance Charts & Analytics
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">Loading Exam Performance Data...</div>
          ) : activeTab === 'summary' ? (
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Obtained Marks</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-slate-400">No attempts logged for this exam.</td>
                    </tr>
                  ) : (
                    results.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{r.student_name}</td>
                        <td className="p-3 font-mono">{r.obtained_marks}/{r.total_marks}</td>
                        <td className="p-3 font-mono">{r.percentage}%</td>
                        <td className="p-3"><span className="font-bold font-mono px-1.5 py-0.5 bg-slate-100 rounded">{r.grade}</span></td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            r.status === 'Passed' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {r.status === 'Passed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pass Rate</span>
                  <span className="text-base font-black text-emerald-600 font-mono">{analytics?.pass_percentage || '0.0%'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Score</span>
                  <span className="text-base font-black text-slate-800 font-mono">{analytics?.average_score || 0}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Highest Score</span>
                  <span className="text-base font-black text-indigo-600 font-mono">{analytics?.highest_score || 0}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Completion</span>
                  <span className="text-base font-black text-slate-800 font-mono">{analytics?.completion_rate || '0.0%'}</span>
                </div>
              </div>

              <ResultCharts analytics={analytics} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}