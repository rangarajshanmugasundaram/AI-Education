import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AttendanceStatsCard from '../components/AttendanceStatsCard';
import AttendanceFilters from '../components/AttendanceFilters';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceCard from '../components/AttendanceCard';
import AttendanceDetailsModal from '../components/AttendanceDetailsModal';

import axiosInstance from '../../../services/api/axiosSetup';

const MemoizedDurationValue = React.memo(({ value }) => {
  return (
    <div style={{ minWidth: '100px' }} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-right contain-paint">
      <span className="text-lg font-black text-blue-600 font-mono">
        {value}
      </span>
    </div>
  );
});
MemoizedDurationValue.displayName = 'MemoizedDurationValue';

export default function AttendanceDashboard() {
  const [records, setRecords] = useState([]);
  const [sessions, setSessions] = useState(['Session-A', 'Session-B']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [reportMetrics, setReportMetrics] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendanceRate: '0%',
    averageDuration: '0 mins'
  });

  const [filters, setFilters] = useState({
    searchQuery: '',
    session: 'all', 
    status: '',
    date: ''
  });

  const containerRef = useRef(null);

  // Passive ResizeObserver for responsive table/card switching
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ResizeObserver) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width || window.innerWidth;
        setIsMobile(width < 768);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchAttendanceReport = useCallback(async (sessionId) => {
    try {
      const response = await axiosInstance.get(`/api/attendance/report/${sessionId}`);
      const reportResponse = response.data || {};
      if (reportResponse && reportResponse.metrics) {
        setReportMetrics({
          totalStudents: reportResponse.metrics.total_students_logged || 0,
          present: reportResponse.metrics.presence_count || 0,
          absent: reportResponse.metrics.absence_count || 0,
          late: reportResponse.metrics.lateness_count || 0,
          attendanceRate: reportResponse.metrics.attendance_percentage || '0%',
          averageDuration: reportResponse.duration_report?.average_duration_minutes || '0 mins'
        });
      }
    } catch (err) {
      console.error("Analytical report fetch latency:", err);
    }
  }, []);

  // Primary API fetch cycle
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const targetSession = filters.session || 'all';
      
      const [recordsRes, reportRes] = await Promise.allSettled([
        axiosInstance.get(`/api/attendance/session/${targetSession}`),
        axiosInstance.get(`/api/attendance/report/${targetSession}`)
      ]);

      const recordsData = recordsRes.status === 'fulfilled' ? recordsRes.value.data : {};
      const reportData = reportRes.status === 'fulfilled' ? reportRes.value.data : {};

      const fetchedRecords = Array.isArray(recordsData) ? recordsData : (recordsData?.records || []);
      
      setRecords(fetchedRecords);

      const fetchedUnique = [...new Set(fetchedRecords.map(r => r.session_id))].filter(Boolean);
      if (fetchedUnique.length > 0) {
        setSessions(prev => [...new Set([...prev, ...fetchedUnique])]);
      }

      if (reportData && reportData.metrics) {
        setReportMetrics({
          totalStudents: reportData.metrics.total_students_logged || 0,
          present: reportData.metrics.presence_count || 0,
          absent: reportData.metrics.absence_count || 0,
          late: reportData.metrics.lateness_count || 0,
          attendanceRate: reportData.metrics.attendance_percentage || '0%',
          averageDuration: reportData.duration_report?.average_duration_minutes || '0 mins'
        });
      }

    } catch (err) {
      console.error("API Connection Error:", err);
      setError("Unable to load data. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, [filters.session]);

  useEffect(() => {
    fetchAttendance();
  }, [filters.session, fetchAttendance]);

  const handleUpdateStatus = async (userId, sessionId, newStatus) => {
    try {
      await axiosInstance.put('/api/attendance/update', {
        user_id: userId,
        session_id: sessionId,
        status: newStatus
      });
      
      setRecords(prev => prev.map(rec => 
        (rec.user_id === userId && rec.session_id === sessionId) ? { ...rec, status: newStatus } : rec
      ));
      
      fetchAttendanceReport(filters.session || 'all');
      setSelectedRecord(null);
    } catch (err) {
      alert(`Backend modification failed: ${err?.response?.data?.error || err?.message}`);
    }
  };

  // Memoized search and filter results
  const filteredRecords = useMemo(() => {
    const query = (filters.searchQuery || '').toLowerCase().trim();
    return records.filter(rec => {
      const studentIdentifier = rec.student_name || rec.user_id || '';
      const matchesSearch = studentIdentifier.toLowerCase().includes(query);
      const matchesStatus = filters.status ? rec.status === filters.status : true;
      const matchesDate = filters.date && rec.join_time ? rec.join_time.startsWith(filters.date) : true;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [records, filters.searchQuery, filters.status, filters.date]);

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No matched logs found to export.");
      return;
    }

    const headers = ["Student Name", "User ID", "Session ID", "Join Time", "Leave Time", "Duration", "Status"];
    const rows = filteredRecords.map(rec => [
      `"${rec.student_name || 'Unknown'}"`,
      `"${rec.user_id}"`,
      `"${rec.session_id}"`,
      `"${rec.join_time || '--'}"`,
      `"${rec.leave_time || '--'}"`,
      `"${rec.duration || '0 mins'}"`,
      `"${rec.status}"`
    ]);

    const metadata = [
      ["Attendance Summary Report"],
      ["Target Scope", filters.session === 'all' ? 'All Sessions' : filters.session],
      ["Total Logged", reportMetrics.totalStudents],
      ["Present Count", reportMetrics.present],
      ["Absent Count", reportMetrics.absent],
      ["Late Count", reportMetrics.late],
      ["Attendance Rate", reportMetrics.attendanceRate],
      ["Average Session Stay", reportMetrics.averageDuration],
      [],
      headers
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [...metadata, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Report_${filters.session}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-50/30 contain-intrinsic-size">
      <div className={`p-6 max-w-7xl mx-auto transition-all duration-200 ${selectedRecord ? 'blur-sm pointer-events-none' : ''}`}>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Classroom Attendance</h1>
            <p className="text-xs text-gray-500 mt-0.5">Real-time analytical metrics compiled by the backend framework.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportCSV}
              disabled={loading || filteredRecords.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              📥 Export Report (.CSV)
            </button>
            <button 
              onClick={fetchAttendance}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Refresh Logs
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ minHeight: '110px' }} className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Total Logs" : "Total Students"} 
            value={reportMetrics.totalStudents} 
            icon="👥" 
            color="blue" 
          />
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Present Instances" : "Present"} 
            value={reportMetrics.present} 
            icon="✅" 
            color="green" 
          />
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Absent Instances" : "Absent"} 
            value={reportMetrics.absent} 
            icon="❌" 
            color="red" 
          />
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Late Instances" : "Late"} 
            value={reportMetrics.late} 
            icon="🕒" 
            color="amber" 
          />
          <AttendanceStatsCard 
            title="Attendance Rate" 
            value={reportMetrics.attendanceRate} 
            icon="📊" 
            color="purple" 
          />
        </div>

        {/* Average Class Stay Banner */}
        <div style={{ minHeight: '78px' }} className={`bg-white border border-gray-100 shadow-sm rounded-2xl p-4 mb-6 flex items-center justify-between transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">⏱️</span>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Class Stay Duration</h4>
              <p className="text-sm font-black text-gray-800 mt-0.5">Calculated tracking weight per attendee.</p>
            </div>
          </div>
          
          <MemoizedDurationValue value={loading ? "-- mins" : reportMetrics.averageDuration} />
        </div>

        <AttendanceFilters filters={filters} setFilters={setFilters} sessions={sessions} />

        <div style={{ minHeight: '300px' }} className="mt-6">
          {loading ? (
            <div className="text-center py-24 text-gray-400 font-medium">Loading attendance data...</div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-sm">{error}</div>
          ) : (
            <>
              {!isMobile ? (
                <AttendanceTable 
                  records={filteredRecords} 
                  onViewDetails={setSelectedRecord}
                  onEditStatus={setSelectedRecord}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec) => (
                      <AttendanceCard key={`${rec.user_id}-${rec.session_id}`} record={rec} onViewDetails={setSelectedRecord} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">No records found.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRecord && (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs">
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