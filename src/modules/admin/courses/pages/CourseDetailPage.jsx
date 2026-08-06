import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  RefreshCw, 
  Layers, 
  Mail, 
  Calendar,
  DollarSign,
  PlayCircle
} from 'lucide-react';

import { fetchCourseById } from '../../../../services/features/courseService';

// Default mock curriculum modules for testing and demonstration
const DEFAULT_MOCK_MODULES = [
  {
    id: 'mod-1',
    title: 'Module 1: Introduction & Core Concepts',
    description: 'Overview of fundamental principles, setup environment, and basic syntax walkthrough.',
    duration: '1h 30m',
    lessonsCount: 4
  },
  {
    id: 'mod-2',
    title: 'Module 2: Advanced State Management & Architecture',
    description: 'Deep dive into hooks, state patterns, side effects, and optimized data flows.',
    duration: '2h 15m',
    lessonsCount: 6
  },
  {
    id: 'mod-3',
    title: 'Module 3: API Integration & Async Workflows',
    description: 'Handling REST endpoints, authentication tokens, caching, and error boundaries.',
    duration: '1h 45m',
    lessonsCount: 5
  },
  {
    id: 'mod-4',
    title: 'Module 4: Testing, Performance & Deployment',
    description: 'Writing unit tests, optimizing component rendering, and automated build pipelines.',
    duration: '2h 00m',
    lessonsCount: 4
  }
];

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetches course details by ID
   */
  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const courseRes = await fetchCourseById(courseId);

      if (courseRes && courseRes.data) {
        setCourse(courseRes.data);
      } else {
        throw new Error('Course record not found.');
      }
    } catch (err) {
      console.error('Failed to fetch course details:', err);
      setError(err.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-2 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-600" />
        <span className="text-xs font-medium">Loading course metrics...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xs font-medium text-slate-500">{error || 'Course record not found.'}</p>
        <button
          onClick={() => navigate('/admin/courses')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Back to Course Directory
        </button>
      </div>
    );
  }

  // Uses API modules if provided, otherwise falls back to mock curriculum data
  const curriculumModules = course.modules && course.modules.length > 0 
    ? course.modules 
    : DEFAULT_MOCK_MODULES;

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1200px] mx-auto min-h-screen p-4 sm:p-6 bg-slate-50/30">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/courses')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Directory</span>
        </button>

        <button
          type="button"
          onClick={loadDetails}
          className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
          title="Refresh Course Details"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Details Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3 flex-1">
          
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {course.code && (
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                {course.code}
              </span>
            )}
            {course.category && (
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-100">
                {course.category}
              </span>
            )}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
              course.isActive !== false 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {course.isActive !== false ? 'Active' : 'Draft / Inactive'}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{course.title}</h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            {course.description || 'No description provided for this course.'}
          </p>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-2 flex-wrap">
            {course.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Duration: <strong>{course.duration}</strong></span>
              </div>
            )}
            {course.price !== undefined && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Price: <strong>{course.price ? `₹${course.price}` : 'Free'}</strong></span>
              </div>
            )}
            {course.createdAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Created: <strong>{new Date(course.createdAt).toLocaleDateString("en-IN")}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Instructor / Trainer Card */}
        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l md:pl-6 border-slate-100 pt-4 md:pt-0 min-w-[220px]">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-2">
            Primary Trainer
          </span>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
              {course.trainer_name ? course.trainer_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-800 block truncate">
                {course.trainer_name || 'Unassigned'}
              </span>
              {course.trainer_email ? (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono truncate mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  {course.trainer_email}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic">No trainer email</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum & Modules Section */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            Course Curriculum & Modules
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {curriculumModules.length} Modules Total
          </span>
        </div>

        <div className="space-y-3">
          {curriculumModules.map((mod, index) => (
            <div 
              key={mod.id || index}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{mod.title || `Module ${index + 1}`}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {mod.description || 'Comprehensive module covering core domain topics.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:shrink-0 text-[10px] font-mono font-semibold text-slate-500 self-end sm:self-center">
                {mod.lessonsCount && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200/80">
                    {mod.lessonsCount} Lessons
                  </span>
                )}
                {mod.duration && (
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80">
                    {mod.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}