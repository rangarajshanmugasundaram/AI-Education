import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, Search, Play } from 'lucide-react';
import { fetchExams } from '../../../services/features/examService';
import TakeExamModal from './TakeExamModal';

export default function StudentExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isTakeExamOpen, setIsTakeExamOpen] = useState(false);

  // Retrieve logged-in student info dynamically
  const studentEmail = localStorage.getItem('user_email') || '';
  const studentRole = localStorage.getItem('user_role') || 'Student';

  const loadExams = async () => {
    setLoading(true);
    try {
      const res = await fetchExams();
      setExams(res.data || []);
    } catch (err) {
      console.error("Failed to load student exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.course_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Available Examinations & Quizzes</h1>
          <p className="text-xs text-slate-500">
            Active tests assigned to your batch
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams by title..."
            className="w-full pl-8 pr-3 h-9 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition"
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-bold text-slate-400">Loading active exams...</div>
      ) : filteredExams.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No Published Exams Available</p>
          <p className="text-[11px] text-slate-400">Exams published for your assigned batch will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((e) => (
            <div
              key={e.exam_id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {e.status}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {e.total_questions} Questions
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {e.title}
                </h3>
                <p className="text-[11px] text-slate-500">{e.course_name}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{e.duration_minutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{e.total_marks} Marks</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedExamId(e.exam_id);
                    setIsTakeExamOpen(true);
                  }}
                  className="w-full h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Attempt Exam</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Take Exam Modal */}
      <TakeExamModal
        isOpen={isTakeExamOpen}
        onClose={() => setIsTakeExamOpen(false)}
        examId={selectedExamId}
        studentInfo={{ email: studentEmail, name: studentEmail.split('@')[0] }}
        onSuccess={loadExams}
      />

    </div>
  );
}