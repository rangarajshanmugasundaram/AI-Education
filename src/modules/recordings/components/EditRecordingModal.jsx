import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Edit Recording</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-700 outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-700 outline-none"
            >
              <option value="Public Batch">Public Batch</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-500">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}