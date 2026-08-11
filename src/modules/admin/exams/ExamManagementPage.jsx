import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, BarChart2 } from 'lucide-react';
import { fetchExams, toggleExamPublishStatus, deleteExam } from '../../../services/features/examService';
import CreateExamModal from './components/CreateExamModal';
import ResultSummaryModal from './components/ResultSummaryModal';

export default function ExamManagementPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedExamForEdit, setSelectedExamForEdit] = useState(null);
  
  const [selectedExamForResults, setSelectedExamForResults] = useState(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const loadExams = async () => {
    setLoading(true);
    try {
      const res = await fetchExams();
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleTogglePublish = async (examId, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Unpublished' : 'Published';
    await toggleExamPublishStatus(examId, newStatus);
    loadExams();
  };

  const handleDelete = async (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      await deleteExam(examId);
      loadExams();
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Exam & Assessment Engine</h1>
          <p className="text-xs text-slate-500">Configure exams, manage publish states, and inspect student performance</p>
        </div>
        <button
          onClick={() => { setSelectedExamForEdit(null); setIsCreateOpen(true); }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Exam
        </button>
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
            <tr>
              <th className="p-4">Exam Title</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Marks</th>
              <th className="p-4">Attempts</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="p-6 text-center text-slate-400">Loading exams...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan="7" className="p-6 text-center text-slate-400">No exams registered yet.</td></tr>
            ) : (
              exams.map((e) => (
                <tr key={e.exam_id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{e.title}</td>
                  <td className="p-4 font-mono text-slate-600">{e.batch_code}</td>
                  <td className="p-4 font-mono">{e.duration_minutes} mins</td>
                  <td className="p-4 font-mono">{e.total_marks} (Pass: {e.passing_marks})</td>
                  <td className="p-4 font-mono">{e.total_attempts}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      e.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    
                    <button
                      onClick={() => handleTogglePublish(e.exam_id, e.status)}
                      className="px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      {e.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => { setSelectedExamForResults(e); setIsResultsOpen(true); }}
                      className="p-1.5 rounded-lg border text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                      title="View Results & Analytics"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => { setSelectedExamForEdit(e); setIsCreateOpen(true); }}
                      className="p-1.5 rounded-lg border text-slate-600 hover:bg-slate-50 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(e.exam_id)}
                      className="p-1.5 rounded-lg border text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete"
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

      {/* Modals */}
      <CreateExamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        examToEdit={selectedExamForEdit}
        onSuccess={loadExams}
      />

      <ResultSummaryModal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
        examId={selectedExamForResults?.exam_id}
        examTitle={selectedExamForResults?.title}
      />

    </div>
  );
}