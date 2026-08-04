import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Video, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { recordingService } from '../../../services/features/recordingService';

const VideoPlayerModal = ({ recording, onClose }) => {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recording) return;

    const fetchToken = async () => {
      try {
        setLoading(true);
        const data = await recordingService.getPlaybackToken(recording.id);
        setTokenData(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to authorize video playback token.');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [recording]);

  if (!recording) return null;

  return ReactDOM.createPortal(
    <div onFocus={(e) => e.stopPropagation()} style={{ zIndex: 99999 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-xl shadow-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-bold font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60 shrink-0 uppercase tracking-wider">
              {recording.id ? recording.id.toString().substring(0, 8) : 'STREAM'}
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight">
              {recording.title}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="aspect-video bg-slate-950 relative flex items-center justify-center p-2 m-3 sm:m-5 rounded-lg overflow-hidden border border-slate-900">
          {loading ? (
            <div className="text-slate-300 text-xs font-medium flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              <span>Authorizing Secure Stream...</span>
            </div>
          ) : error ? (
            <div className="text-rose-400 text-xs p-4 text-center flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <video
              controls
              autoPlay
              controlsList={tokenData?.download_enabled ? '' : 'nodownload'}
              src={tokenData?.playback_url || recording.video_url}
              className="w-full h-full rounded-md"
            >
              Your browser does not support HTML5 video playback.
            </video>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3.5 bg-slate-50/80 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Status: <strong className="text-slate-800">{recording.status || 'Ready'}</strong></span>
          </div>
          <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 h-8 rounded-lg cursor-pointer transition-all active:scale-95">
            Close Stream
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VideoPlayerModal;