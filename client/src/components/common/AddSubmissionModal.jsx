import { useState } from 'react';
import Modal from './Modal';
import { submissions as submissionsApi } from '../../api/api';

export default function AddSubmissionModal({ isOpen, onClose, problem, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    status: 'Accepted',
    time_taken_min: '',
    language_used: 'C++',
    confidence: '3',
    approach_used: '',
    attempts: '1'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submissionsApi.create({
        problem_id: problem.problem_id,
        status: formData.status,
        time_taken_min: formData.time_taken_min ? parseInt(formData.time_taken_min) : null,
        language_used: formData.language_used,
        confidence: parseInt(formData.confidence),
        approach_used: formData.approach_used,
        attempts: parseInt(formData.attempts)
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit problem');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!problem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit: ${problem.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 rounded-lg p-3 text-rose-400 text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Accepted">Accepted</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="TLE">Time Limit Exceeded</option>
              <option value="Runtime Error">Runtime Error</option>
              <option value="MLE">Memory Limit Exceeded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
            <select
              name="language_used"
              value={formData.language_used}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Time (mins)</label>
            <input
              type="number"
              name="time_taken_min"
              value={formData.time_taken_min}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 20"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Attempts</label>
            <input
              type="number"
              name="attempts"
              value={formData.attempts}
              onChange={handleChange}
              min="1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confidence (1-5)</label>
            <input
              type="number"
              name="confidence"
              value={formData.confidence}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Approach Used</label>
          <textarea
            name="approach_used"
            value={formData.approach_used}
            onChange={handleChange}
            placeholder="e.g. Used two pointers to solve in O(n) time."
            rows="2"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
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
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Submission'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
