export default function AttendanceStatsCard({ title, value, icon, color }) {
  // Refined color map with subtle backgrounds
  const colorMap = {
    blue: 'bg-blue-50/50 text-blue-600 border-blue-100',
    green: 'bg-green-50/50 text-green-600 border-green-100',
    red: 'bg-red-50/50 text-red-600 border-red-100',
    purple: 'bg-purple-50/50 text-purple-600 border-purple-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl border ${colorMap[color] || colorMap.blue}`}>
        {/* Clone icon to ensure consistent sizing */}
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}