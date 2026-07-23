import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function UploadRecordingModal({ isOpen, onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    session: '',
    title: '',
    videoFile: null,
    duration: ''
  });
  
  const [errors, setErrors] = useState({});

  // Lock scroll position when modal opens
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, videoFile: file }));
    if (errors.videoFile) setErrors(prev => ({ ...prev, videoFile: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.session) newErrors.session = 'Please select a training session link.';
    if (!formData.title.trim()) newErrors.title = 'Recording session title is required.';
    if (!formData.videoFile) newErrors.videoFile = 'Please select a raw MP4/video file.';
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required.';
    } else if (!/^\d{2}:\d{2}$/.test(formData.duration)) {
      newErrors.duration = 'Use hh:mm formatting (e.g., 01:25).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const mockNewRecording = {
      id: `rec-${Date.now()}`,
      title: formData.title.trim(),
      session: formData.session,
      duration: formData.duration.trim(),
      fileName: formData.videoFile.name,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    onUploadSuccess(mockNewRecording);
    
    setFormData({ session: '', title: '', videoFile: null, duration: '' });
    setErrors({});
    onClose();
  };

  return ReactDOM.createPortal(
    <div 
      onFocus={(e) => e.stopPropagation()}
      style={{ zIndex: 99999 }} 
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-all duration-300"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transform scale-100 transition-transform">
        
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Upload Recording Session
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/80 p-2 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Select Session Link
            </label>
            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-11 sm:h-10 px-3 text-xs sm:text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">-- Choose an active session context --</option>
              <option value="Full-Stack Engineering Bootcamp">Full-Stack Engineering Bootcamp</option>
              <option value="UI/UX Architecture Sandbox">UI/UX Architecture Sandbox</option>
              <option value="Database Optimization Deep Dive">Database Optimization Deep Dive</option>
            </select>
            {errors.session && (
              <span className="text-[10px] font-semibold text-red-500 px-1">{errors.session}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Recording Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., State management via Whiteboard diagrams"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-11 sm:h-10 px-3 text-xs sm:text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {errors.title && (
              <span className="text-[10px] font-semibold text-red-500 px-1">{errors.title}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Upload Video Field
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer pt-1"
              />
              {errors.videoFile && (
                <span className="text-[10px] font-semibold text-red-500 px-1">{errors.videoFile}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Duration Input (hh:mm)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 01:45"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-11 sm:h-10 px-3 text-xs sm:text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              {errors.duration && (
                <span className="text-[10px] font-semibold text-red-500 px-1">{errors.duration}</span>
              )}
            </div>

          </div>

          <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold uppercase text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-blue-500/10"
            >
              Upload Session
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}