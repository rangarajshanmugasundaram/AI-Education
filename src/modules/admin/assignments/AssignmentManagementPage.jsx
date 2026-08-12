import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { fetchAssignments, toggleAssignmentStatus, deleteAssignment } from '../../../services/features/assignmentService';

import StatsOverviewCards from './components/StatsOverviewCards';
import AssignmentTableRoster from './components/AssignmentTableRoster';
import CreateAssignmentModal from './components/CreateAssignmentModal';
import SubmissionRosterModal from './components/SubmissionRosterModal';

export default function AssignmentManagementPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);

  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [selectedForRoster, setSelectedForRoster] = useState(null);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetchAssignments();
      setAssignments(res.data || []);
    } catch (err) {
      console.error("Failed to load assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleToggleStatus = async (assignmentId, currentStatus) => {
    const nextStatus = (currentStatus === 'Published' || currentStatus === 'Open') ? 'Closed' : 'Published';
    await toggleAssignmentStatus(assignmentId, nextStatus);
    loadAssignments();
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      await deleteAssignment(assignmentId);
      loadAssignments();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Assignment Management</h1>
          <p className="text-xs text-slate-500">Configure coursework, monitor due dates, and evaluate student submissions</p>
        </div>
        <button
          onClick={() => { setSelectedForEdit(null); setIsCreateOpen(true); }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* KPI Stats */}
      <StatsOverviewCards assignments={assignments} />

      {/* Roster Table Component */}
      <AssignmentTableRoster
        assignments={assignments}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onEdit={(assignment) => { setSelectedForEdit(assignment); setIsCreateOpen(true); }}
        onDelete={handleDelete}
        onViewRoster={(assignment) => { setSelectedForRoster(assignment); setIsRosterOpen(true); }}
      />

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        assignmentToEdit={selectedForEdit}
        onSuccess={loadAssignments}
      />

      <SubmissionRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        assignment={selectedForRoster}
      />

    </div>
  );
}