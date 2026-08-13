import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, UserCheck, Mail } from 'lucide-react';
import { generateCertificate } from '../../../../services/features/certificateService';
import { fetchUsers } from '../../../../services/features/userService';
import { fetchCourses } from '../../../../services/features/courseService';

export default function GenerateCertificateModal({ isOpen, onClose, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    course_name: '',
    batch_code: '',
    completion_date: new Date().toISOString().slice(0, 10),
    issue_date: new Date().toISOString().slice(0, 10),
    grade_achieved: 'Pass'
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingUsers(true);

      // Fetch registered users and filter ONLY registered students
      Promise.all([
        fetchUsers({ role: 'student' }),
        fetchCourses()
      ])
        .then(([usersRes, coursesRes]) => {
          const userList = Array.isArray(usersRes) ? usersRes : (usersRes?.data || usersRes?.results || []);
          const studentOnlyList = userList.filter(
            (u) => (u.role || '').toLowerCase() === 'student'
          );
          setStudents(studentOnlyList);

          const courseList = Array.isArray(coursesRes) ? coursesRes : (coursesRes?.data || coursesRes?.results || []);
          setCourses(courseList);
        })
        .catch((err) => console.error("Failed to load modal options:", err))
        .finally(() => setLoadingUsers(false));

      setSelectedStudentId('');
      setFormData({
        student_name: '',
        student_email: '',
        course_name: '',
        batch_code: '',
        completion_date: new Date().toISOString().slice(0, 10),
        issue_date: new Date().toISOString().slice(0, 10),
        grade_achieved: 'Pass'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle student selection & auto-fill verified email/name
  const handleStudentSelect = (e) => {
    const sId = e.target.value;
    setSelectedStudentId(sId);

    const studentObj = students.find((s) => str(s._id || s.id) === str(sId));
    if (studentObj) {
      const computedName = studentObj.name || `${studentObj.first_name || ''} ${studentObj.last_name || ''}`.strip() || 'Student';
      const studentEmail = studentObj.email || '';
      
      // Auto-extract active batch code if available
      const primaryBatch = studentObj.batch_ids?.length > 0 ? studentObj.batch_ids[0] : '';

      setFormData((prev) => ({
        ...prev,
        student_name: computedName,
        student_email: studentEmail,
        batch_code: prev.batch_code || primaryBatch
      }));
    } else {
      setFormData((prev) => ({ ...prev, student_name: '', student_email: '' }));
    }
  };

  const str = (val) => String(val || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_email) {
      alert("Please select a registered student.");
      return;
    }

    setLoadingSubmit(true);
    try {
      await generateCertificate(formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to generate certificate:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Issue Course Certificate</h3>
              <p className="text-[11px] text-slate-500">Select a verified registered student to issue certificate</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Registered Student Select Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
              <span>Select Registered Student</span>
              {loadingUsers && <span className="text-indigo-600 font-mono text-[9px] lowercase">loading roster...</span>}
            </label>

            <select
              required
              value={selectedStudentId}
              onChange={handleStudentSelect}
              className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 cursor-pointer font-medium"
            >
              <option value="">-- Choose Registered Student --</option>
              {students.map((s) => {
                const sId = s._id || s.id;
                const sName = s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Student';
                return (
                  <option key={sId} value={sId}>
                    {sName} ({s.email})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Verification Badge for Auto-filled Email */}
          {formData.student_email && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{formData.student_name}</div>
                <div className="text-[11px] font-mono text-indigo-700 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-500" /> {formData.student_email}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Verified Registered Account
                </div>
              </div>
            </div>
          )}

          {/* Course & Batch Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Course Name</label>
              <select
                required
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 cursor-pointer"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((c) => (
                  <option key={c._id || c.id || c.title} value={c.title || c.name}>
                    {c.title || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Batch Code</label>
              <input
                type="text"
                value={formData.batch_code}
                onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
                placeholder="e.g. BATCH-2026-A"
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono focus:bg-white focus:border-slate-900"
              />
            </div>
          </div>

          {/* Dates and Grade */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Completion Date</label>
              <input
                type="date"
                required
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                className="w-full px-2 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Issue Date</label>
              <input
                type="date"
                required
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full px-2 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Grade Achieved</label>
              <select
                value={formData.grade_achieved}
                onChange={(e) => setFormData({ ...formData, grade_achieved: e.target.value })}
                className="w-full px-2 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg cursor-pointer font-medium"
              >
                <option value="Pass with Distinction">Distinction</option>
                <option value="Merit">Merit</option>
                <option value="Pass">Pass</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingSubmit || !formData.student_email}
              className="px-5 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {loadingSubmit ? 'Generating...' : 'Issue Certificate'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}