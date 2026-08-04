import { useState } from 'react';
import { GraduationCap, Star, AlertCircle, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-[20000] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl p-5 sm:p-7 max-w-md w-full shadow-xl border border-slate-200/80 flex flex-col gap-4 text-slate-800">
        
        {/* Banner */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center mx-auto mb-2 text-slate-700">
            <GraduationCap className="w-5 h-5 text-slate-800" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Rate Your Class Session</h3>
          <p className="text-xs text-slate-500">
            How was your learning experience in room <span className="font-mono font-bold text-slate-800">{sessionId}</span>?
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-lg font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
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
                className="p-1 transition-transform active:scale-125 cursor-pointer"
              >
                <Star 
                  className={`w-7 h-7 transition-colors ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* Tags Selection */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {['Excellent', 'Good', 'Average', 'Poor'].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Review Text Area */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Review / Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share what went well or what could be improved..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-slate-900 transition-all resize-none text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-9 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;