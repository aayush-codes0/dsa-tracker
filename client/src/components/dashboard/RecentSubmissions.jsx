import { useEffect, useState } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { submissions as subApi } from '../../api/api';
import DifficultyBadge from '../common/DifficultyBadge';
import StatusBadge from '../common/StatusBadge';
import { timeAgo } from '../../utils/helpers';

export default function RecentSubmissions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subApi.getRecent().then(r => setData(r.data.submissions || r.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-dark-100 mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-dark-700/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-dark-100 mb-4">Recent Submissions</h3>
      {data.length === 0 ? (
        <p className="text-dark-500 text-sm text-center py-8">No submissions yet. Start solving!</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((s, i) => (
            <div
              key={s.submission_id || i}
              className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 hover:bg-dark-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-medium text-white truncate">{s.title || s.problem_title}</p>
                  {s.language_used && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {s.language_used}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <DifficultyBadge difficulty={s.difficulty} />
                  <StatusBadge status={s.status} />
                  
                  {s.time_taken_min && (
                    <span className="text-xs text-slate-400 flex items-center gap-1" title="Time Taken">
                      ⏱️ {s.time_taken_min}m
                    </span>
                  )}
                  {s.confidence && (
                    <span className="text-xs text-slate-400 flex items-center gap-1" title="Confidence">
                      🧠 {s.confidence}/5
                    </span>
                  )}
                  {s.attempts > 1 && (
                    <span className="text-xs text-slate-400 flex items-center gap-1" title="Attempts">
                      🔄 {s.attempts}
                    </span>
                  )}
                </div>
                
                {s.approach_used && (
                  <div className="text-xs text-slate-400 bg-slate-900/80 p-2 rounded-md border border-slate-800/50 line-clamp-2" title={s.approach_used}>
                    <span className="text-emerald-500/70 font-medium mr-1">Approach:</span>
                    {s.approach_used}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-dark-500 text-xs ml-3 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{timeAgo(s.submitted_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
