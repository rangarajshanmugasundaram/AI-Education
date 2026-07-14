import { useState, useEffect, useCallback } from 'react';
import AttendanceStatsCard from '../components/AttendanceStatsCard';
import AttendanceFilters from '../components/AttendanceFilters';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceCard from '../components/AttendanceCard';
import AttendanceDetailsModal from '../components/AttendanceDetailsModal';
import { getData } from '../../auth/components/API/getData';
import { putData } from '../../auth/components/API/putData';

export default function AttendanceDashboard() {
  const [records, setRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    session: '',
    status: '',
    date: ''
  });

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData('/api/attendance/session/Session-A');
      const fetchedRecords = response?.records || [];
      setRecords(fetchedRecords);
      const uniqueSessions = [...new Set(fetchedRecords.map(r => r.session_id))].filter(Boolean);
      setSessions(uniqueSessions);
    } catch (err) {
      console.error("API Error:", err);
      setError("Unable to load data. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleUpdateStatus = async (userId, sessionId, newStatus) => {
    try {
      await putData('/api/attendance/update', {
        user_id: userId,
        session_id: sessionId,
        status: newStatus
      });
      setRecords(prev => prev.map(rec => 
        (rec.user_id === userId && rec.session_id === sessionId) ? { ...rec, status: newStatus } : rec
      ));
      setSelectedRecord(null);
    } catch (err) {
      alert(`Backend modification failed: ${err?.message}`);
    }
  };

  const filteredRecords = records.filter(rec => {
    const studentIdentifier = rec.student_name || rec.user_id || '';
    return studentIdentifier.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
           (filters.session ? rec.session_id === filters.session : true) &&
           (filters.status ? rec.status === filters.status : true) &&
           (filters.date && rec.join_time ? rec.join_time.startsWith(filters.date) : true);
  });

  const totalCount = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === 'Present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'Absent').length;
  const lateCount = filteredRecords.filter(r => r.status === 'Late').length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="relative min-h-screen">
      {/* Container that applies the blur when a record is selected */}
      <div className={`p-6 max-w-7xl mx-auto bg-gray-50/30 transition-all duration-300 ${selectedRecord ? 'blur-sm pointer-events-none' : ''}`}>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Classroom Attendance</h1>
          <button 
            onClick={fetchAttendance}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
          >
            Refresh Logs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <AttendanceStatsCard title="Total Students" value={totalCount} icon="👥" color="blue" />
          <AttendanceStatsCard title="Present" value={presentCount} icon="✅" color="green" />
          <AttendanceStatsCard title="Absent" value={absentCount} icon="❌" color="red" />
          <AttendanceStatsCard title="Attendance Rate" value={`${attendanceRate}%`} icon="📊" color="purple" />
        </div>

        <AttendanceFilters filters={filters} setFilters={setFilters} sessions={sessions} />

        {loading ? (
          <div className="text-center py-24">Loading attendance data...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : (
          <>
            <div className="hidden md:block">
              <AttendanceTable 
                records={filteredRecords} 
                onViewDetails={setSelectedRecord}
                onEditStatus={(rec) => setSelectedRecord(rec)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, index) => (
                  <AttendanceCard key={index} record={rec} onViewDetails={setSelectedRecord} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">No records found.</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal is outside the blurred container so it remains sharp */}
      {selectedRecord && (
        <div 
        style={{ zIndex: 1000 }}
        className="fixed inset-0 flex items-center justify-center p-4">
          <AttendanceDetailsModal 
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}
    </div>
  );
}