import { useState } from 'react';
import { Video, Plus, Loader2, AlertCircle, Film } from 'lucide-react';
import { useRecordings } from '../hooks/useRecordings';
import RecordingCard from '../components/RecordingCard';
import VideoPlayerModal from '../components/VideoPlayerModal';
import UploadRecordingModal from '../components/UploadRecordingModal';
import RecordingFilters from '../components/RecordingFilters';

export default function TrainerRecordings() {
  const { recordings, loading, error, removeRecording, uploadRecording } = useRecordings();
  const [activePlayback, setActivePlayback] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = recordings.filter((r) => {
    const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
      
      {/* Enterprise Header Banner */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-slate-700" />
            Trainer Recordings Management
          </h1>
          <p className="text-xs text-slate-500">Upload, manage, and inspect session recordings for your assigned batches.</p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Upload Recording</span>
        </button>
      </header>

      {/* Filter Toolbar */}
      <RecordingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Recordings Grid / Feed */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          <span>Loading session recordings...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((r) => (
            <RecordingCard
              key={r.id}
              recording={r}
              onPlay={setActivePlayback}
              onDownload={(rec) => rec.video_url && window.open(rec.video_url, '_blank')}
              onDelete={removeRecording}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <Film className="w-8 h-8 text-slate-300" />
          <span>No recordings found matching your filters.</span>
        </div>
      )}

      {/* Upload Recording Modal */}
      <UploadRecordingModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => setIsUploadOpen(false)}
      />

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