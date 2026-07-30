import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { recordingService } from '../../../services/features/recordingService';

export default function UploadRecordingModal({ isOpen, onClose, onUploadSuccess, trainerId, batchId, sessionId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    batch_id: batchId || 'BATCH-101',
    session_id: sessionId || '',
    visibility: 'Public Batch',
    download_enabled: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const parseDurationToSeconds = (durationStr) => {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Recording session title is required.';
    if (!formData.videoUrl.trim()) newErrors.videoUrl = 'Video URL / File path is required.';
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required.';
    } else if (!/^\d{2}:\d{2}(:\d{2})?$/.test(formData.duration)) {
      newErrors.duration = 'Use mm:ss or hh:mm:ss format (e.g., 45:00 or 01:25:00).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || 'Classroom recording session',
        video_url: formData.videoUrl.trim(),
        duration: parseDurationToSeconds(formData.duration.trim()),
        batch_id: formData.batch_id,
        status: 'Ready',
        visibility: formData.visibility,
        download_enabled: formData.download_enabled
      };

      // Only attach relational keys if valid IDs exist
      if (formData.session_id) payload.session = formData.session_id;
      if (trainerId) payload.trainer = trainerId;

      const res = await recordingService.uploadRecording(payload);
      if (onUploadSuccess) onUploadSuccess(res);

      setFormData({
        title: '', description: '', videoUrl: '', duration: '',
        batch_id: batchId || 'BATCH-101', session_id: '',
        visibility: 'Public Batch', download_enabled: true
      });
      onClose();
    } catch (err) {
      console.error("Upload error details:", err?.response?.data || err);
      const backendMessage = err?.response?.data
        ? typeof err.response.data === 'string'
          ? err.response.data
          : JSON.stringify(err.response.data)
        : 'Failed to create recording metadata.';

      setErrors({ api: backendMessage });
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div onFocus={(e) => e.stopPropagation()} style={{ zIndex: 99999 }} className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Upload Recording Session
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errors.api && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium break-words">
              {errors.api}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Recording Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., State management via Whiteboard diagrams"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-700 outline-none focus:border-blue-500"
            />
            {errors.title && <span className="text-[10px] font-semibold text-red-500">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Video File URL / Storage Path</label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-700 outline-none focus:border-blue-500"
            />
            {errors.videoUrl && <span className="text-[10px] font-semibold text-red-500">{errors.videoUrl}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Duration (hh:mm:ss)</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 00:00:10"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
              {errors.duration && <span className="text-[10px] font-semibold text-red-500">{errors.duration}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Batch ID</label>
              <input
                type="text"
                name="batch_id"
                value={formData.batch_id}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                name="download_enabled"
                checked={formData.download_enabled}
                onChange={handleChange}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Enable Student Downloads
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold uppercase text-slate-500 hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-5 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Session'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}