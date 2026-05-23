import { useState } from 'react';
import Modal from './Modal';
import { notes as notesApi } from '../../api/api';

export default function AddNoteModal({ isOpen, onClose, problem, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      await notesApi.create({
        problem_id: problem.problem_id,
        content: content
      });
      setContent('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Note: ${problem.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 rounded-lg p-3 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Your Note</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write down your key insights, tricky edge cases, or approach for this problem..."
            rows="5"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
