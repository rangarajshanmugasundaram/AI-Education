import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  Video, 
  Clock, 
  Layers, 
  Link2, 
  UploadCloud, 
  AlertCircle,
  FileText
} from 'lucide-react';
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

  // Lock background scroll when modal is open
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
    if (!formData.videoUrl.trim()) newErrors.videoUrl = 'Video URL / Storage link is required.';
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required.';
    } else if (!/^\d{2}:\d{2}(:\d{2})?$/.test(formData.duration)) {
      newErrors.duration = 'Use mm:ss or hh:mm:ss format (e.g., 45:00).';
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
    <div 
      onFocus={(e) => e.stopPropagation()} 
      style={{ zIndex: 99999 }} 
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
    >
      {/* Modal Card */}
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border-t sm:border border-slate-200 flex flex-col overflow-hidden max-h-[88vh] sm:max-h-[90vh]">
        
        {/* Responsive Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200/60 text-slate-700">
              <UploadCloud className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Upload Recording Session
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Publish classroom archives to student portals</p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Form Body with Optimized Touch Paddings */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 sm:gap-4 custom-scrollbar">
          {errors.api && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-lg font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="break-words">{errors.api}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-slate-400" />
              Recording Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. State management via Whiteboard diagrams"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg h-10 sm:h-9 px-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
            {errors.title && <span className="text-[10px] font-semibold text-rose-500">{errors.title}</span>}
          </div>

          {/* Video URL Input */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Link2 className="w-3 h-3 text-slate-400" />
              Video URL / Storage Link
            </label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://storage.provider.com/recordings/session.mp4"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg h-10 sm:h-9 px-3 text-xs text-slate-800 font-mono placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
            {errors.videoUrl && <span className="text-[10px] font-semibold text-rose-500">{errors.videoUrl}</span>}
          </div>

          {/* Grid Layout (Stacks on mobile, 2 columns on sm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-3">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                Duration (hh:mm:ss)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 00:45:00"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg h-10 sm:h-9 px-3 text-xs text-slate-800 font-mono outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
              {errors.duration && <span className="text-[10px] font-semibold text-rose-500">{errors.duration}</span>}
            </div>

            <div className="flex flex-col gap-1 sm:gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-slate-400" />
                Batch ID
              </label>
              <input
                type="text"
                name="batch_id"
                value={formData.batch_id}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg h-10 sm:h-9 px-3 text-xs text-slate-800 font-mono outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none py-1">
              <input
                type="checkbox"
                name="download_enabled"
                checked={formData.download_enabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              Enable Student Offline Downloads
            </label>
          </div>

          {/* Responsive Mobile Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-1">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto h-10 sm:h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-10 sm:h-9 px-5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{loading ? 'Uploading...' : 'Publish Session'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}