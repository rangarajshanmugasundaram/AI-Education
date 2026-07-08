import { useState } from 'react';
import ReactDOM from 'react-dom';

const VideoPlayerModal = ({ playbackData, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!playbackData) return null;

  // Render the modal into a Portal attached directly to document.body
  return ReactDOM.createPortal(
    <div style={{ zIndex: 99999 }} className="fixed inset-0 bg-slate-950/50 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300">
      
      {/* Premium White Floating Content Card */}
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col transform scale-100 transition-transform">
        
        {/* Modal Header Panel */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 uppercase tracking-wider">
              {playbackData.id}
            </span>
            <h2 className="text-sm font-semibold text-slate-800 truncate max-w-md sm:max-w-lg tracking-tight">
              {playbackData.sessionName}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/80 p-2 rounded-full transition-all duration-200"
            aria-label="Close Player"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cinematic Video Player Core Frame */}
        <div className="aspect-video bg-slate-950 relative flex flex-col items-center justify-center p-6 group select-none overflow-hidden m-4 sm:m-6 rounded-xl shadow-inner border border-slate-900">
          
          <div className="z-10 flex flex-col items-center">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isPlaying 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse' 
                  : 'bg-zinc-800 text-zinc-100 border-zinc-700 scale-105 shadow-xl hover:bg-zinc-700'
              }`}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <p className="text-zinc-200 text-sm font-medium tracking-wide mt-4">
              {isPlaying ? 'Streaming Video Content...' : 'Playback Paused'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Simulated video workspace running stable</p>
          </div>

          {/* Timeline and Overlay Progress Controls */}
          <div 
          style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)' }}
          className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 pt-12 opacity-90 transition-opacity group-hover:opacity-100">
            <div className="relative w-full h-1 bg-zinc-700 rounded-full cursor-pointer">
              <div className={`absolute top-0 left-0 h-full bg-emerald-500 rounded-full ${isPlaying ? 'w-1/3' : 'w-1/3 bg-zinc-500'}`} />
            </div>
            <div className="flex items-center justify-between text-zinc-300 text-xs font-mono">
              <span>00:35:10 / {playbackData.duration}</span>
              <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Simulated Stream</span>
            </div>
          </div>
        </div>

        {/* Modal Meta Footer Panel */}
        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
          <div>
            <strong>Uploaded Date:</strong> {playbackData.uploadedDate}
          </div>
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-sm shadow-blue-500/10 transition-colors"
          >
            Close Stream
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default VideoPlayerModal;