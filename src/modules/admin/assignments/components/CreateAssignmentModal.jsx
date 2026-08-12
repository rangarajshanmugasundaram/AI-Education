import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Trash2 } from 'lucide-react';
import { fetchBatches } from '../../../../services/features/batchService';
import { createAssignment, updateAssignment } from '../../../../services/features/assignmentService';

export default function CreateAssignmentModal({ isOpen, onClose, assignmentToEdit, onSuccess }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    course_name: 'General Curriculum',
    batch_code: '',
    description: '',
    total_marks: 100,
    passing_marks: 40,
    due_date: '',
    status: 'Draft',
    instructions: '',
    attachments: ['']
  });

  useEffect(() => {
    if (isOpen) {
      fetchBatches()
        .then((res) => {
          const list = Array.isArray(res) ? res : (res?.data || res?.results || []);
          setBatches(list);
        })
        .catch((err) => console.error(err));

      if (assignmentToEdit) {
        setFormData({
          title: assignmentToEdit.title || '',
          course_name: assignmentToEdit.course_name || 'General Curriculum',
          batch_code: assignmentToEdit.batch_code || '',
          description: assignmentToEdit.description || '',
          total_marks: assignmentToEdit.total_marks || 100,
          passing_marks: assignmentToEdit.passing_marks || 40,
          due_date: assignmentToEdit.due_date ? assignmentToEdit.due_date.slice(0, 16) : '',
          status: assignmentToEdit.status || 'Draft',
          instructions: assignmentToEdit.instructions || '',
          attachments: assignmentToEdit.attachments?.length ? assignmentToEdit.attachments : ['']
        });
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);

        setFormData({
          title: '',
          course_name: 'General Curriculum',
          batch_code: '',
          description: '',
          total_marks: 100,
          passing_marks: 40,
          due_date: tomorrow.toISOString().slice(0, 16),
          status: 'Draft',
          instructions: '',
          attachments: ['']
        });
      }
    }
  }, [isOpen, assignmentToEdit]);

  if (!isOpen) return null;

  const handleAttachmentChange = (index, value) => {
    const updated = [...formData.attachments];
    updated[index] = value;
    setFormData({ ...formData, attachments: updated });
  };

  const addAttachmentField = () => {
    setFormData({ ...formData, attachments: [...formData.attachments, ''] });
  };

  const removeAttachmentField = (index) => {
    setFormData({ ...formData, attachments: formData.attachments.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanData = {
        ...formData,
        attachments: formData.attachments.filter((a) => a.trim() !== '')
      };

      if (assignmentToEdit?.assignment_id || assignmentToEdit?._id) {
        await updateAssignment(assignmentToEdit.assignment_id || assignmentToEdit._id, cleanData);
      } else {
        await createAssignment(cleanData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {assignmentToEdit ? 'Edit Assignment' : 'Create New Assignment'}
              </h3>
              <p className="text-[11px] text-slate-500">Configure homework instructions, due dates, and marks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Assignment Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Build a REST API with Authentication"
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Batch</label>
              <select
                required
                value={formData.batch_code}
                onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 cursor-pointer"
              >
                <option value="">-- Choose Batch --</option>
                {batches.map((b) => (
                  <option key={b._id || b.id || b.code} value={b.code || b.name}>
                    {b.name || b.code} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Course Name</label>
              <input
                type="text"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Due Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({ ...formData, total_marks: Number(e.target.value) })}
                className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of what students need to accomplish..."
              className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed Instructions</label>
            <textarea
              rows="3"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Provide step-by-step instructions or submission guidelines..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-900 resize-none"
            />
          </div>

          {/* Reference Files / Attachment Links */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Reference Document Links</label>
              <button
                type="button"
                onClick={addAttachmentField}
                className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>

            {formData.attachments.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleAttachmentChange(idx, e.target.value)}
                  placeholder="https://drive.google.com/... or project spec URL"
                  className="w-full px-3 h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                />
                {formData.attachments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttachmentField(idx)}
                    className="text-rose-500 p-1 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 h-9 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Assignment'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}