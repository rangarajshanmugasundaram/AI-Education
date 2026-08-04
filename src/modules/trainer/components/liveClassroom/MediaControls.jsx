import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, VolumeX } from 'lucide-react';

export const MediaControls = ({ onToggleMute, onToggleCamera, onMuteAll }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const handleMuteClick = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (onToggleMute) onToggleMute(newState);
  };

  const handleCameraClick = () => {
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    if (onToggleCamera) onToggleCamera(newState);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-950/90 text-white p-2 px-3 sm:px-4 rounded-xl shadow-xl border border-slate-800 backdrop-blur-xs">
      {/* Mic Control */}
      <button
        onClick={handleMuteClick}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 h-8 rounded-lg transition-all cursor-pointer active:scale-95 ${
          isMuted
            ? 'bg-rose-600 text-white shadow-xs'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
        }`}
      >
        {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-slate-300" />}
        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      {/* Camera Control */}
      <button
        onClick={handleCameraClick}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 h-8 rounded-lg transition-all cursor-pointer active:scale-95 ${
          !isCameraOn
            ? 'bg-rose-600 text-white shadow-xs'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
        }`}
      >
        {!isCameraOn ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-slate-300" />}
        <span>{!isCameraOn ? 'Cam Off' : 'Cam On'}</span>
      </button>

      {/* Mute All Action (Trainer Only) */}
      {onMuteAll && (
        <button
          onClick={onMuteAll}
          className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 h-8 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ml-1"
        >
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span>Mute All</span>
        </button>
      )}
    </div>
  );
};

export default MediaControls;