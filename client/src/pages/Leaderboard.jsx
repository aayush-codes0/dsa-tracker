import { useState, useEffect } from 'react';
import { leaderboard as leaderboardApi } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await leaderboardApi.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-slate-300" />;
      case 2: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-bold text-slate-500 w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-extrabold text-white mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          Global Leaderboard
        </h1>
        <p className="text-slate-400">See how you stack up against other developers. Rank is determined by total solved problems and current streak.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-w-4xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium text-center w-24">Rank</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium text-right">Problems Solved</th>
                <th className="px-6 py-4 font-medium text-right">Current Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No users found on the leaderboard.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr 
                    key={user.user_id || index} 
                    className={`transition-colors ${index < 3 ? 'bg-slate-800/20' : 'hover:bg-slate-800/20'}`}
                  >
                    <td className="px-6 py-4 flex justify-center items-center">
                      {getRankIcon(index)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white text-base">
                      {user.username}
                      {index === 0 && <span className="ml-2 text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">Top Solver</span>}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-400 text-lg">
                      {user.total_solved || 0}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-amber-500">
                      {user.current_streak || 0} 🔥
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
