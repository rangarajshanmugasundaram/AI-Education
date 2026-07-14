export default function AttendanceRow({ record, onViewDetails }) {
  // Enhanced status styles for a more premium look
  const statusStyles = {
    Present: 'bg-green-100/50 text-green-700 border-green-200',
    Absent: 'bg-red-100/50 text-red-700 border-red-200',
    Late: 'bg-amber-100/50 text-amber-700 border-amber-200'
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0">
      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
        {record.student_name || "Unknown"}
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
        {record.session_id}
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-mono">
        {record.join_time || '--'}
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-mono">
        {record.leave_time || '--'}
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-700">
        {record.duration}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[record.status] || 'bg-gray-100 text-gray-600'}`}>
          {record.status}
        </span>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-bold">
        <button 
          onClick={() => onViewDetails(record)}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
        >
          Details
        </button>
      </td>
    </tr>
  );
}   