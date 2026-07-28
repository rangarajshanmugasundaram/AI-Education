import { useState, useEffect } from 'react';

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
    <div  style={{ zIndex: 9999 }} className="fixed inset-0  flex items-center justify-center bg-slate-950/70 p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isTrainer ? 'Start Live Session' : 'Join Live Classroom'}
            </h3>
            <p className="text-xs text-slate-500">
              Shared Room: <span className="font-mono font-bold text-indigo-600">session_101</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800 overflow-y-auto">
          
          {/* Batch Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Batch / Course Name
            </label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              placeholder="e.g., Full Stack Web Dev"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Tutor Name & Topic Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tutor Name
              </label>
              <input
                type="text"
                name="tutorName"
                value={formData.tutorName}
                onChange={handleChange}
                placeholder="e.g., Prof. Alex Robertson"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Session Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Advanced React Hooks"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Start Time & End Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Locked Session Room ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Active Room ID
            </label>
            <input
              type="text"
              name="sessionId"
              value="session_101"
              readOnly
              className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-300 font-mono font-bold text-slate-700 rounded-xl focus:outline-none transition cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md transition cursor-pointer"
            >
              {isTrainer ? '🚀 Launch session_101' : '🎓 Enter session_101'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateSessionModal;