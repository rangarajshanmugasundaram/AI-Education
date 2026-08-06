import React from 'react';

export default function CourseFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl"
      >
        <h2 className="text-base font-bold text-slate-900">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h2>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Title</label>
          <input
            required
            type="text"
            placeholder="e.g. Full-Stack Web Development"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Code</label>
          <input
            required
            type="text"
            placeholder="e.g. CS101"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g. Programming"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration</label>
            <input
              type="text"
              placeholder="e.g. 6 Weeks"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
          <textarea
            placeholder="Overview of curriculum..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded text-xs h-20 focus:outline-none focus:border-slate-400 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer shadow-xs"
          >
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
}