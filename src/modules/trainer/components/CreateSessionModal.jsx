import React, { useState, useEffect } from 'react';
import { Video, X, Clock, BookOpen, User, Lock, Layers, Users } from 'lucide-react';
import { fetchBatches } from '../../../services/features/batchService';
import api from '../../../services/api/axiosSetup'; // Adjust relative import path as needed

export const CreateSessionModal = ({ 
  isOpen, 
  onClose, 
  onCreateSession, 
  userRole = 'Trainer' 
}) => {
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    batchId: '',
    batchName: '',
    totalBatchStudents: 25,
    tutorName: '',
    topic: '',
    startTime: '',
    endTime: '',
    sessionId: 'session_101',
  });

  const isTrainer = userRole.toLowerCase() === 'trainer';

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const defaultStart = now.toTimeString().slice(0, 5);
      
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const defaultEnd = oneHourLater.toTimeString().slice(0, 5);

      setFormData({
        batchId: '',
        batchName: isTrainer ? 'Full Stack Web Dev - Batch A' : 'Web Dev Class',
        totalBatchStudents: 25,
        tutorName: isTrainer ? 'John Doe' : '',
        topic: 'React & State Management Basics',
        startTime: defaultStart,
        endTime: defaultEnd,
        sessionId: 'session_101',
      });

      const loadBatchOptions = async () => {
        try {
          setLoadingBatches(true);
          const data = await fetchBatches();

          let batchList = [];
          if (Array.isArray(data)) {
            batchList = data;
          } else if (data && Array.isArray(data.results)) {
            batchList = data.results;
          } else if (data && Array.isArray(data.batches)) {
            batchList = data.batches;
          }

          setBatches(batchList);
        } catch (err) {
          console.error("Failed to load batches in session modal:", err);
        } finally {
          setLoadingBatches(false);
        }
      };

      loadBatchOptions();
    }
  }, [isOpen, isTrainer]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'batchSelect') {
      const selected = batches.find((b) => (b._id || b.id || b.batch_code) === value);
      if (selected) {
        const studentCount = 
          selected.student_ids?.length || 
          selected.students?.length || 
          selected.total_students || 
          selected.student_count || 
          25;

        setFormData((prev) => ({
          ...prev,
          batchId: selected._id || selected.id || selected.batch_code,
          batchName: selected.batch_name || selected.name || selected.batch_code,
          totalBatchStudents: studentCount
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formattedTimeRange = formData.startTime && formData.endTime
      ? `${formData.startTime} - ${formData.endTime}`
      : 'Immediate Live Session';

    const payload = {
      title: formData.topic || 'Classroom Live Session',
      sessionName: formData.topic || 'Classroom Live Session',
      trainerName: formData.tutorName || 'Assigned Trainer',
      trainer_email: 'trainer@aieducation.com',
      batch_code: formData.batchName || 'BATCH-2026-A',
      course_name: formData.topic || 'General Curriculum',
      status: 'live',
      is_live: true,
      total_batch_students: Number(formData.totalBatchStudents) || 25,
      dateTime: formattedTimeRange
    };

    try {
      // ✅ HTTP POST request to Django backend -> Writes document directly into MongoDB 'sessions'
      const res = await api.post('/api/classroom/sessions/', payload);

      if (onCreateSession) {
        onCreateSession(res.data.session || payload);
      }
    } catch (err) {
      console.error("Failed to create session in MongoDB:", err);
      // Fallback local update if backend fails
      if (onCreateSession) onCreateSession(payload);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div style={{ zIndex: 9999 }} className="fixed inset-0 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-xl border-t sm:border border-slate-200/80 flex flex-col overflow-hidden max-h-[88vh] sm:max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200/60 text-slate-700">
              <Video className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                {isTrainer ? 'Start Live Session' : 'Join Live Classroom'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Shared Room: <span className="font-mono font-bold text-slate-700">session_101</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-slate-800 overflow-y-auto custom-scrollbar">
          
          {/* Select Batch Dropdown */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-400" />
              Select Registered Batch
            </label>
            <select
              name="batchSelect"
              onChange={handleChange}
              disabled={loadingBatches || submitting}
              className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800 cursor-pointer disabled:opacity-50"
            >
              <option value="">
                {loadingBatches ? 'Loading registered batches...' : '-- Choose Batch from Admin Records --'}
              </option>
              {batches.map((b) => {
                const bId = b._id || b.id || b.batch_code;
                const bName = b.batch_name || b.name || b.batch_code;
                const count = b.student_ids?.length || b.students?.length || b.total_students || b.student_count || 25;
                return (
                  <option key={bId} value={bId}>
                    {bName} ({count} Enrolled Students)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Batch Name & Total Students Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-3">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-slate-400" />
                Batch / Course Code
              </label>
              <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleChange}
                placeholder="e.g., BATCH-2026-FS1"
                className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3 h-3 text-indigo-600" />
                Total Enrolled Students
              </label>
              <input
                type="number"
                name="totalBatchStudents"
                value={formData.totalBatchStudents}
                onChange={handleChange}
                min="1"
                className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Tutor Name & Topic Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-3">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                Tutor Name
              </label>
              <input
                type="text"
                name="tutorName"
                value={formData.tutorName}
                onChange={handleChange}
                placeholder="e.g., Prof. Alex Robertson"
                className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-slate-400" />
                Session Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Advanced React Hooks"
                className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Start Time & End Time Row */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-3">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Locked Active Room ID */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              Active Room ID
            </label>
            <input
              type="text"
              name="sessionId"
              value="session_101"
              readOnly
              className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-100 border border-slate-200 font-mono font-bold text-slate-700 rounded-lg outline-none cursor-not-allowed select-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto h-10 sm:h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto h-10 sm:h-9 px-5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Video className="w-3.5 h-3.5 text-white" />
              <span>{submitting ? 'Launching...' : (isTrainer ? 'Launch session_101' : 'Enter session_101')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateSessionModal;