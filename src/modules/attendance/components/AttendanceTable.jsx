import AttendanceRow from './AttendanceRow';

export default function AttendanceTable({ records, onViewDetails, onEditStatus }) {
  // Column header definition for cleaner rendering
  const headers = ['Student Name', 'Session', 'Join Time', 'Leave Time', 'Duration', 'Status', ''];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50">
          <thead className="bg-gray-50/50">
            <tr>
              {headers.map((header, idx) => (
                <th 
                  key={idx}
                  scope="col" 
                  className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {records.length > 0 ? (
              records.map((record, index) => (
                <AttendanceRow
                  key={record.user_id || index} // Preferred using unique ID as key
                  record={record}
                  onViewDetails={onViewDetails}
                  onEditStatus={onEditStatus}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-20">
                  <div className="text-gray-400 font-bold text-sm">No records found</div>
                  <p className="text-gray-400/60 text-xs mt-1">Try adjusting your filters to see more results.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}