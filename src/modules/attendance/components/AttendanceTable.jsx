import AttendanceRow from './AttendanceRow';

export default function AttendanceTable({ records, onViewDetails, onEditStatus }) {
  const headers = ['Student Name', 'Session', 'Join Time', 'Leave Time', 'Duration', 'Status', 'Actions'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/70">
            <tr>
              {headers.map((header, idx) => (
                <th 
                  key={idx}
                  scope="col" 
                  className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100 text-xs text-slate-700">
            {records.length > 0 ? (
              records.map((record, index) => (
                <AttendanceRow
                  key={record.user_id || index}
                  record={record}
                  onViewDetails={onViewDetails}
                  onEditStatus={onEditStatus}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-16 text-slate-400 font-medium">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}