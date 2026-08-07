import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Plus, RefreshCw, CheckCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  fetchBatches,
  createBatch,
  updateBatch,
  allocateStudentsToBatch,
  allocateTrainerToBatch,
  fetchBatchStats
} from '../../../../services/features/batchService';
import { fetchCourses } from '../../../../services/features/courseService';
import { fetchUsers } from '../../../../services/features/userService';

// Component Imports
import BatchFilters from '../components/BatchFilters';
import BatchTable from '../components/BatchTable';
import BatchStatsCard from '../components/BatchStatsCard';
import BatchFormModal from '../components/BatchFormModal';
import TrainerAllocationModal from '../components/TrainerAllocationModal';
import StudentAllocationModal from '../components/StudentAllocationModal';

export default function BatchManagementPage() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [assignedTrainerId, setAssignedTrainerId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', code: '', course_id: '', trainer_id: '', max_capacity: 30, start_date: '', end_date: '', status: 'Active'
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [batchRes, statsRes] = await Promise.all([
        fetchBatches({ page, page_size: 5, search, status: statusFilter }),
        fetchBatchStats()
      ]);

      if (batchRes && batchRes.results) {
        setBatches(batchRes.results);
        setTotalPages(batchRes.total_pages || 1);
        setTotalCount(batchRes.count || 0);
      } else if (Array.isArray(batchRes)) {
        setBatches(batchRes);
        setTotalPages(1);
        setTotalCount(batchRes.length);
      }

      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load batch data:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);
  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    fetchCourses().then((res) => setCourses(res.results || (Array.isArray(res) ? res : []))).catch(console.error);
    fetchUsers({ role: 'Trainer' }).then((res) => setTrainers(res.results || (Array.isArray(res) ? res : []))).catch(console.error);
    fetchUsers({ role: 'Student' }).then((res) => setStudents(res.results || (Array.isArray(res) ? res : []))).catch(console.error);
  }, []);

  const handleOpenForm = (batch = null) => {
    if (batch) {
      setSelectedBatch(batch);
      setFormData({
        name: batch.name,
        code: batch.code,
        course_id: batch.course_id || '',
        trainer_id: batch.trainer_id || '',
        max_capacity: batch.max_capacity || 30,
        start_date: batch.start_date || '',
        end_date: batch.end_date || '',
        status: batch.status || 'Active'
      });
    } else {
      setSelectedBatch(null);
      setFormData({ name: '', code: '', course_id: '', trainer_id: '', max_capacity: 30, start_date: '', end_date: '', status: 'Active' });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedBatch) {
      await updateBatch(selectedBatch._id || selectedBatch.id, formData);
    } else {
      await createBatch(formData);
    }
    setIsFormModalOpen(false);
    loadData();
  };

  const handleTrainerAllocationSubmit = async (e) => {
    e.preventDefault();
    if (selectedBatch && assignedTrainerId) {
      await allocateTrainerToBatch(selectedBatch._id || selectedBatch.id, assignedTrainerId);
      setIsTrainerModalOpen(false);
      loadData();
    }
  };

  const handleStudentAllocationSubmit = async (studentIds) => {
    if (selectedBatch) {
      await allocateStudentsToBatch(selectedBatch._id || selectedBatch.id, studentIds);
      setIsStudentModalOpen(false);
      loadData();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto min-h-screen p-4 sm:p-6 bg-slate-50/30">
      
      {/* Page Header */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Batch Management Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Organize learning cohorts, allocate trainers, assign students, and track batch analytics.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={() => loadData()} className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button onClick={() => handleOpenForm()} className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs">
            <Plus className="w-4 h-4 text-white" />
            <span>Create Batch</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BatchStatsCard label="TOTAL BATCHES" value={stats.total_batches} icon={Layers} color="text-slate-900" />
          <BatchStatsCard label="ACTIVE BATCHES" value={stats.active_batches} icon={CheckCircle} color="text-emerald-600" bgColor="bg-emerald-50" />
          <BatchStatsCard label="ENROLLED STUDENTS" value={stats.total_enrolled_students} icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" />
          <BatchStatsCard label="TOTAL STUDENTS" value={stats.total_students} icon={Users} color="text-slate-800" />
        </div>
      )}

      {/* Filters */}
      <BatchFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={() => {
          setSearch('');
          setStatusFilter('all');
          setPage(1);
        }}
      />

      {/* Table */}
      <BatchTable
        batches={batches}
        loading={loading}
        onOpenStudentAllocation={(b) => { setSelectedBatch(b); setIsStudentModalOpen(true); }}
        onOpenTrainerAllocation={(b) => { setSelectedBatch(b); setAssignedTrainerId(b.trainer_id || ''); setIsTrainerModalOpen(true); }}
        onEdit={(b) => handleOpenForm(b)}
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-4 px-1">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{batches.length}</strong> of <strong className="text-slate-800">{totalCount}</strong> batches (Page {page} of {totalPages})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Batch Form Modal */}
      <BatchFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        courses={courses}
        trainers={trainers}
        isEditing={Boolean(selectedBatch)}
      />

      {/* Trainer Allocation Modal */}
      <TrainerAllocationModal
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        onSubmit={handleTrainerAllocationSubmit}
        trainers={trainers}
        assignedTrainerId={assignedTrainerId}
        setAssignedTrainerId={setAssignedTrainerId}
        batchName={selectedBatch?.name || ''}
      />

      {/* Student Allocation Modal */}
      <StudentAllocationModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleStudentAllocationSubmit}
        allStudents={students}
        currentStudentIds={selectedBatch?.enrolled_students?.map((s) => s._id || s.id) || []}
        batchName={selectedBatch?.name || ''}
      />
    </div>
  );
}