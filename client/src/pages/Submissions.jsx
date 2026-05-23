import { useState, useEffect } from 'react';
import { submissions as submissionsApi } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { Clock } from 'lucide-react';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data } = await submissionsApi.getAll();
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Submissions</h1>
        <p className="text-slate-400 mt-1">Your recent problem solving history.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Problem</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Language</th>
                <th className="px-6 py-4 font-medium">Time (Mins)</th>
                <th className="px-6 py-4 font-medium">Confidence</th>
                <th className="px-6 py-4 font-medium">Approach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No submissions yet. Start solving problems!
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.submission_id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      {new Date(sub.submitted_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {sub.problem_title}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                        {sub.language_used || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {sub.time_taken_min ? `${sub.time_taken_min}m` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {sub.confidence ? `${sub.confidence}/5` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={sub.approach_used || ''}>
                      {sub.approach_used || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
