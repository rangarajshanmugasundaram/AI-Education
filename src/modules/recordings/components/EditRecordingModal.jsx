import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Edit3 } from 'lucide-react';
import { recordingService } from '../../../services/features/recordingService';

export default function EditRecordingModal({ isOpen, onClose, recording, onUpdateSuccess }) {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('Public Batch');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recording) {
      setTitle(recording.title || '');
      setVisibility(recording.visibility || 'Public Batch');
    }
  }, [recording]);

  if (!isOpen || !recording) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await recordingService.updateRecording(recording.id, { title, visibility });
      if (onUpdateSuccess) onUpdateSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update recording:', err);
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-slate-700" />
            Edit Recording
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg h-9 px-3 text-xs text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg h-9 px-3 text-xs text-slate-800 outline-none focus:border-slate-900 cursor-pointer font-medium"
            >
              <option value="Public Batch">Public Batch</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-1">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shadow-xs active:scale-95 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}