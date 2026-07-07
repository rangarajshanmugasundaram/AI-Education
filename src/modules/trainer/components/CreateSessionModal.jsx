import { useState, useEffect, useRef } from 'react';

const MOCK_BATCHES = [
  { id: 'b1', name: 'Full Stack JavaScript - Batch A' },
  { id: 'b2', name: 'React Frontend Development - Morning' },
  { id: 'b3', name: 'UI/UX Design Masterclass - Evening' }
];

export default function CreateSessionModal({ isOpen, onClose, onCreateSession }) {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const backdropRef = useRef(null);

  // Safely handle closing on Escape press
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean form state reset logic when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBatch('');
      setSessionDate('');
      setSessionTime('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatch || !sessionDate || !sessionTime) {
      alert("Please fill in all fields to generate the meeting!");
      return;
    }

    const batchName = MOCK_BATCHES.find(b => b.id === selectedBatch)?.name;

    onCreateSession({
      batchName,
      dateTime: `${sessionDate} at ${sessionTime}`,
    });
  };

  return (
    <div 
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[92vh] sm:max-h-none overflow-y-auto p-5 sm:p-6 border border-slate-100 transform transition-all flex flex-col">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-5 shrink-0">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Schedule New Live Session
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 text-2xl h-11 w-11 -mr-2 leading-none transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 pb-4 sm:pb-0">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full h-11 sm:h-10 border border-slate-200 rounded-xl px-3 bg-white text-base sm:text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">-- Choose a Batch --</option>
              {MOCK_BATCHES.map(batch => (
                <option key={batch.id} value={batch.id}>{batch.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Choose Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full h-11 sm:h-10 border border-slate-200 rounded-xl px-3 text-base sm:text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Choose Time</label>
              <input
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full h-11 sm:h-10 border border-slate-200 rounded-xl px-3 text-base sm:text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-11 sm:h-9 px-4 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 sm:h-9 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm sm:text-xs font-semibold shadow-sm transition-all"
            >
              Generate Meeting & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}