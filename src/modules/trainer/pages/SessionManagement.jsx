import { useState } from 'react';
import SessionCard from '../components/SessionCard';

const initialSessions = [
  {
    id: "SESS-101",
    name: "Introduction to React Hooks",
    trainer: "Arun  ",
    date: "2026-07-12",
    time: "10:00",
    duration: "60 mins",
    status: "Upcoming",
    description: "Deep dive into useState, useEffect, and custom hooks."
  },
  {
    id: "SESS-102",
    name: "Advanced CSS Grid & Flexbox",
    trainer: "Priya",
    date: "2026-07-09",
    time: "14:30",
    duration: "90 mins",
    status: "Live",
    description: "Master complex layouts and responsive designs."
  },
  {
    id: "SESS-103",
    name: "JavaScript ES6+ Fundamentals",
    trainer: "John",
    date: "2026-07-05",
    time: "09:00",
    duration: "45 mins",
    status: "Completed",
    description: "Reviewing arrow functions, destructuring, and modules."
  }
];

const SessionManagement = () => {
  const [sessions, setSessions] = useState(initialSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    trainer: "",
    date: "",
    time: "",
    duration: "",
    status: "Upcoming",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingSession(null);
    setFormData({ name: "", trainer: "", date: "", time: "", duration: "", status: "Upcoming", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData(session);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingSession) {
      setSessions(sessions.map(s => s.id === editingSession.id ? { ...formData } : s));
    } else {
      const newSession = {
        ...formData,
        id: `SESS-${Math.floor(100 + Math.random() * 900)}`
      };
      setSessions([newSession, ...sessions]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleJoinSession = (name) => {
    alert(`Simulating classroom entry... Joining: "${name}"`);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || session.status === statusFilter;
    const matchesDate = dateFilter === "" || session.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <>
      <div className={`p-6 max-w-7xl mx-auto space-y-6 transition-all duration-300 ${
        isModalOpen ? 'blur-sm pointer-events-none select-none' : ''
      }`}>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Session Management</h2>
            <p className="text-sm text-slate-500 mt-1">Create, monitor, and configure training virtual classrooms.</p>
          </div>
          <button 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-200"
            onClick={openAddModal}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Schedule New Session
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-300 font-normal text-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Search by session name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <select 
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <input 
                type="date" 
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <SessionCard 
                key={session.id}
                session={session}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onJoin={handleJoinSession}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 border border-dashed border-slate-300 rounded-xl">
              <svg className="w-12 h-12 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h5 className="mt-3 text-sm font-medium text-slate-700">No matching sessions found</h5>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/50 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300">
          
          {/* Premium White Floating Content Card */}
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col transform scale-100 transition-transform">
            
            {/* Modal Header Panel */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 uppercase tracking-wider">
                  {editingSession ? 'EDIT' : 'NEW'}
                </span>
                <h2 className="text-sm font-semibold text-slate-800 truncate max-w-sm tracking-tight">
                  {editingSession ? 'Edit Session Details' : 'Schedule a New Session'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/80 p-2 rounded-full transition-all duration-200"
                aria-label="Close Modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Session Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter session name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Trainer Name</label>
                  <input 
                    type="text" 
                    name="trainer" 
                    required 
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                    value={formData.trainer} 
                    onChange={handleInputChange} 
                    placeholder="Enter trainer name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      required 
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Time</label>
                    <input 
                      type="time" 
                      name="time" 
                      required 
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                      value={formData.time} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Duration</label>
                    <input 
                      type="text" 
                      name="duration" 
                      required 
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                      placeholder="e.g., 60 mins" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Status</label>
                    <select 
                      name="status" 
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                      value={formData.status} 
                      onChange={handleInputChange}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea 
                    name="description" 
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                    rows="3" 
                    placeholder="Provide syllabus context..." 
                    value={formData.description} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/10 transition-colors"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManagement;