import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

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

  return ReactDOM.createPortal(
    <div 
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{ zIndex: 99999 }}
      className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-none overflow-y-auto p-5 sm:p-6 border border-slate-100 transform transition-all flex flex-col">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5 shrink-0">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Schedule New Live Session
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
    </div>,
    document.body
  );
}