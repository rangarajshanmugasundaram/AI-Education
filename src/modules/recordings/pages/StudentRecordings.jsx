import { useState } from 'react';
import { Video, Loader2, AlertCircle, Film } from 'lucide-react';
import { useRecordings } from '../hooks/useRecordings';
import RecordingCard from '../components/RecordingCard';
import VideoPlayerModal from '../components/VideoPlayerModal';

export default function StudentRecordings() {
  const { recordings, loading, error } = useRecordings();
  const [activePlayback, setActivePlayback] = useState(null);

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
      
      {/* Enterprise Student Header */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-slate-700" />
            Classroom Recordings
          </h1>
          <p className="text-xs text-slate-500">Access and watch previously recorded lectures for your active batch.</p>
        </div>
      </header>

      {/* Recordings Grid / Feed */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          <span>Loading available recordings...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      ) : recordings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {recordings.map((r) => (
            <RecordingCard
              key={r.id}
              recording={r}
              onPlay={setActivePlayback}
              onDownload={(rec) => rec.video_url && window.open(rec.video_url, '_blank')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <Film className="w-8 h-8 text-slate-300" />
          <span>No recordings available at this time.</span>
        </div>
      )}

      {/* Video Player Modal */}
      {activePlayback && (
        <VideoPlayerModal
          recording={activePlayback}
          onClose={() => setActivePlayback(null)}
        />
      )}
    </div>
  );
}