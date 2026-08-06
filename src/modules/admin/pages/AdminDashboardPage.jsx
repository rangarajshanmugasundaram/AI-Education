import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Radio, 
  CheckCircle2, 
  FileText, 
  Award, 
  Clock, 
  RefreshCw, 
  BarChart2, 
  ArrowRight, 
  Video, 
  Sparkles,
  ShieldCheck,
  Activity
} from 'lucide-react';

import { fetchAdminDashboardData } from '../../../services/features/adminService';
import AdminKpiCard from '../components/AdminKpiCard';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("authUser") || localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const formatDate = (val) => {
  if (!val) return "N/A";
  const date = new Date(val);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatDateTime = (val) => {
  if (!val) return "N/A";
  const date = new Date(val);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getInitials = (name) => {
  if (!name) return "U";
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getStoredUser(), []);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const response = await fetchAdminDashboardData();
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error("Invalid payload structure received");
      }
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-2 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-600" />
        <span className="text-xs font-medium">Loading platform metrics...</span>
      </div>
    );
  }

  const { statistics = {}, recentRegistrations = [], recentActivity = {}, charts = {} } = dashboardData || {};

  const cards = [
    { title: "Total Students", value: statistics.totalStudents, icon: GraduationCap, route: "/attendance" },
    { title: "Total Trainers", value: statistics.totalTrainers, icon: Users, route: "/admin/users" },
    { title: "Total Courses", value: statistics.totalCourses, icon: BookOpen, route: "/admin/courses" },
    { title: "Total Batches", value: statistics.totalBatches, icon: Layers, route: "/admin/batches" },
    { title: "Active Live Sessions", value: statistics.activeLiveSessions, icon: Radio, route: "/session-management" },
    { title: "Completed Sessions", value: statistics.completedSessions, icon: CheckCircle2, route: "/session-recordings" },
    { title: "Total Exams", value: statistics.totalExams, icon: FileText },
    { title: "Total Certificates", value: statistics.totalCertificates, icon: Award },
    { title: "Pending Assignments", value: statistics.pendingAssignments, icon: Clock },
  ];

  const regTrend = charts.registrationTrend || [];
  const maxTrend = Math.max(...regTrend.map((t) => Number(t.count) || 0), 1);

  const completedCount = Number(statistics.completedSessions) || 0;
  const liveCount = Number(statistics.activeLiveSessions) || 0;
  const totalSessions = completedCount + liveCount;
  const completedPct = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;
  const livePct = totalSessions > 0 ? 100 - completedPct : 0;

  const sessionList = recentActivity.sessions || [];

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
      
      {/* Page Header */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
            Admin Control Panel
          </h1>
          <p className="text-xs text-slate-500">
            Good morning, <strong className="text-slate-800">{currentUser?.name || currentUser?.first_name || "Admin"}</strong>. Here is the latest aggregated platform overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-white ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh Logs"}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: KPI Cards, Charts, Tables */}
        <main className="w-full lg:col-span-3 flex flex-col gap-6">
          
          {/* KPI Statistics Grid */}
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
              Platform Overview Metrics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {cards.map((c, i) => (
                <AdminKpiCard
                  key={i}
                  title={c.title}
                  value={c.value}
                  icon={c.icon}
                  route={c.route}
                />
              ))}
            </div>
          </section>

          {/* Registration & Session Charts */}
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Real-time Analytics
            </h2>

            <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Registration Bar Chart */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800">Registration Trend</h3>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">Last 7 Days</span>
                </div>

                <div className="h-40 flex items-end justify-between gap-2 pt-4 border-t border-slate-100">
                  {regTrend.length > 0 ? (
                    regTrend.map((item, idx) => {
                      const heightPct = Math.max((Number(item.count) / maxTrend) * 100, item.count > 0 ? 12 : 4);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono">{item.count}</span>
                          <div className="w-full max-w-[28px] bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                            <div style={{ height: `${heightPct}%` }} className="w-full bg-slate-900 rounded-t-md transition-all duration-500" />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400">{item.label}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      No registration trends recorded.
                    </div>
                  )}
                </div>
              </div>

              {/* Session Status Distribution */}
              <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-4 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Session Status</h3>
                  <p className="text-[10px] text-slate-400">Classroom distribution</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Completed</span>
                      <span className="font-mono">{completedCount}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${completedPct}%` }} className="bg-slate-900 h-full" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{completedPct}% of total</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Live Now</span>
                      <span className="font-mono">{liveCount}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${livePct}%` }} className="bg-rose-500 h-full" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{livePct}% of total</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Recent Registrations Table */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Recent User Registrations
              </h2>
              <button 
                onClick={() => navigate("/admin/users")}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {recentRegistrations.length > 0 ? (
                      recentRegistrations.map((u, idx) => (
                        <tr key={u._id || u.id || idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-[10px] text-slate-400">{u.email}</p>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {u.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono text-slate-400 text-[10px]">{formatDate(u.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-slate-400 text-xs">
                          No recent registrations found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent Session Activity Stream */}
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-slate-400" />
              Recent Session Activity
            </h2>

            <div className="w-full bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-2.5">
              {sessionList.length > 0 ? (
                sessionList.map((s, idx) => {
                  const statusNormalized = (s.status || 'Completed').toLowerCase();
                  const isLive = statusNormalized === 'live' || statusNormalized === 'active';

                  return (
                    <div key={s._id || s.id || idx} className="p-3 border border-slate-100 rounded-lg bg-slate-50/30 flex items-center justify-between gap-4 hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-white border border-slate-100 text-slate-600">
                          <Video className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{s.sessionName || s.title || "Classroom Session"}</h4>
                          <p className="text-[10px] text-slate-400">Trainer: {s.trainerName || "Assigned Trainer"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                          isLive ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-200/80 text-slate-700'
                        }`}>
                          {isLive ? 'Live' : 'Completed'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{formatDateTime(s.updatedAt || s.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No recent classroom activity logged in database.
                </div>
              )}
            </div>
          </section>

        </main>

        {/* Right Sidebar: Quick Actions */}
        <aside className="w-full lg:col-span-1 space-y-3 lg:sticky lg:top-24">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Quick Actions
          </h2>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-2.5">
            {[
              { title: "Manage Users", desc: "View students & trainers", route: "/admin/users" },
              { title: "Manage Courses", desc: "View & create course catalog", route: "/admin/courses" },
              { title: "Create Batch", desc: "Assign and group students", route: "/admin/batches" },
              { title: "Session Control", desc: "Inspect live classrooms", route: "/session-management" },
            ].map((a, idx) => (
              <button
                key={idx}
                onClick={() => navigate(a.route)}
                className="w-full p-3 border border-slate-100 rounded-lg hover:border-slate-200 hover:bg-slate-50/60 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-slate-900">{a.title}</h4>
                  <p className="text-[10px] text-slate-400">{a.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700 transition-colors" />
              </button>
            ))}

            <div className="p-4 border border-slate-200 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center text-center mt-4">
              <span className="text-xl font-bold font-mono tracking-tight">System Online</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                MongoDB Aggregations Active
              </span>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}