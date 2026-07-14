export default function AttendanceDetailsModal({ record, onClose, onUpdateStatus }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with a slightly darker blur */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header - Subtle gradient border effect */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Student Details</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8">
          {/* User Info Section */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
              {record.student_name ? record.student_name.charAt(0) : 'S'}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">{record.student_name || "Unknown Student"}</h4>
              <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">ID: {record.user_id}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Session</span>
              <span className="text-sm font-semibold text-gray-800">{record.session_id}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                record.status === 'Present' ? 'bg-green-100 text-green-700' :
                record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {record.status}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Join Time</span>
              <span className="text-sm text-gray-700 font-mono">{record.join_time || '--'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Leave Time</span>
              <span className="text-sm text-gray-700 font-mono">{record.leave_time || '--'}</span>
            </div>
          </div>

          {/* Duration Highlight */}
          <div className="text-center py-4 border-y border-gray-100">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Duration</span>
            <span className="text-3xl font-black text-blue-600 font-mono">{record.duration || '0'} <span className="text-lg font-semibold text-gray-400">mins</span></span>
          </div>

          {/* Action Area */}
          {onUpdateStatus && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Update Status</label>
              <div className="grid grid-cols-3 gap-2">
                {['Present', 'Absent', 'Late'].map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(record.user_id, record.session_id, st)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all duration-200 ${
                      record.status === st 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}