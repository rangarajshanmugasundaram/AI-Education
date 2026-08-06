import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, RefreshCw, Book, CheckCircle, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';

import { 
  fetchCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  archiveCourse, 
  assignTrainerToCourse,
  fetchCourseStats 
} from '../../../../services/features/courseService';
import { fetchUsers } from '../../../../services/features/userService';

import CourseFilters from '../components/CourseFilters';
import CourseTable from '../components/CourseTable';
import CourseFormModal from '../components/CourseFormModal';
import AssignTrainerModal from '../components/AssignTrainerModal';
import CourseStatsCard from '../components/CourseStatsCard';

export default function CourseManagementPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 🌟 Pagination State (Configured to 5 items per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignedTrainerId, setAssignedTrainerId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '', code: '', category: 'General', description: '', duration: '', prerequisites: '', status: 'Active'
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Pass page_size=5 explicitly to backend pagination
      const [courseRes, statsRes] = await Promise.all([
        fetchCourses({ page, page_size: 5, search, category: categoryFilter, status: statusFilter }),
        fetchCourseStats()
      ]);

      if (courseRes && courseRes.results) {
        setCourses(courseRes.results);
        setTotalPages(courseRes.total_pages || 1);
        setTotalCount(courseRes.count || 0);
      } else if (Array.isArray(courseRes)) {
        setCourses(courseRes);
        setTotalPages(1);
        setTotalCount(courseRes.length);
      }

      if (statsRes && statsRes.stats) {
        setGlobalStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchUsers({ role: 'Trainer' }).then((res) => {
      setTrainers(res.results || (Array.isArray(res) ? res : []));
    }).catch(console.error);
  }, []);

  const handleOpenForm = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title,
        code: course.code,
        category: course.category,
        description: course.description || '',
        duration: course.duration || '',
        prerequisites: course.prerequisites || '',
        status: course.status || 'Active'
      });
    } else {
      setSelectedCourse(null);
      setFormData({ title: '', code: '', category: 'General', description: '', duration: '', prerequisites: '', status: 'Active' });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourse) {
      await updateCourse(selectedCourse._id, formData);
    } else {
      await createCourse(formData);
    }
    setIsFormModalOpen(false);
    loadData();
  };

  const handleArchive = async (id) => {
    await archiveCourse(id);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
      loadData();
    }
  };

  const handleAssignTrainerSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourse && assignedTrainerId) {
      await assignTrainerToCourse(selectedCourse._id, assignedTrainerId);
      setIsTrainerModalOpen(false);
      loadData();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto min-h-screen p-4 sm:p-6 bg-slate-50/30">
      
      {/* Header */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Course Management Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage course catalogs, assign qualified trainers, track performance metrics, and archive curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData()}
            className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => handleOpenForm()}
            className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Course</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      {globalStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CourseStatsCard label="TOTAL COURSES" value={globalStats.total_courses} icon={Book} color="text-slate-900" />
          <CourseStatsCard label="ACTIVE COURSES" value={globalStats.active_courses} icon={CheckCircle} color="text-emerald-600" bgColor="bg-emerald-50" />
          <CourseStatsCard label="ASSIGNED TRAINERS" value={globalStats.assigned_trainers} icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" />
          <CourseStatsCard label="ARCHIVED COURSES" value={globalStats.archived_courses} icon={Archive} color="text-amber-600" bgColor="bg-amber-50" />
        </div>
      )}

      {/* Filters */}
      <CourseFilters
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={() => {
          setSearch('');
          setCategoryFilter('all');
          setStatusFilter('all');
          setPage(1);
        }}
      />

      {/* Course Table */}
      <CourseTable
        courses={courses}
        loading={loading}
        onEdit={(c) => handleOpenForm(c)}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onOpenAssignTrainer={(c) => {
          setSelectedCourse(c);
          setAssignedTrainerId(c.trainer_id || '');
          setIsTrainerModalOpen(true);
        }}
      />

      {/* 🌟 PAGINATION CONTROLS BAR (5 per page) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-4 px-1">
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{courses.length}</strong> of{' '}
          <strong className="text-slate-800">{totalCount}</strong> courses (Page {page} of {totalPages})
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  page === pageNum
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <CourseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={Boolean(selectedCourse)}
      />

      {/* Trainer Modal */}
      <AssignTrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        onSubmit={handleAssignTrainerSubmit}
        trainers={trainers}
        assignedTrainerId={assignedTrainerId}
        setAssignedTrainerId={setAssignedTrainerId}
        courseTitle={selectedCourse?.title || ''}
      />
    </div>
  );
}