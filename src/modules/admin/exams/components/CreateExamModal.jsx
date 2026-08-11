import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, HelpCircle, BookOpen } from 'lucide-react';
import { fetchBatches } from '../../../../services/features/batchService';
import { createExam, updateExam } from '../../../../services/features/examService';

export default function CreateExamModal({ isOpen, onClose, examToEdit, onSuccess }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    course_name: 'General Curriculum',
    batch_code: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 40,
    scheduled_date: '',
    status: 'Draft',
    questions: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchBatches().then((res) => {
        const batchList = Array.isArray(res) ? res : (res?.results || res?.batches || []);
        setBatches(batchList);
      }).catch(err => console.error(err));

      if (examToEdit) {
        setFormData({
          title: examToEdit.title || '',
          course_name: examToEdit.course_name || 'General Curriculum',
          batch_code: examToEdit.batch_code || '',
          duration_minutes: examToEdit.duration_minutes || 60,
          total_marks: examToEdit.total_marks || 100,
          passing_marks: examToEdit.passing_marks || 40,
          scheduled_date: examToEdit.scheduled_date || '',
          status: examToEdit.status || 'Draft',
          questions: examToEdit.questions || []
        });
      } else {
        setFormData({
          title: '',
          course_name: 'General Curriculum',
          batch_code: '',
          duration_minutes: 60,
          total_marks: 100,
          passing_marks: 40,
          scheduled_date: new Date().toISOString().slice(0, 16),
          status: 'Draft',
          questions: [
            {
              question_id: 'q_1',
              question_text: '',
              options: ['', '', '', ''],
              correct_option_index: 0,
              marks: 1
            }
          ]
        });
      }
    }
  }, [isOpen, examToEdit]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_id: `q_${prev.questions.length + 1}`,
          question_text: '',
          options: ['', '', '', ''],
          correct_option_index: 0,
          marks: 1
        }
      ]
    }));
  };

  const handleRemoveQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, questions: updated }));
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData(prev => ({ ...prev, questions: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (examToEdit?.exam_id || examToEdit?._id) {
        await updateExam(examToEdit.exam_id || examToEdit._id, formData);
      } else {
        await createExam(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save exam:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {examToEdit ? 'Edit Exam Config' : 'Create New Exam'}
              </h3>
              <p className="text-[11px] text-slate-500">Define schedule, target batch, and question paper</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Exam Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Full Stack Engineering Midterm Assessment"
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Batch</label>
              <select
                required
                value={formData.batch_code}
                onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 cursor-pointer"
              >
                <option value="">-- Choose Batch --</option>
                {batches.map((b) => (
                  <option key={b._id || b.id || b.batch_code} value={b.batch_code || b.batch_name}>
                    {b.batch_name || b.name || b.batch_code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Course Name</label>
              <input
                type="text"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({ ...formData, total_marks: Number(e.target.value) })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Passing Marks</label>
              <input
                type="number"
                value={formData.passing_marks}
                onChange={(e) => setFormData({ ...formData, passing_marks: Number(e.target.value) })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-600"
              />
            </div>
          </div>

          {/* Question Paper Creator */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                Questions Bank ({formData.questions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Question
              </button>
            </div>

            {formData.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Question {qIdx + 1}</span>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                  placeholder="Type the question prompt..."
                  className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                />

                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_${qIdx}`}
                        checked={q.correct_option_index === oIdx}
                        onChange={() => handleQuestionChange(qIdx, 'correct_option_index', oIdx)}
                        className="accent-indigo-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        placeholder={`Option ${oIdx + 1}`}
                        className="w-full px-2.5 h-8 text-xs bg-white border border-slate-200 rounded-md outline-none focus:border-slate-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 h-9 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Exam Config'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}