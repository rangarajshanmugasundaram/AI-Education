import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
    <div onFocus={(e) => e.stopPropagation()} style={{ zIndex: 99999 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 uppercase tracking-wider">
              {recording.id ? recording.id.toString().substring(0, 8) : 'STREAM'}
            </span>
            <h2 className="text-sm font-semibold text-slate-800 truncate tracking-tight">
              {recording.title}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="aspect-video bg-slate-950 relative flex items-center justify-center p-2 m-4 sm:m-6 rounded-xl overflow-hidden border border-slate-900">
          {loading ? (
            <div className="text-slate-300 text-xs font-medium flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              Authorizing Secure Stream...
            </div>
          ) : error ? (
            <div className="text-rose-400 text-xs p-4 text-center">{error}</div>
          ) : (
            <video
              controls
              autoPlay
              controlsList={tokenData?.download_enabled ? '' : 'nodownload'}
              src={tokenData?.playback_url || recording.video_url}
              className="w-full h-full rounded-lg"
            >
              Your browser does not support HTML5 video playback.
            </video>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
          <div>
            <strong>Status:</strong> {recording.status || 'Ready'}
          </div>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg cursor-pointer">
            Close Stream
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VideoPlayerModal;