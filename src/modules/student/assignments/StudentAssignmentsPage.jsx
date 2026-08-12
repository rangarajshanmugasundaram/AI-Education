import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import { fetchAssignments } from '../../../services/features/assignmentService';

import AssignmentCard from './components/AssignmentCard';
import SubmitAssignmentModal from './components/SubmitAssignmentModal';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetchAssignments();
      setAssignments(res.data || []);
    } catch (err) {
      console.error("Failed to load student assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.course_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Coursework & Projects</h1>
          <p className="text-xs text-slate-500">Track deadlines, submit your solutions, and review trainer feedback</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coursework by title..."
            className="w-full pl-8 pr-3 h-9 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition"
          />
        </div>
      </div>

      {/* Coursework Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-bold text-slate-400">Loading active coursework...</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No Coursework Assigned</p>
          <p className="text-[11px] text-slate-400">Coursework published for your batch will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.assignment_id}
              assignment={assignment}
              onOpenSubmit={(a) => {
                setSelectedAssignment(a);
                setIsSubmitOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Submission Modal */}
      <SubmitAssignmentModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        assignment={selectedAssignment}
        onSuccess={loadAssignments}
      />

    </div>
  );
}