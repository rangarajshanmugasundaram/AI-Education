import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, CheckCircle2, Award, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { fetchExamById, submitExam } from '../../../services/features/examService';

export default function TakeExamModal({ isOpen, onClose, examId, studentInfo, onSuccess }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submissionResult, setSubmissionResult] = useState(null);

  // Fetch full exam details including question bank
  useEffect(() => {
    if (isOpen && examId) {
      setLoading(true);
      setSubmissionResult(null);
      setSelectedAnswers({});
      setCurrentQuestionIdx(0);

      fetchExamById(examId)
        .then((res) => {
          const examData = res.data || res;
          setExam(examData);
          setTimeLeft((examData.duration_minutes || 60) * 60);
        })
        .catch((err) => console.error("Failed to fetch exam:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, examId]);

  // Exam Countdown Timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || submissionResult || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, submissionResult, exam]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (submissionResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!exam) return;
    
    if (!window.confirm("Are you sure you want to submit your exam now?")) {
      return;
    }

    executeSubmission();
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Your exam responses are being submitted automatically.");
    executeSubmission();
  };

  const executeSubmission = async () => {
    setSubmitting(true);
    try {
      const payload = {
        student_name: studentInfo?.name || 'Logged Student',
        student_email: studentInfo?.email || 'student@aieducation.com',
        answers: selectedAnswers
      };

      const res = await submitExam(exam.exam_id || exam._id || examId, payload);
      setSubmissionResult(res.result || res);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const questions = exam?.questions || [];
  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 relative">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{exam?.title || 'Online Assessment'}</h3>
            <p className="text-[11px] text-slate-500">
              Batch: <span className="font-mono font-bold text-slate-700">{exam?.batch_code}</span> • Total Marks: <span className="font-mono font-bold text-slate-700">{exam?.total_marks}</span>
            </p>
          </div>

          {!submissionResult && (
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold ${
                timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {formatTime(timeLeft)}
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-xs font-bold text-slate-400">Loading Exam Questions...</div>
          ) : submissionResult ? (
            
            /* RESULT SUMMARY POST-SUBMISSION VIEW */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">Exam Submitted Successfully!</h4>
                <p className="text-xs text-slate-500">Your answers have been evaluated automatically.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Obtained Marks</span>
                  <span className="text-base font-black font-mono text-slate-900">{submissionResult.obtained_marks} / {submissionResult.total_marks}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Percentage</span>
                  <span className="text-base font-black font-mono text-slate-900">{submissionResult.percentage}%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Grade</span>
                  <span className="text-base font-black font-mono text-indigo-600">{submissionResult.grade}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Result Status</span>
                  <span className={`text-base font-black font-mono ${submissionResult.status === 'Passed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {submissionResult.status}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  Back to Exams Roster
                </button>
              </div>
            </div>

          ) : questions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No questions available in this exam.</div>
          ) : (

            /* QUESTION & ANSWER SELECTION VIEW */
            <div className="space-y-6">
              
              {/* Question Navigation Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
                {questions.map((q, idx) => {
                  const qId = q.question_id || `q_${idx + 1}`;
                  const isAnswered = selectedAnswers[qId] !== undefined;
                  const isCurrent = idx === currentQuestionIdx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-900 text-white ring-2 ring-slate-900/20'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Box */}
              {currentQ && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
                      Question {currentQuestionIdx + 1} of {questions.length}
                    </span>
                    <span className="text-[11px] font-bold font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {currentQ.marks || 1} {currentQ.marks === 1 ? 'Mark' : 'Marks'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
                    {currentQ.question_text}
                  </h4>

                  {/* Options List */}
                  <div className="space-y-2 pt-2">
                    {currentQ.options?.map((optText, oIdx) => {
                      const qId = currentQ.question_id || `q_${currentQuestionIdx + 1}`;
                      const isSelected = selectedAnswers[qId] === oIdx;

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(qId, oIdx)}
                          className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-bold shadow-2xs'
                              : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border text-[10px] font-mono font-bold flex items-center justify-center ${
                              isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-300'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{optText}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!submissionResult && !loading && questions.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
              className="px-3.5 h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="flex items-center gap-2">
              {currentQuestionIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                  className="px-4 h-8 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Submit Final Exam'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}