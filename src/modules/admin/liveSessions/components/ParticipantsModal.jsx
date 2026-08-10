import React from 'react';
import { Users, X, Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';

export default function ParticipantsModal({ isOpen, onClose, participants = [], sessionTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Live Participant Roster
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Session: <strong className="text-slate-800">{sessionTitle}</strong> ({participants.length} connected)
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {participants.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No participants currently in classroom.</div>
          ) : (
            participants.map((p, idx) => (
              <div key={p._id || idx} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    p.role === 'Trainer' ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}>
                    {p.name ? p.name.charAt(0) : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">{p.name}</p>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        p.role === 'Trainer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">{p.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  {p.has_raised_hand && <Hand className="w-3.5 h-3.5 text-amber-500" />}
                  {p.is_muted ? <MicOff className="w-3.5 h-3.5 text-rose-500" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
                  {p.is_camera_on ? <Video className="w-3.5 h-3.5 text-emerald-600" /> : <VideoOff className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded cursor-pointer shadow-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}