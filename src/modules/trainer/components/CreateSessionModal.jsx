import { useState, useEffect } from 'react';
import { Video, X, Clock, BookOpen, User, Lock, Layers } from 'lucide-react';

export const CreateSessionModal = ({ 
  isOpen, 
  onClose, 
  onCreateSession, 
  userRole = 'Trainer' 
}) => {
  const [formData, setFormData] = useState({
    batchName: '',
    tutorName: '',
    topic: '',
    startTime: '',
    endTime: '',
    sessionId: 'session_101',
  });

  const isTrainer = userRole.toLowerCase() === 'trainer';

  // Reset defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const defaultStart = now.toTimeString().slice(0, 5); // HH:MM
      
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const defaultEnd = oneHourLater.toTimeString().slice(0, 5); // HH:MM

      setFormData({
        batchName: isTrainer ? 'Full Stack Web Dev - Batch A' : 'Web Dev Class',
        tutorName: isTrainer ? 'John Doe' : '',
        topic: 'React & State Management Basics',
        startTime: defaultStart,
        endTime: defaultEnd,
        sessionId: 'session_101',
      });
    }
  }, [isOpen, isTrainer]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedTimeRange = formData.startTime && formData.endTime
      ? `${formData.startTime} - ${formData.endTime}`
      : 'Immediate Live Session';

    onCreateSession({
      batchName: formData.batchName || 'Default Batch',
      tutorName: formData.tutorName,
      topic: formData.topic,
      dateTime: formattedTimeRange,
      sessionId: 'session_101', // Enforced static session ID
      createdByRole: userRole,
    });

    onClose();
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
          
          {/* Batch / Course Name */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-400" />
              Batch / Course Name
            </label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              placeholder="e.g., Full Stack Web Dev"
              className="w-full px-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-800"
            />
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
              className="w-full sm:w-auto h-10 sm:h-9 px-5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-white" />
              <span>{isTrainer ? 'Launch session_101' : 'Enter session_101'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateSessionModal;