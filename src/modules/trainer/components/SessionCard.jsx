
const SessionCard = ({ session, onEdit, onDelete, onJoin }) => {
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "Live":
        return "bg-red-100 text-red-700 border border-red-200 animate-pulse";
      case "Upcoming":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Completed":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="bg-white border-t-4 border-blue-600 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded">
            {session.id}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeStyles(session.status)}`}>
            {session.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 truncate" title={session.name}>
          {session.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Trainer: <span className="font-medium text-slate-700">{session.trainer}</span>
        </p>

        <p className="text-sm text-slate-600 mt-3 line-clamp-2 min-h-[2.5rem]">
          {session.description || "No description provided."}
        </p>

        <div className="grid grid-cols-3 gap-1 bg-slate-50 border border-slate-100 rounded-lg p-2.5 mt-4 text-center">
          <div className="border-r border-slate-200">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
            <span className="text-xs font-semibold text-slate-700">{session.date}</span>
          </div>
          <div className="border-r border-slate-200">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
            <span className="text-xs font-semibold text-slate-700">{session.time}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{session.duration}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          className="flex-1 inline-flex items-center justify-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:pointer-events-none text-sm font-semibold py-2 px-3 rounded-lg transition-colors duration-150"
          disabled={session.status === "Completed"}
          onClick={() => onJoin(session.name)}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Join Room
        </button>
        
        <button
          className="inline-flex items-center justify-center border border-slate-300 text-slate-600 hover:bg-slate-50 p-2 rounded-lg transition-colors duration-150"
          onClick={() => onEdit(session)}
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <button
          className="inline-flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-150"
          onClick={() => onDelete(session.id)}
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SessionCard;