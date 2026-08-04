import { Play, Download, Trash2, Calendar, Clock, Eye } from 'lucide-react';

const RecordingCard = ({ recording, onPlay, onDownload, onDelete }) => {
  const {
    id,
    title,
    duration,
    recording_date,
    created_at,
    status,
    playback_count,
    download_enabled
  } = recording || {};

  const displayDate = recording_date || (created_at ? new Date(created_at).toLocaleDateString() : 'N/A');

  const formatDuration = (secs) => {
    if (typeof secs === 'string') return secs;
    if (!secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusStyle = (st) => {
    switch (st) {
      case 'Ready':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div className="group bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Header Badges */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[110px]">
              #{id ? id.toString().substring(0, 8) : 'REC'}
            </span>
            {status && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusStyle(status)}`}>
                {status}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {displayDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-slate-700 transition-colors">
          {title || 'Untitled Session'}
        </h3>

        {/* Meta Stats */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-5 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-medium">{formatDuration(duration)}</span>
          </div>
          {playback_count !== undefined && (
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" /> {playback_count} views
            </span>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-100">
        <button
          onClick={() => onPlay && onPlay(recording)}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all text-xs font-semibold shadow-2xs cursor-pointer active:scale-95"
          title="Play Recording"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>Play</span>
        </button>

        <button
          onClick={() => onDownload && onDownload(recording)}
          disabled={download_enabled === false}
          className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg border transition-all text-xs font-semibold cursor-pointer active:scale-95 ${
            download_enabled === false 
              ? 'bg-slate-100 text-slate-400 border-slate-200/60 cursor-not-allowed' 
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-2xs'
          }`}
          title={download_enabled === false ? "Downloads Disabled" : "Download Recording"}
        >
          <Download className="w-3 h-3 text-slate-500" />
          <span>Save</span>
        </button>

        <button
          onClick={() => onDelete && onDelete(id)}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200/80 hover:border-rose-200 transition-all text-xs font-semibold cursor-pointer active:scale-95"
          title="Delete Recording"
        >
          <Trash2 className="w-3 h-3 text-rose-600" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default RecordingCard;