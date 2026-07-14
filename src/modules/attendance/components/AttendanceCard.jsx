export default function AttendanceCard({ record, onViewDetails }) {
  const statusStyles = {
    Present: 'bg-green-50 text-green-700 border-green-100',
    Absent: 'bg-red-50 text-red-700 border-red-100',
    Late: 'bg-amber-50 text-amber-700 border-amber-100'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-900 text-base">{record.student_name || record.user_id}</h4>
          <p className="text-xs text-gray-400">ID: {record.user_id}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusStyles[record.status] || 'bg-gray-50 text-gray-600'}`}>
          {record.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 border-t border-gray-50 pt-3">
        <div>
          <span className="block font-medium text-gray-400">SESSION</span>
          <span className="text-gray-700 font-semibold">{record.session_id}</span>
        </div>
        <div>
          <span className="block font-medium text-gray-400">DURATION</span>
          <span className="text-gray-700 font-mono font-semibold">{record.duration || '0 mins'}</span>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(record)}
        className="mt-4 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors duration-150"
      >
        View Complete Details
      </button>
    </div>
  );
}