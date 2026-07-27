import { useState } from 'react';
import feedbackService from '../../../../services/features/feedbackService';

export function FeedbackModal({ sessionId, trainerId, currentUser, isOpen, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [selectedTag, setSelectedTag] = useState('Good');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await feedbackService.submitFeedback({
        session_id: sessionId,
        student_id: currentUser?.email || localStorage.getItem('user_email'),
        trainer_id: trainerId || 'trainer_01',
        rating: Number(rating),
        review: review.trim(),
        tags: selectedTag
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to submit feedback.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[20000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col gap-5 text-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🎓</span>
          <h3 className="text-xl font-bold text-slate-900">Rate Your Class Session</h3>
          <p className="text-xs text-slate-500 mt-1">
            How was your learning experience in room <span className="font-mono font-bold text-indigo-600">{sessionId}</span>?
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Star Selection */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform active:scale-125 ${
                  star <= rating ? 'text-amber-400 scale-110' : 'text-slate-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Tags Selection */}
          <div className="flex items-center justify-center gap-2">
            {['Excellent', 'Good', 'Average', 'Poor'].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Review Text Area */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Review / Comments (Optional)</label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share what went well or what could be improved..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🌟 CRITICAL FIX: Add default export below
export default FeedbackModal;