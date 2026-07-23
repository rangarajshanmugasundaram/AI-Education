import React, { useState, useEffect } from 'react';

export const CreateSessionModal = ({ 
  isOpen, 
  onClose, 
  onCreateSession, 
  userRole = 'Trainer' 
}) => {
  const [formData, setFormData] = useState({
    batchName: '',
    sessionId: 'session_101', // 👈 FIXED DEFAULT SESSION ID FOR BOTH ROLES
    date: '',
    time: '',
  });

  const isTrainer = userRole.toLowerCase() === 'trainer';

  // Always reset/enforce 'session_101' when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        batchName: isTrainer ? 'Full Stack Web Dev - Batch A' : 'Web Dev Class',
        sessionId: 'session_101', // 👈 Fixed room ID so Trainer & Student share the same room
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
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

    const formattedDateTime = formData.date && formData.time 
      ? `${formData.date} at ${formData.time}`
      : 'Immediate Live Session';

    onCreateSession({
      batchName: formData.batchName || 'Default Batch',
      sessionId: 'session_101', // 👈 Enforce default session ID
      dateTime: formattedDateTime,
      createdByRole: userRole,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isTrainer ? 'Start Live Session' : 'Join Live Classroom'}
            </h3>
            <p className="text-xs text-slate-500">
              Shared Room: <span className="font-mono font-bold text-indigo-600">session_101</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
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
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
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