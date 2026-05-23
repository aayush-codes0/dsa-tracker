import { useState, useEffect } from 'react';
import { contests as contestsApi, dailyChallenge as dailyChallengeApi } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Trophy, Calendar, ExternalLink, Sparkles } from 'lucide-react';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [dailyProblem, setDailyProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const [{ data: contestsData }, { data: dailyData }] = await Promise.all([
        contestsApi.getAll(),
        dailyChallengeApi.getToday().catch(() => ({ data: null }))
      ]);
      setContests(contestsData);
      setDailyProblem(dailyData);
    } catch (err) {
      setError('Failed to load contests data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Contests & Daily Challenge
        </h1>
        <p className="text-slate-400 mt-1">Track your performance and solve the daily problem.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
          {error}
        </div>
      )}

      {dailyProblem && (
        <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="w-32 h-32 text-indigo-400" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Daily Challenge
            </h2>
            <p className="text-slate-400 mb-4 text-sm">A new random problem to solve every day!</p>
            
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-4 sm:max-w-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-white">{dailyProblem.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {dailyProblem.topic_name || 'General'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border ${dailyProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : dailyProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {dailyProblem.difficulty}
                  </span>
                </div>
              </div>
              
              {dailyProblem.problem_url && (
                <a 
                  href={dailyProblem.problem_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Solve Now <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {contests.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
          No contests recorded yet. Add your past contests to track ratings!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <div key={contest.contest_id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{contest.platform}</h3>
                {contest.contest_url && (
                  <a href={contest.contest_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(contest.contest_date).toLocaleDateString()}
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-slate-800">
                  <span className="text-slate-400 text-sm">Rating Change</span>
                  <span className={`font-medium ${contest.rating_change > 0 ? 'text-emerald-500' : contest.rating_change < 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                    {contest.rating_change > 0 ? '+' : ''}{contest.rating_change}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-slate-800">
                  <span className="text-slate-400 text-sm">New Rating</span>
                  <span className="font-bold text-white">{contest.new_rating}</span>
                </div>

                {contest.rank && (
                  <div className="flex justify-between items-center py-2 border-t border-slate-800">
                    <span className="text-slate-400 text-sm">Global Rank</span>
                    <span className="font-medium text-amber-500">#{contest.rank}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
