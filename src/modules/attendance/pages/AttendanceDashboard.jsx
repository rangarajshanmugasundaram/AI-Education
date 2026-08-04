import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart2, 
  Download, 
  RefreshCw, 
  UserCheck,
  AlertCircle
} from 'lucide-react';

import AttendanceStatsCard from '../components/AttendanceStatsCard';
import AttendanceFilters from '../components/AttendanceFilters';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceCard from '../components/AttendanceCard';
import AttendanceDetailsModal from '../components/AttendanceDetailsModal';

import axiosInstance from '../../../services/api/axiosSetup';

const MemoizedDurationValue = React.memo(({ value }) => {
  return (
    <div style={{ minWidth: '100px' }} className="bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-lg text-right contain-paint">
      <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
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
      const target = sessionId || 'all';
      const response = await axiosInstance.get(`/api/attendance/report/${target}/`);
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
      console.error("Analytical report fetch error:", err);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const targetSession = filters.session || 'all';
      
      const [recordsRes, reportRes] = await Promise.allSettled([
        axiosInstance.get(`/api/attendance/session/${targetSession}/`),
        axiosInstance.get(`/api/attendance/report/${targetSession}/`)
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
      await axiosInstance.put('/api/attendance/update/', {
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
    <div ref={containerRef} className="relative min-h-screen bg-slate-50/30 w-full max-w-[1600px] mx-auto">
      <div className={`p-4 sm:p-6 transition-all duration-200 ${selectedRecord ? 'blur-xs pointer-events-none' : ''}`}>
        
        {/* Enterprise Header Banner */}
        <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xs">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-slate-700" />
              Classroom Attendance
            </h1>
            <p className="text-xs text-slate-500">Real-time analytical metrics compiled by the backend framework.</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button 
              onClick={handleExportCSV}
              disabled={loading || filteredRecords.length === 0}
              className="h-9 px-4 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={fetchAttendance}
              className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          </div>
        </div>

        {/* Analytical Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Total Logs" : "Total Students"} 
            value={reportMetrics.totalStudents} 
            icon={<Users className="w-4 h-4 text-slate-600" />} 
            color="blue" 
          />
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Present Instances" : "Present"} 
            value={reportMetrics.present} 
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} 
            color="green" 
          />
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Absent Instances" : "Absent"} 
            value={reportMetrics.absent} 
            icon={<XCircle className="w-4 h-4 text-rose-600" />} 
            color="red" 
          />
          <AttendanceStatsCard 
            title={filters.session === 'all' ? "Late Instances" : "Late"} 
            value={reportMetrics.late} 
            icon={<Clock className="w-4 h-4 text-amber-600" />} 
            color="amber" 
          />
          <AttendanceStatsCard 
            title="Attendance Rate" 
            value={reportMetrics.attendanceRate} 
            icon={<BarChart2 className="w-4 h-4 text-slate-600" />} 
            color="purple" 
          />
        </div>

        {/* Stay Duration Metric Container */}
        <div className={`bg-white border border-slate-200/80 shadow-xs rounded-xl p-4 mb-6 flex items-center justify-between transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Class Stay Duration</h4>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">Calculated tracking weight per attendee.</p>
            </div>
          </div>
          
          <MemoizedDurationValue value={loading ? "-- mins" : reportMetrics.averageDuration} />
        </div>

        {/* Filter Toolbar */}
        <AttendanceFilters filters={filters} setFilters={setFilters} sessions={sessions} />

        {/* Logs Table / Cards Section */}
        <div style={{ minHeight: '300px' }} className="mt-6">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
              <span>Loading attendance records...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {!isMobile ? (
                <AttendanceTable 
                  records={filteredRecords} 
                  onViewDetails={setSelectedRecord}
                  onEditStatus={setSelectedRecord}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec) => (
                      <AttendanceCard key={`${rec.user_id}-${rec.session_id}`} record={rec} onViewDetails={setSelectedRecord} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
                      No matching records found.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
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